import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeftIcon, UserIcon, BarChart2Icon, MessageSquareIcon, FileTextIcon, GlobeIcon, LinkedinIcon, GithubIcon, TwitterIcon, PaperclipIcon, PhoneIcon, MailIcon, MapPinIcon, CalendarIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon } from 'lucide-react';
export const CandidateDetail = () => {
  const {
    id
  } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  // Mock data for a candidate
  const candidate = {
    id: parseInt(id),
    name: 'Sarah Johnson',
    position: 'Senior Developer',
    status: 'Completed',
    score: 92,
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    appliedDate: '2023-06-15',
    source: 'LinkedIn',
    botRisk: 'Low',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker'],
    education: [{
      degree: 'M.S. Computer Science',
      school: 'Stanford University',
      year: '2018-2020'
    }, {
      degree: 'B.S. Computer Science',
      school: 'UC Berkeley',
      year: '2014-2018'
    }],
    experience: [{
      title: 'Senior Frontend Developer',
      company: 'Tech Innovations Inc.',
      duration: '2020-Present',
      description: "Led development of the company's flagship product, improving performance by 40%."
    }, {
      title: 'Frontend Developer',
      company: 'WebSolutions Co.',
      duration: '2018-2020',
      description: 'Developed responsive web applications using React and TypeScript.'
    }],
    screeningResults: {
      technicalSkills: 95,
      communication: 88,
      problemSolving: 90,
      teamwork: 85,
      leadershipPotential: 82
    },
    aiInsights: ['Strong technical background with expertise in modern frontend technologies', 'Excellent communication skills demonstrated during the screening', 'Shows leadership potential based on past project management experience', 'Good cultural fit with emphasis on collaborative work', 'Demonstrated ability to solve complex problems efficiently'],
    conversationHighlights: [{
      question: 'Describe a challenging project you worked on recently.',
      answer: 'I led a team of 5 developers to rebuild our payment processing system, which was experiencing performance issues with high transaction volumes. We redesigned the architecture using microservices and implemented efficient caching strategies, resulting in a 60% improvement in processing speed and 99.99% uptime.',
      analysis: 'Demonstrates strong technical leadership and problem-solving abilities.'
    }, {
      question: 'How do you approach learning new technologies?',
      answer: "I maintain a structured approach to learning new technologies. I start by understanding the core concepts and use cases, then build small projects to apply what I've learned. I also participate in open-source projects and tech communities to gain real-world experience and feedback.",
      analysis: 'Shows methodical learning approach and commitment to continuous improvement.'
    }]
  };
  return <div>
      <div className="mb-6">
        <Link to="/dashboard/candidates" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
          <ChevronLeftIcon size={16} className="mr-1" />
          Back to Candidates
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold">
                {candidate.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {candidate.name}
                </h1>
                <div className="flex items-center mt-1">
                  <span className="text-gray-600 mr-3">
                    {candidate.position}
                  </span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${candidate.status === 'Completed' ? 'bg-green-100 text-green-800' : candidate.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : candidate.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {candidate.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                <MessageSquareIcon size={16} className="mr-2" />
                Message
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <CalendarIcon size={16} className="mr-2" />
                Schedule Interview
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                More Actions
              </button>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-100 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center">
                <MailIcon size={16} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{candidate.email}</span>
              </div>
              <div className="flex items-center">
                <PhoneIcon size={16} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{candidate.phone}</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon size={16} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  {candidate.location}
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  {candidate.botRisk === 'Low' && <CheckCircleIcon size={16} className="text-green-500 mr-1" />}
                  {candidate.botRisk === 'Medium' && <AlertCircleIcon size={16} className="text-yellow-500 mr-1" />}
                  {candidate.botRisk === 'High' && <XCircleIcon size={16} className="text-red-500 mr-1" />}
                  <span className={`text-sm ${candidate.botRisk === 'Low' ? 'text-green-600' : candidate.botRisk === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                    Bot Risk: {candidate.botRisk}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[{
            id: 'overview',
            label: 'Overview',
            icon: <UserIcon size={16} />
          }, {
            id: 'screening',
            label: 'Screening Results',
            icon: <BarChart2Icon size={16} />
          }, {
            id: 'conversation',
            label: 'Conversation',
            icon: <MessageSquareIcon size={16} />
          }, {
            id: 'resume',
            label: 'Resume',
            icon: <FileTextIcon size={16} />
          }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center py-4 px-6 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>)}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'overview' && <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">AI Insights</h2>
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <ul className="space-y-2">
                      {candidate.aiInsights.map((insight, index) => <li key={index} className="flex items-start">
                          <span className="h-5 w-5 flex-shrink-0 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-2 mt-0.5">
                            ✓
                          </span>
                          <span className="text-gray-800">{insight}</span>
                        </li>)}
                    </ul>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-4">Experience</h2>
                  <div className="space-y-4">
                    {candidate.experience.map((exp, index) => <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{exp.title}</h3>
                            <p className="text-sm text-gray-600">
                              {exp.company}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {exp.duration}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {exp.description}
                        </p>
                      </div>)}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-4">Education</h2>
                  <div className="space-y-4">
                    {candidate.education.map((edu, index) => <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{edu.degree}</h3>
                            <p className="text-sm text-gray-600">
                              {edu.school}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {edu.year}
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">Candidate Score</h2>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-600">Overall Score</span>
                      <span className="text-2xl font-bold text-indigo-600">
                        {candidate.score}/100
                      </span>
                    </div>
                    <div className="space-y-4">
                      {Object.entries(candidate.screeningResults).map(([key, value]) => <div key={key}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm capitalize">
                                {key.replace(/([A-Z])/g, ' $1')}
                              </span>
                              <span className="text-sm text-gray-500">
                                {value}/100
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className={`h-2 rounded-full ${value >= 90 ? 'bg-green-600' : value >= 75 ? 'bg-indigo-600' : value >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`} style={{
                        width: `${value}%`
                      }}></div>
                            </div>
                          </div>)}
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-4">Skills</h2>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, index) => <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {skill}
                        </span>)}
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-4">
                    Additional Information
                  </h2>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Applied via</span>
                        <span className="font-medium">{candidate.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Application Date</span>
                        <span className="font-medium">
                          {new Date(candidate.appliedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-gray-100">
                        <h3 className="text-sm font-medium mb-2">
                          Social Profiles
                        </h3>
                        <div className="flex space-x-3">
                          <a href="#" className="text-gray-500 hover:text-indigo-600">
                            <LinkedinIcon size={20} />
                          </a>
                          <a href="#" className="text-gray-500 hover:text-indigo-600">
                            <GithubIcon size={20} />
                          </a>
                          <a href="#" className="text-gray-500 hover:text-indigo-600">
                            <TwitterIcon size={20} />
                          </a>
                          <a href="#" className="text-gray-500 hover:text-indigo-600">
                            <GlobeIcon size={20} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          {activeTab === 'screening' && <div>
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-4">Screening Summary</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 text-indigo-600 text-2xl font-bold">
                          {candidate.score}
                        </div>
                        <h3 className="mt-2 font-medium">Overall Score</h3>
                      </div>
                      <div className="space-y-4 mt-6">
                        {Object.entries(candidate.screeningResults).map(([key, value]) => <div key={key}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm capitalize">
                                  {key.replace(/([A-Z])/g, ' $1')}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {value}/100
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className={`h-2 rounded-full ${value >= 90 ? 'bg-green-600' : value >= 75 ? 'bg-indigo-600' : value >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`} style={{
                          width: `${value}%`
                        }}></div>
                              </div>
                            </div>)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-3">Key Strengths</h3>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-start">
                          <CheckCircleIcon size={16} className="text-green-500 mr-2 mt-0.5" />
                          <span>
                            Strong technical knowledge in required technologies
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircleIcon size={16} className="text-green-500 mr-2 mt-0.5" />
                          <span>
                            Excellent communication and articulation of complex
                            concepts
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircleIcon size={16} className="text-green-500 mr-2 mt-0.5" />
                          <span>
                            Demonstrated problem-solving abilities with real
                            examples
                          </span>
                        </li>
                      </ul>
                      <h3 className="font-medium mb-3">
                        Areas for Further Assessment
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <AlertCircleIcon size={16} className="text-yellow-500 mr-2 mt-0.5" />
                          <span>
                            Team leadership experience in larger organizations
                          </span>
                        </li>
                        <li className="flex items-start">
                          <AlertCircleIcon size={16} className="text-yellow-500 mr-2 mt-0.5" />
                          <span>
                            Experience with specific industry regulations
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium mb-4">AI Analysis</h2>
                <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
                  <p className="text-gray-800 mb-4">
                    Based on the screening conversation, Sarah demonstrates
                    strong technical proficiency in frontend development with
                    React and TypeScript. Her communication skills are
                    excellent, and she articulates complex technical concepts
                    clearly. She has shown leadership potential through her
                    experience managing small teams and complex projects.
                  </p>
                  <p className="text-gray-800 mb-4">
                    Her problem-solving approach is methodical and
                    results-oriented, as evidenced by her description of
                    optimizing the payment processing system at her previous
                    company. She shows a good cultural fit with your
                    organization's values, particularly in her emphasis on
                    collaborative work and continuous learning.
                  </p>
                  <p className="text-gray-800">
                    <strong>Recommendation:</strong> Sarah is a strong candidate
                    for the Senior Developer position. Consider proceeding to
                    the technical interview stage to further assess her coding
                    abilities and system design knowledge.
                  </p>
                </div>
              </div>
            </div>}
          {activeTab === 'conversation' && <div>
              <h2 className="text-lg font-medium mb-4">
                Screening Conversation
              </h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="mb-6 pb-4 border-b border-gray-100">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>
                      Screening conducted on{' '}
                      {new Date(candidate.appliedDate).toLocaleDateString()}
                    </span>
                    <span>Duration: 32 minutes</span>
                  </div>
                  <div className="flex space-x-4">
                    <button className="text-indigo-600 text-sm font-medium">
                      Download Transcript
                    </button>
                    <button className="text-indigo-600 text-sm font-medium">
                      Listen to Recording
                    </button>
                  </div>
                </div>
                <div className="space-y-6">
                  {candidate.conversationHighlights.map((highlight, index) => <div key={index} className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3 mt-1">
                          AI
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3 flex-1">
                          <p className="text-gray-800">{highlight.question}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 mt-1">
                          {candidate.name.charAt(0)}
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-3 flex-1">
                          <p className="text-gray-800">{highlight.answer}</p>
                        </div>
                      </div>
                      <div className="ml-11 bg-green-50 border border-green-100 rounded-lg p-3">
                        <p className="text-sm text-green-800">
                          <strong>AI Analysis:</strong> {highlight.analysis}
                        </p>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>}
          {activeTab === 'resume' && <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Resume</h2>
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <PaperclipIcon size={16} className="mr-1" />
                  Download Resume
                </button>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <h1 className="text-xl font-bold text-gray-900 mb-1">
                    {candidate.name}
                  </h1>
                  <p className="text-gray-600">{candidate.position}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MailIcon size={14} className="mr-1" />
                      {candidate.email}
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon size={14} className="mr-1" />
                      {candidate.phone}
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon size={14} className="mr-1" />
                      {candidate.location}
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-3">Summary</h2>
                  <p className="text-gray-700">
                    Senior Developer with over 5 years of experience in frontend
                    development, specializing in React and TypeScript. Proven
                    track record of delivering high-performance web applications
                    and leading development teams. Strong problem-solving
                    abilities and excellent communication skills.
                  </p>
                </div>
                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-3">Experience</h2>
                  <div className="space-y-4">
                    {candidate.experience.map((exp, index) => <div key={index} className="border-l-2 border-gray-200 pl-4">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{exp.title}</h3>
                          <span className="text-sm text-gray-500">
                            {exp.duration}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {exp.company}
                        </p>
                        <p className="text-sm text-gray-700">
                          {exp.description}
                        </p>
                        {index === 0 && <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                            <li>
                              Led a team of 5 developers in rebuilding the
                              payment processing system
                            </li>
                            <li>
                              Improved application performance by 40% through
                              code optimization
                            </li>
                            <li>
                              Implemented CI/CD pipeline reducing deployment
                              time by 60%
                            </li>
                            <li>
                              Mentored junior developers and conducted code
                              reviews
                            </li>
                          </ul>}
                      </div>)}
                  </div>
                </div>
                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-3">Education</h2>
                  <div className="space-y-4">
                    {candidate.education.map((edu, index) => <div key={index} className="border-l-2 border-gray-200 pl-4">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{edu.degree}</h3>
                          <span className="text-sm text-gray-500">
                            {edu.year}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{edu.school}</p>
                      </div>)}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-3">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {skill}
                      </span>)}
                  </div>
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};