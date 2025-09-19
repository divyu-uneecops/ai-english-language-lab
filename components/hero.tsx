"use client";

import { Button } from "@/components/ui/button";
import superKid from "@/public/super-kid.svg";
import Vector from "@/public/Vector.svg";
import group from "@/public/Group.svg";
import lightBlueQuotation from "@/public/lightBlueQuotation-c1e33e55045dace856720b23fd131e12.png";
import lightBlueQuotation1 from "@/public/lightBlueQuotationup.svg";    
import {
  Calculator,
  Rocket,
  Star,
  Code,
  Trophy,
  Zap,
  BookOpen,
  Heart,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

export function Hero() {
  const [selectedAge, setSelectedAge] = useState<string | null>(null);

  const ageGroups = [
    { label: "age - 3", value: "3" },
    { label: "age - 4", value: "4" },
    { label: "age - 5", value: "5" },
    { label: "age - 7", value: "7" },
    { label: "age - 7", value: "7-2" },
    { label: "age - 8", value: "8" },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-[40px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center min-h-screen">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            {/* Main Heading */}
            <div className="space-y-4 relative">
              {/* Flag Icon positioned at top-left of heading */}
              <div className="relative z-10">
                {/* Top Right Flag Image - Responsive positioning for all screens */}
                <div className="absolute -top-4 sm:-top-6 lg:-top-10 right-4 sm:right-8 md:right-16 lg:left-[calc(var(--spacing)*47)]">
                  <img
                    src={group.src}
                    alt="Flag"
                    className="w-6 h-3 sm:w-8 sm:h-4 md:w-10 md:h-5 lg:w-[52.3px] lg:h-[26.23px]"
                  />
                </div>

                {/* Decorative Vector Image - Visible on all screens with responsive sizing */}
                <div className="absolute -top-4 sm:-top-6 lg:-top-8 -left-4 sm:-left-6 lg:-left-12 w-24 h-16 sm:w-32 sm:h-24 md:w-48 md:h-36 lg:w-[248.98px] lg:h-[192.88px] opacity-30 sm:opacity-40 z-0">
                  <img
                    src={Vector.src}
                    alt="Decorative line"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-6 sm:space-y-8 pl-0 sm:pl-4 lg:pl-[150px]">
                  {/* Heading Section */}
                  <h1
                    className="font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight"
                    style={{
                      color: '#000000',
                      fontWeight: 700,
                    }}
                  >
                    Making Kids Fall in Love with Math!
                  </h1>

                  {/* Age Group Booking Section */}
                  <div className="space-y-4">
                    <p className="text-gray-600 font-medium text-xs sm:text-sm uppercase tracking-wide">
                      BOOK YOUR FREE CLASS WITH AGE GROUP
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-w-md">
                      {ageGroups.map((age, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedAge(age.value)}
                          className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 font-semibold ${
                            selectedAge === age.value
                              ? "bg-orange-50 text-orange-600"
                              : "bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50"
                          }`}
                          style={{
                            borderRadius: '8.19px',
                            borderWidth: '1.64px 1.64px 4.92px 1.64px',
                            borderStyle: 'solid',
                            borderColor: '#00000026',
                          }}
                        >
                          {age.label}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <Button 
                        className="w-full max-w-sm bg-gradient-to-r from-orange-500 to-orange-600 
                                  hover:from-orange-600 hover:to-orange-700 text-white font-bold 
                                  rounded-xl shadow-lg hover:shadow-xl 
                                  transform hover:scale-105 transition-all duration-200 tracking-normal uppercase
                                  flex items-center justify-center gap-2"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '10px',
                          borderRadius: '9.16px',
                          backgroundColor: '#FF7B3A',
                          color: '#FFFFFF',
                          lineHeight: '100%',
                          letterSpacing: '0%',
                          fontWeight: 'bold',
                          padding: '16px 24px',
                        }}
                      >
                        <ArrowRight 
                          className="w-4 h-4 animate-pulse"
                          style={{
                            animation: 'slideLeftRight 2s ease-in-out infinite'
                          }}
                        />
                        BOOK A FREE LIVE CLASS 
                      </Button>

                      {/* Pricing Info */}
                      <div className="text-center max-w-sm">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-2">
                          <span className="text-xl sm:text-2xl font-bold text-gray-800">
                            <span className="line-through">₹0</span>
                          </span>
                          <span className="text-xs sm:text-sm text-gray-600">For First Class</span>
                          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                            100% Off
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Booked A Demo Already? <span className="text-orange-500 font-medium cursor-pointer hover:underline">JOIN NOW</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative flex justify-center items-center h-64 sm:h-80 md:h-96 lg:h-[500px] order-1 lg:order-2">
            {/* Main hero image */}
            <img 
              src={superKid.src} 
              alt="Hero Image" 
              className="w-auto h-3/4 sm:h-4/5 max-w-[90%] sm:max-w-[85%] lg:max-w-[80%] object-contain mx-auto" 
            />
            
            {/* Top left quotation mark - Responsive sizing and positioning */}
            <img 
              src={lightBlueQuotation.src} 
              alt="Quotation mark" 
              className="absolute bottom-12 sm:bottom-16 lg:bottom-18 left-2 sm:left-4 lg:left-8 w-8 h-6 sm:w-12 sm:h-9 lg:w-16 lg:h-12"
            />
            
            {/* Top right quotation mark - Responsive sizing and positioning */}
            <img 
              src={lightBlueQuotation1.src} 
              alt="Quotation mark" 
              className="absolute top-2 sm:top-3 lg:top-4 right-4 sm:right-8 lg:right-14 w-8 h-6 sm:w-12 sm:h-9 lg:w-16 lg:h-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
