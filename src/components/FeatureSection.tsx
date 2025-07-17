import React from 'react';
import { MessageSquareIcon, BrainIcon, ShieldCheckIcon, BarChart4Icon, DatabaseIcon } from 'lucide-react';
export const FeatureSection = () => {
  const features = [{
    icon: <MessageSquareIcon size={24} className="text-indigo-600" />,
    title: 'Advanced AI Conversation Engine',
    description: 'Dynamic conversations that adapt based on candidate responses, with emotional intelligence and industry-specific models.',
    points: ['Natural follow-up questions based on responses', 'Sentiment analysis and emotional intelligence', 'Industry-specific conversation frameworks', 'Multi-language support with cultural awareness']
  }, {
    icon: <BrainIcon size={24} className="text-indigo-600" />,
    title: 'Comprehensive Candidate Intelligence',
    description: 'Go beyond the resume with AI-powered research across social media, publications, and professional networks.',
    points: ['Social media and professional presence analysis', 'Publication and content evaluation', 'Professional network mapping', 'Skills validation through public work samples']
  }, {
    icon: <ShieldCheckIcon size={24} className="text-indigo-600" />,
    title: 'AI Bot Detection & Quality Assurance',
    description: 'Protect your hiring process from AI-generated applications with sophisticated detection algorithms.',
    points: ['Multi-layer bot detection systems', 'Resume authenticity verification', 'Conversation authenticity assessment', 'Application quality scoring']
  }, {
    icon: <BarChart4Icon size={24} className="text-indigo-600" />,
    title: 'Smart Candidate Comparison',
    description: 'Compare candidates across multiple dimensions with predictive performance modeling and bias detection.',
    points: ['Multi-dimensional scoring matrix', 'Predictive performance modeling', 'Bias detection and mitigation', 'Dynamic benchmarking against industry standards']
  }, {
    icon: <DatabaseIcon size={24} className="text-indigo-600" />,
    title: 'Enterprise Integration',
    description: 'Seamlessly integrate with your existing HR technology stack including all major ATS platforms.',
    points: ['Universal ATS connectivity', 'HRIS integration capabilities', 'Calendar and scheduling intelligence', 'Workflow automation engine']
  }];
  return <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transforming Recruitment with AI
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines advanced AI technologies to deliver
            comprehensive candidate insights and automated screening at scale.
          </p>
        </div>
        <div className="space-y-16">
          {features.map((feature, index) => <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}>
              <div className="md:w-1/2 mb-8 md:mb-0">
                <div className={`bg-white rounded-xl shadow-lg p-8 ${index % 2 === 1 ? 'md:mr-8' : 'md:ml-8'}`}>
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.points.map((point, i) => <li key={i} className="flex items-start">
                        <span className="h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-3">
                          ✓
                        </span>
                        <span className="text-gray-600">{point}</span>
                      </li>)}
                  </ul>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className={`bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-1 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                  <div className="bg-white rounded-lg p-6">
                    {index === 0 && <div className="space-y-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">
                            AI: Tell me about a challenging project you managed.
                          </p>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-lg ml-4">
                          <p className="text-sm">
                            Candidate: I led a team of 5 developers to rebuild
                            our payment processing system...
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">
                            AI: That sounds interesting. How did you handle the
                            integration with existing systems?
                          </p>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-lg ml-4">
                          <p className="text-sm">
                            Candidate: We created a phased approach to minimize
                            disruption...
                          </p>
                        </div>
                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-green-800 font-medium">
                            Analysis: Candidate demonstrates strong project
                            management skills and technical understanding.
                            Follow-up questions about team leadership
                            recommended.
                          </p>
                        </div>
                      </div>}
                    {index === 1 && <div className="space-y-4">
                        <div className="border-b pb-3">
                          <h4 className="font-medium mb-2">
                            Candidate Intelligence Report
                          </h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
                              High Match
                            </span>
                            <span>Data compiled from 14 sources</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">GitHub Activity</span>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-600 h-2 rounded-full" style={{
                          width: '85%'
                        }}></div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">
                              Technical Publications
                            </span>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-600 h-2 rounded-full" style={{
                          width: '60%'
                        }}></div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Industry Influence</span>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-600 h-2 rounded-full" style={{
                          width: '75%'
                        }}></div>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">Key Insights:</p>
                          <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-2">
                            <li>
                              Active contributor to open-source ML projects
                            </li>
                            <li>Published 4 technical articles on medium</li>
                            <li>Regular speaker at industry conferences</li>
                          </ul>
                        </div>
                      </div>}
                    {index === 2 && <div className="space-y-4">
                        <div className="border-b pb-3">
                          <h4 className="font-medium mb-2">AI Bot Detection</h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
                              Authentic
                            </span>
                            <span>Application verified</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                              <span className="text-green-600">✓</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Resume Authenticity
                              </p>
                              <p className="text-xs text-gray-500">
                                No AI-generated content detected
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                              <span className="text-green-600">✓</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Conversation Patterns
                              </p>
                              <p className="text-xs text-gray-500">
                                Natural speech patterns confirmed
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                              <span className="text-green-600">✓</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Application Consistency
                              </p>
                              <p className="text-xs text-gray-500">
                                Consistent details across channels
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>}
                    {index === 3 && <div className="space-y-4">
                        <div className="border-b pb-3">
                          <h4 className="font-medium mb-2">
                            Candidate Comparison
                          </h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>Comparing top 3 candidates</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">
                                Technical Skills
                              </span>
                              <span className="text-sm text-gray-500">
                                85/100
                              </span>
                            </div>
                            <div className="flex space-x-1">
                              <div className="h-2 bg-indigo-600 rounded-l-full w-1/3"></div>
                              <div className="h-2 bg-blue-400 w-1/4"></div>
                              <div className="h-2 bg-gray-300 rounded-r-full w-5/12"></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">
                                Leadership
                              </span>
                              <span className="text-sm text-gray-500">
                                92/100
                              </span>
                            </div>
                            <div className="flex space-x-1">
                              <div className="h-2 bg-indigo-600 rounded-l-full w-2/5"></div>
                              <div className="h-2 bg-blue-400 w-1/5"></div>
                              <div className="h-2 bg-gray-300 rounded-r-full w-2/5"></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">
                                Cultural Fit
                              </span>
                              <span className="text-sm text-gray-500">
                                78/100
                              </span>
                            </div>
                            <div className="flex space-x-1">
                              <div className="h-2 bg-indigo-600 rounded-l-full w-1/4"></div>
                              <div className="h-2 bg-blue-400 w-1/3"></div>
                              <div className="h-2 bg-gray-300 rounded-r-full w-5/12"></div>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-indigo-600">
                            Recommendation:
                          </p>
                          <p className="text-gray-600 mt-1">
                            Sarah J. demonstrates strongest leadership skills
                            and technical capabilities. Predicted success rate:
                            94%
                          </p>
                        </div>
                      </div>}
                    {index === 4 && <div className="space-y-4">
                        <div className="border-b pb-3">
                          <h4 className="font-medium mb-2">
                            Enterprise Integration
                          </h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>Connected with your HR ecosystem</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {['Workday', 'Greenhouse', 'SuccessFactors', 'Lever', 'BambooHR', 'Jobvite'].map((ats, i) => <div key={i} className="p-2 bg-gray-100 rounded text-center text-sm">
                              {ats}
                            </div>)}
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                              <span className="text-indigo-600">→</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Automated Workflow
                              </p>
                              <p className="text-xs text-gray-500">
                                Candidate data synced to Greenhouse
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                              <span className="text-green-600">✓</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Interview Scheduled
                              </p>
                              <p className="text-xs text-gray-500">
                                Calendar invite sent to hiring manager
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>}
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};