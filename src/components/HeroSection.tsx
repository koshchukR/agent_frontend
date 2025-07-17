import React from 'react';
import { PhoneIcon, SearchIcon, BarChartIcon, BriefcaseIcon } from 'lucide-react';
export const HeroSection = () => {
  return <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              AI-Powered Candidate Screening That Works
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Revolutionize your hiring with voice conversations, comprehensive
              research, and intelligent matching.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-indigo-50 transition-colors">
                Get Started
              </button>
              <button className="bg-transparent border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-10">
            <div className="bg-white rounded-lg shadow-xl p-6 text-gray-800">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <PhoneIcon size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium">AI Voice Screening</h3>
                  <p className="text-sm text-gray-500">
                    In progress with Sarah Johnson
                  </p>
                </div>
                <div className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Live
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">
                    Tell me about your experience with Python development?
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg ml-4">
                  <p className="text-sm">
                    I've worked with Python for 5 years, primarily building data
                    analysis tools and APIs...
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">
                    How have you implemented CI/CD pipelines in your previous
                    roles?
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 border-t pt-3">
                <span>12 minutes elapsed</span>
                <span>8 questions completed</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[{
          icon: <PhoneIcon size={20} />,
          text: 'Dynamic AI Conversations'
        }, {
          icon: <SearchIcon size={20} />,
          text: 'Comprehensive Candidate Research'
        }, {
          icon: <BarChartIcon size={20} />,
          text: 'Smart Ranking & Comparison'
        }, {
          icon: <BriefcaseIcon size={20} />,
          text: 'AI Bot Detection'
        }].map((item, index) => <div key={index} className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                {item.icon}
              </div>
              <span className="font-medium">{item.text}</span>
            </div>)}
        </div>
      </div>
    </section>;
};