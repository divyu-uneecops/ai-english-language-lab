"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";

export interface FilterOption {
  key: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  children?: FilterOption[];
}

export interface FilterCategory {
  key: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  options: FilterOption[];
  type: "checkbox" | "radio" | "select";
  multiSelect?: boolean;
}

export interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: FilterCategory[];
  selectedFilters: Record<string, string[]>;
  onFiltersChange: (filters: Record<string, string[]>) => void;
  onApply: () => void;
}

export function FilterDialog({
  open,
  onOpenChange,
  categories,
  selectedFilters,
  onFiltersChange,
  onApply,
}: FilterDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]?.key || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOptions, setExpandedOptions] = useState<
    Record<string, boolean>
  >({});
  const [tempFilters, setTempFilters] = useState<Record<string, string[]>>({});

  // Initialize temp filters when dialog opens
  useEffect(() => {
    if (open) {
      setTempFilters(selectedFilters);
    }
  }, [open, selectedFilters]);

  const filteredCategories = categories;

  const currentCategory = categories.find(
    (cat) => cat.key === selectedCategory
  );

  // Helper function to check if a parent option has any selected children
  const hasSelectedChildren = (option: FilterOption): boolean => {
    if (!option.children) return false;
    return option.children.some((child) =>
      (tempFilters[currentCategory?.key || ""] || []).includes(child.key)
    );
  };

  // Helper function to get parent selection state (none, partial, all)
  const getParentSelectionState = (
    option: FilterOption
  ): "none" | "partial" | "all" => {
    if (!option.children) return "none";

    const selectedChildren = option.children.filter((child) =>
      (tempFilters[currentCategory?.key || ""] || []).includes(child.key)
    );

    if (selectedChildren.length === 0) return "none";
    if (selectedChildren.length === option.children.length) return "all";
    return "partial";
  };

  // Helper function to toggle all children of a parent option
  const toggleAllChildren = (option: FilterOption, checked: boolean) => {
    if (!option.children) return;

    const currentValues = tempFilters[currentCategory?.key || ""] || [];
    let newValues: string[];

    if (checked) {
      // Add all children
      const childKeys = option.children.map((child) => child.key);
      newValues = [...new Set([...currentValues, ...childKeys])];
    } else {
      // Remove all children
      const childKeys = option.children.map((child) => child.key);
      newValues = currentValues.filter((value) => !childKeys.includes(value));
    }

    setTempFilters({
      ...tempFilters,
      [currentCategory?.key || ""]: newValues,
    });
  };

  const handleOptionToggle = (categoryKey: string, optionKey: string) => {
    const currentValues = tempFilters[categoryKey] || [];
    const isSelected = currentValues.includes(optionKey);

    let newValues: string[];
    if (isSelected) {
      newValues = currentValues.filter((value) => value !== optionKey);
    } else {
      if (currentCategory?.multiSelect === false) {
        newValues = [optionKey];
      } else {
        newValues = [...currentValues, optionKey];
      }
    }

    setTempFilters({
      ...tempFilters,
      [categoryKey]: newValues,
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(tempFilters).reduce(
      (total, values) => total + values.length,
      0
    );
  };

  const hasActiveFilters = () => {
    return getActiveFiltersCount() > 0;
  };

  const handleClearAll = () => {
    const clearedFilters: Record<string, string[]> = {};
    categories.forEach((category) => {
      clearedFilters[category.key] = [];
    });
    setTempFilters(clearedFilters);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden rounded-2xl shadow-2xl border-0 bg-white">
        <div className="flex h-[500px]">
          {/* Left Panel - Filter Categories */}
          <div className="w-1/3 border-r bg-gradient-to-br from-yellow-50 via-white to-orange-50">
            <div className="p-6">
              <div className="space-y-2">
                {filteredCategories.map((category) => {
                  const isSelected = selectedCategory === category.key;
                  const hasSelectedOptions =
                    (tempFilters[category.key] || []).length > 0;

                  return (
                    <button
                      key={category.key}
                      onClick={() => setSelectedCategory(category.key)}
                      className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${
                        isSelected
                          ? "bg-gradient-to-r from-orange-100 to-orange-200 border border-orange-300 text-orange-900 shadow-md"
                          : "hover:bg-white/80 backdrop-blur-sm text-gray-700 hover:shadow-md border border-transparent hover:border-orange-200/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {category.icon && (
                            <div
                              className={`p-2 rounded-xl ${
                                isSelected
                                  ? "bg-orange-200 text-orange-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {category.icon}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-sm">
                              {category.label}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {hasSelectedOptions && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          )}
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel - Filter Options */}
          <div className="flex-1 p-8 overflow-y-auto bg-white/80 backdrop-blur-sm">
            {currentCategory ? (
              <div>
                <div className="space-y-3">
                  {currentCategory.options.map((option) => {
                    const isSelected = (
                      tempFilters[currentCategory.key] || []
                    ).includes(option.key);
                    const hasChildren =
                      option.children && option.children.length > 0;
                    const isExpanded = expandedOptions[option.key] || false;
                    const parentState = hasChildren
                      ? getParentSelectionState(option)
                      : "none";

                    return (
                      <div
                        key={option.key}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        {/* Parent Option */}
                        <div className="flex items-center justify-between p-3">
                          <label className="flex items-center space-x-3 cursor-pointer flex-1">
                            <input
                              type={
                                currentCategory.type === "radio"
                                  ? "radio"
                                  : "checkbox"
                              }
                              name={
                                currentCategory.type === "radio"
                                  ? currentCategory.key
                                  : undefined
                              }
                              checked={
                                hasChildren ? parentState === "all" : isSelected
                              }
                              ref={(input) => {
                                if (input && hasChildren) {
                                  input.indeterminate =
                                    parentState === "partial";
                                }
                              }}
                              onChange={() => {
                                if (hasChildren) {
                                  toggleAllChildren(
                                    option,
                                    parentState !== "all"
                                  );
                                } else {
                                  handleOptionToggle(
                                    currentCategory.key,
                                    option.key
                                  );
                                }
                              }}
                              className={`w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 ${
                                currentCategory.type === "radio"
                                  ? "rounded-full"
                                  : ""
                              }`}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                {option.icon && (
                                  <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl text-orange-600">
                                    {option.icon}
                                  </div>
                                )}
                                <span className="text-sm font-semibold text-gray-900">
                                  {option.label}
                                </span>
                              </div>
                            </div>
                          </label>

                          {/* Expand/Collapse Button for Parent Options */}
                          {hasChildren && (
                            <button
                              onClick={() =>
                                setExpandedOptions((prev) => ({
                                  ...prev,
                                  [option.key]: !prev[option.key],
                                }))
                              }
                              className="p-2 hover:bg-orange-100 rounded-xl transition-colors ml-2"
                            >
                              <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Child Options */}
                        {hasChildren && isExpanded && (
                          <div className="px-3 pb-3 space-y-1">
                            {option.children!.map((child) => {
                              const isChildSelected = (
                                tempFilters[currentCategory.key] || []
                              ).includes(child.key);

                              return (
                                <label
                                  key={child.key}
                                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-orange-50/50 cursor-pointer transition-all duration-200"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChildSelected}
                                    onChange={() =>
                                      handleOptionToggle(
                                        currentCategory.key,
                                        child.key
                                      )
                                    }
                                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      {child.icon && (
                                        <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600">
                                          {child.icon}
                                        </div>
                                      )}
                                      <span className="text-sm font-medium text-gray-700">
                                        {child.label}
                                      </span>
                                    </div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 max-w-md mx-auto">
                  <div className="p-4 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Search className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No filters found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-t border-orange-200/30">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-4">
              {hasActiveFilters() && (
                <Button
                  variant="outline"
                  onClick={handleClearAll}
                  className="px-6 py-2 border-orange-200 text-orange-700 hover:bg-orange-100 hover:border-orange-300 rounded-xl transition-all duration-200"
                >
                  Clear All
                </Button>
              )}
              <Button
                onClick={() => {
                  onFiltersChange(tempFilters);
                  onApply();
                }}
                className="px-8 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
