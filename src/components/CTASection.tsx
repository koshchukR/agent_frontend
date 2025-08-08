import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from 'lucide-react';
export const CTASection = () => {
  return <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transform Your Hiring Process Today
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join hundreds of companies using AI to find the perfect candidates
            faster and more accurately than ever before.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Link to="/register" className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-indigo-50 transition-colors">
              Start Free Trial
            </Link>
            <button className="bg-transparent border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors">
              Schedule Demo
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[{
            title: 'Enterprise',
            description: 'For large organizations with complex hiring needs',
            price: '$999',
            features: ['Unlimited AI screenings', 'Custom conversation models', 'Advanced analytics dashboard', 'Enterprise ATS integration', 'Dedicated account manager']
          }, {
            title: 'Business',
            description: 'Perfect for growing companies',
            price: '$499',
            features: ['250 AI screenings per month', 'Industry-specific models', 'Standard analytics dashboard', 'Standard ATS integration', 'Email support']
          }, {
            title: 'Starter',
            description: 'For small businesses and startups',
            price: '$199',
            features: ['50 AI screenings per month', 'General conversation models', 'Basic analytics dashboard', 'Limited ATS integration', 'Community support']
          }].map((plan, index) => <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors">
                <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                <p className="text-indigo-200 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-indigo-200">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => <li key={i} className="flex items-start">
                      <CheckIcon size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>)}
                </ul>
                <Link to="/register" className="w-full bg-white text-indigo-600 py-2 rounded-md font-medium hover:bg-indigo-50 transition-colors text-center block">
                  Choose Plan
                </Link>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};