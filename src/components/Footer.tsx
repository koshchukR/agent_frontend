import React from 'react';
export const Footer = () => {
  return <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TalentMatch AI</h3>
            <p className="text-gray-400 mb-4">
              Revolutionizing recruitment with AI-powered candidate screening
              and insights.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'linkedin', 'facebook', 'instagram'].map((social, index) => <a key={index} href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                      {social.charAt(0).toUpperCase()}
                    </div>
                  </a>)}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Case Studies', 'Reviews', 'Updates'].map((item, index) => <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Careers', 'Press', 'Partners', 'Contact'].map((item, index) => <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              {['Blog', 'Documentation', 'Help Center', 'API', 'Privacy Policy'].map((item, index) => <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>)}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2023 TalentMatch AI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>;
};