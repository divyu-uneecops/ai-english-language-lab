"use client";
import { useState } from "react";
import Rectangle from "@/public/Rectangle.svg";

export function CultivateThink() {
  const [selectedAge, setSelectedAge] = useState("8-10");
  return (
    <section className="py-8 md:py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-2">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 px-4">
            Cultivate Thinking Skills From All Aspects
          </h2>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto mt-4 px-4"  style={{
            fontWeight: 500,
            fontSize: 'clamp(14px, 2vw, 16px)',
            lineHeight: 'clamp(28px, 4vw, 40px)',
            letterSpacing: '0%',
            fontFamily: 'Inter, sans-serif',
        }}>
            Our Expert Advisors Can Help You Find The Right Workplace Solution For You And Your Team
          </p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mt-6 md:mt-8 px-4">
            <div className="flex flex-col sm:flex-row bg-gray-100 rounded-lg p-1 w-full sm:w-auto gap-1 sm:gap-0">
              <button 
                onClick={() => setSelectedAge("5-7")}
                className={`px-4 md:px-6 py-2 text-xs md:text-sm font-medium rounded-md transition-all duration-200 flex-1 sm:flex-none ${
                  selectedAge === "5-7" 
                    ? "bg-orange-500 text-white shadow-sm" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                5-7 years old
              </button>
              <button 
                onClick={() => setSelectedAge("8-10")}
                className={`px-4 md:px-6 py-2 text-xs md:text-sm font-medium rounded-md transition-all duration-200 flex-1 sm:flex-none ${
                  selectedAge === "8-10" 
                    ? "bg-orange-500 text-white shadow-sm" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                8-10 years old
              </button>
              <button 
                onClick={() => setSelectedAge("11-13")}
                className={`px-4 md:px-6 py-2 text-xs md:text-sm font-medium rounded-md transition-all duration-200 flex-1 sm:flex-none ${
                  selectedAge === "11-13" 
                    ? "bg-orange-500 text-white shadow-sm" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                11-13 years old
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex justify-center px-4 md:px-8 lg:px-40 py-6 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center bg-[#FFDFDF] max-w-6xl px-4 md:px-6 lg:px-10 py-6 md:py-5 w-full"
          style={{
              borderTopLeftRadius: 'clamp(80px, 15vw, 176px)',
              borderTopRightRadius: 'clamp(16px, 3vw, 26px)',
              borderBottomRightRadius: 'clamp(16px, 3vw, 26px)',
              borderBottomLeftRadius: 'clamp(16px, 3vw, 26px)',
            }}
          >
          {/* Left Side - Illustration */}
          <div className="order-2 lg:order-1">
          <img src={Rectangle.src} alt="Cultivate Think" className="w-full h-auto object-cover rounded-lg" />
          </div>

          {/* Right Side - Skills List */}
          <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
            {/* Number Sense and Operations */}
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0 relative shadow-lg">
                <div className="text-white text-xl md:text-2xl font-bold">3</div>
                <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-orange-400 rounded-full"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-gray-900"
                >Number Sense and Operations</h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed mt-1">
                  Fluently compose and decompose numbers within 10<br/>
                  Understand addition and subtraction within 10
                </p>
              </div>
            </div>

            {/* Geometry */}
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="bg-gradient-to-br from-red-400 to-red-600 p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0 relative shadow-lg">
                <div className="w-6 h-4 md:w-8 md:h-6 bg-yellow-400 rounded-sm"></div>
                <div className="absolute top-2 right-2 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Geometry</h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed mt-1">
                  Recognize 2D and 3D shapes<br/>
                  Identify defining attributes of shapes (edges, vertices, cross sections, nets, etc.)
                </p>
              </div>
            </div>

            {/* Logic and Patterns */}
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0 relative shadow-lg">
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-sm flex items-center justify-center">
                    <span className="text-yellow-600 text-xs font-bold">3</span>
                  </div>
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-sm flex items-center justify-center">
                    <span className="text-yellow-600 text-xs font-bold">2</span>
                  </div>
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-sm flex items-center justify-center">
                    <span className="text-yellow-600 text-xs font-bold">4</span>
                  </div>
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-sm flex items-center justify-center">
                    <span className="text-yellow-600 text-xs font-bold">6</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Logic and Patterns</h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed mt-1">
                  Use analogical reasoning to solve Sudoku puzzles and understand the concept of cycles
                </p>
              </div>
            </div>

            {/* Problem Solving */}
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0 relative shadow-lg">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-yellow-400 transform rotate-45"></div>
                <div className="absolute top-2 right-2 w-3 h-3 md:w-4 md:h-4 bg-green-700 transform rotate-12"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Problem Solving</h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed mt-1">
                  Learn tangram puzzles and practice creating shapes using tangram pieces<br/>
                  Measure by iterating length units
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
