"use client";
import { useState } from "react";
import Rectangle from "@/public/Rectangle.png";
import Student8 from "@/public/Student8.svg";
import Student from "@/public/Students.png";
export function CultivateThink() {
  const [selectedAge, setSelectedAge] = useState("8-10");

  // Age-specific content data
  const ageContent = {
    "5-7": {
      skills: [
        {
          title: "Basic Number Recognition",
          description: "Learn to recognize numbers 1-20\nCount objects and understand quantity",
          icon: "1",
          bgColor: "from-green-400 to-green-600",
          iconType: "number"
        },
        {
          title: "Simple Shapes",
          description: "Identify basic shapes like circles, squares, triangles\nSort objects by shape and color",
          bgColor: "from-red-400 to-red-600",
          iconType: "shape"
        },
        {
          title: "Pattern Recognition",
          description: "Complete simple patterns with colors and shapes\nUnderstand 'what comes next' sequences",
          bgColor: "from-yellow-400 to-yellow-600",
          iconType: "pattern"
        },
        {
          title: "Basic Problem Solving",
          description: "Solve simple puzzles and matching games\nUse trial and error to find solutions",
          bgColor: "from-purple-400 to-purple-600",
          iconType: "puzzle"
        }
      ]
    },
    "8-10": {
      skills: [
        {
          title: "Number Sense and Operations",
          description: "Fluently compose and decompose numbers within 10\nUnderstand addition and subtraction within 10",
          icon: "3",
          bgColor: "from-green-400 to-green-600",
          iconType: "number"
        },
        {
          title: "Geometry",
          description: "Recognize 2D and 3D shapes\nIdentify defining attributes of shapes (edges, vertices, cross sections, nets, etc.)",
          bgColor: "from-red-400 to-red-600",
          iconType: "shape"
        },
        {
          title: "Logic and Patterns",
          description: "Use analogical reasoning to solve Sudoku puzzles and understand the concept of cycles",
          bgColor: "from-yellow-400 to-yellow-600",
          iconType: "pattern"
        },
        {
          title: "Problem Solving",
          description: "Learn tangram puzzles and practice creating shapes using tangram pieces\nMeasure by iterating length units",
          bgColor: "from-green-400 to-green-600",
          iconType: "puzzle"
        }
      ]
    },
    "11-13": {
      skills: [
        {
          title: "Advanced Mathematics",
          description: "Master multiplication and division concepts\nWork with fractions and decimal numbers",
          icon: "×",
          bgColor: "from-blue-400 to-blue-600",
          iconType: "number"
        },
        {
          title: "Complex Geometry",
          description: "Calculate area and perimeter of various shapes\nUnderstand coordinate systems and graphing",
          bgColor: "from-indigo-400 to-indigo-600",
          iconType: "shape"
        },
        {
          title: "Advanced Logic",
          description: "Solve complex logic puzzles and brain teasers\nUnderstand algebraic thinking and variables",
          bgColor: "from-orange-400 to-orange-600",
          iconType: "pattern"
        },
        {
          title: "Critical Thinking",
          description: "Analyze data and create graphs\nSolve multi-step word problems with reasoning",
          bgColor: "from-teal-400 to-teal-600",
          iconType: "puzzle"
        }
      ]
    }
  };

  const currentContent = ageContent[selectedAge as keyof typeof ageContent];

  // Get the appropriate image based on selected age
  const getAgeImage = () => {
    switch (selectedAge) {
      case "5-7":
        return Rectangle;
      case "8-10":
        return Student8;
      case "11-13":
        return Student;
      default:
        return Rectangle;
    }
  };

  const renderSkillIcon = (skill: any, index: number) => {
    switch (skill.iconType) {
      case "number":
        return (
          <div className={`bg-gradient-to-br ${skill.bgColor} p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0 relative shadow-lg`}>
            <div className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-gray-800 text-sm md:text-lg font-bold">{skill.icon || (index + 1)}</span>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-orange-400 rounded-full"></div>
          </div>
        );
      case "shape":
        return (
          <div className={`bg-gradient-to-br ${skill.bgColor} p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0 relative shadow-lg`}>
            <div className="w-6 h-4 md:w-8 md:h-6 bg-yellow-400 rounded-sm"></div>
            <div className="absolute top-2 right-2 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full"></div>
          </div>
        );
      case "pattern":
        return (
          <div className={`bg-gradient-to-br ${skill.bgColor} p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0 relative shadow-lg`}>
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
        );
      case "puzzle":
        return (
          <div className={`bg-gradient-to-br ${skill.bgColor} p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0 relative shadow-lg`}>
            <div className="w-5 h-5 md:w-6 md:h-6 bg-yellow-400 transform rotate-45"></div>
            <div className="absolute top-2 right-2 w-3 h-3 md:w-4 md:h-4 bg-green-700 transform rotate-12"></div>
          </div>
        );
      default:
        return (
          <div className={`bg-gradient-to-br ${skill.bgColor} p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0 relative shadow-lg`}>
            <div className="w-5 h-5 md:w-6 md:h-6 bg-yellow-400 rounded-full"></div>
          </div>
        );
    }
  };
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
          <div className="order-2 lg:order-1 flex justify-center items-center p-4">
            <div className="relative">
              {/* Outer decorative circle */}
              <div className="absolute inset-0 w-80 h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] rounded-full bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 shadow-2xl transform -rotate-3"></div>
              
              {/* Main image container */}
              <div className="relative w-72 h-72 md:w-88 md:h-88 lg:w-[380px] lg:h-[380px] rounded-full overflow-hidden bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 shadow-xl border-4 border-white transform translate-x-2 translate-y-2">
                <img 
                  src={getAgeImage().src} 
                  alt={`Cultivate Think - ${selectedAge} years old`} 
                  className="w-full h-full object-cover object-center transition-all duration-500 ease-in-out scale-110" 
                />
                
                {/* Decorative overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-yellow-50/20 pointer-events-none"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-400 rounded-full shadow-lg animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-pink-400 rounded-full shadow-lg"></div>
              <div className="absolute top-1/4 -left-6 w-4 h-4 bg-yellow-400 rounded-full shadow-md"></div>
            </div>
          </div>

          {/* Right Side - Skills List */}
          <div className="space-y-6 md:space-y-8 order-1 lg:order-2 transition-all duration-500 ease-in-out">
            {currentContent.skills.map((skill, index) => (
              <div 
                key={`${selectedAge}-${index}`}
                className="flex items-start space-x-3 md:space-x-4 opacity-0 animate-fadeInUp"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                {renderSkillIcon(skill, index)}
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 transition-colors duration-300">
                    {skill.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed mt-1 transition-colors duration-300">
                    {skill.description.split('\n').map((line, lineIndex) => (
                      <span key={lineIndex}>
                        {line}
                        {lineIndex < skill.description.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
