"use client";

import superKid from "@/public/super-kid.svg";
import Vector from "@/public/Vector.svg";
import group from "@/public/Group.svg";
import lightBlueQuotation from "@/public/lightBlueQuotation-c1e33e55045dace856720b23fd131e12.png";
import lightBlueQuotation1 from "@/public/lightBlueQuotationup.svg";

export function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="container mx-auto relative z-10">
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
                    src={group?.src}
                    alt="Flag"
                    className="w-6 h-3 sm:w-8 sm:h-4 md:w-10 md:h-5 lg:w-[52.3px] lg:h-[26.23px]"
                  />
                </div>

                {/* Decorative Vector Image - Visible on all screens with responsive sizing */}
                <div className="absolute -top-4 sm:-top-6 lg:-top-8 -left-4 sm:-left-6 lg:-left-12 w-24 h-16 sm:w-32 sm:h-24 md:w-48 md:h-36 lg:w-[248.98px] lg:h-[192.88px] opacity-30 sm:opacity-40 z-0">
                  <img
                    src={Vector?.src}
                    alt="Decorative line"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-6 sm:space-y-8 pl-0 sm:pl-4 lg:pl-[150px]">
                  {/* Heading Section */}
                  <h1
                    className="font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight"
                    style={{
                      color: "#000000",
                      fontWeight: 700,
                    }}
                  >
                    Making Kids Fall in Love with English
                  </h1>

                  {/* Age Group Booking Section */}
                  <div className="space-y-4">
                    <p className="text-gray-600 font-medium text-xs sm:text-sm uppercase tracking-wide">
                      AI-Powered Learning Experience for English Language
                      Development
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative flex justify-center items-center h-64 sm:h-80 md:h-96 lg:h-[500px] order-1 lg:order-2">
            {/* Main hero image */}
            <img
              src={superKid?.src}
              alt="Hero Image"
              className="w-auto h-3/4 sm:h-4/5 max-w-[90%] sm:max-w-[85%] lg:max-w-[80%] object-contain mx-auto"
            />

            {/* Top left quotation mark - Responsive sizing and positioning */}
            <img
              src={lightBlueQuotation?.src}
              alt="Quotation mark"
              className="absolute bottom-12 sm:bottom-16 lg:bottom-18 left-2 sm:left-4 lg:left-8 w-8 h-6 sm:w-12 sm:h-9 lg:w-16 lg:h-12"
            />

            {/* Top right quotation mark - Responsive sizing and positioning */}
            <img
              src={lightBlueQuotation1?.src}
              alt="Quotation mark"
              className="absolute top-2 sm:top-3 lg:top-4 right-4 sm:right-8 lg:right-14 w-8 h-6 sm:w-12 sm:h-9 lg:w-16 lg:h-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
