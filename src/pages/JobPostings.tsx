import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  SearchIcon, 
  FilterIcon, 
  PlusIcon, 
  MapPinIcon, 
  BuildingIcon, 
  ClockIcon,
  DollarSignIcon,
  UsersIcon,
  BriefcaseIcon
} from 'lucide-react'
import { useJobs, type JobPosting } from '../contexts/JobsContext'
import { JobFormModal } from '../components/JobFormModal'

export const JobPostings: React.FC = () => {
  const { jobs, loading, error } = useJobs()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterRemoteType, setFilterRemoteType] = useState('all')
  const [filterExperienceLevel, setFilterExperienceLevel] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null)

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = filterDepartment === 'all' || job.department === filterDepartment
    const matchesRemoteType = filterRemoteType === 'all' || job.remote_type === filterRemoteType
    const matchesExperience = filterExperienceLevel === 'all' || job.experience_level === filterExperienceLevel
    
    return matchesSearch && matchesDepartment && matchesRemoteType && matchesExperience
  })

  const getUniqueValues = (key: keyof JobPosting) => {
    return Array.from(new Set(jobs.map(job => job[key] as string)))
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not disclosed'
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`
    if (min) return `$${(min / 1000).toFixed(0)}k+`
    return `Up to $${(max! / 1000).toFixed(0)}k`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRemoteTypeIcon = (remoteType: string) => {
    switch (remoteType) {
      case 'remote': return '🏠'
      case 'hybrid': return '🏢🏠'
      case 'on-site': return '🏢'
      default: return '📍'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow border h-64">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
            <p className="text-gray-600 mt-1">Manage and view all available positions</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon size={16} className="mr-2" />
            Post New Job
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Departments</option>
                {getUniqueValues('department').map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Remote Type Filter */}
            <div>
              <select
                value={filterRemoteType}
                onChange={(e) => setFilterRemoteType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Work Types</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-site</option>
              </select>
            </div>

            {/* Experience Level Filter */}
            <div>
              <select
                value={filterExperienceLevel}
                onChange={(e) => setFilterExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </p>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-all duration-200 overflow-hidden group">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                    {job.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <BuildingIcon size={16} className="mr-1" />
                    <span className="text-sm">{job.company}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>

              {/* Location and Remote Type */}
              <div className="flex items-center text-gray-600 mb-3">
                <MapPinIcon size={16} className="mr-1" />
                <span className="text-sm mr-2">{job.location}</span>
                <span className="text-sm">{getRemoteTypeIcon(job.remote_type)} {job.remote_type}</span>
              </div>

              {/* Job Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <BriefcaseIcon size={16} className="mr-2" />
                  <span className="text-sm capitalize">{job.type} • {job.experience_level} level</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <DollarSignIcon size={16} className="mr-2" />
                  <span className="text-sm">{formatSalary(job.salary_min, job.salary_max)}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <UsersIcon size={16} className="mr-2" />
                  <span className="text-sm">{job.department}</span>
                </div>
              </div>

              {/* Description Preview */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {job.description}
              </p>

              {/* Requirements Preview */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {job.requirements.slice(0, 2).map((req, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {req.length > 30 ? `${req.substring(0, 30)}...` : req}
                    </span>
                  ))}
                  {job.requirements.length > 2 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                      +{job.requirements.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Posted Date */}
              <div className="flex items-center text-gray-500 text-xs mb-4">
                <ClockIcon size={14} className="mr-1" />
                <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link
                  to={`/dashboard/jobs/${job.id}`}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  View Details
                </Link>
                <button
                  onClick={() => setEditingJob(job)}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && !loading && (
        <div className="text-center py-12">
          <BriefcaseIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterDepartment !== 'all' || filterRemoteType !== 'all' || filterExperienceLevel !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No job postings are currently available'}
          </p>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon size={16} className="mr-2" />
            Post New Job
          </button>
        </div>
      )}

      {/* Job Creation Modal */}
      <JobFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Job Edit Modal */}
      <JobFormModal
        isOpen={!!editingJob}
        onClose={() => setEditingJob(null)}
        jobToEdit={editingJob}
      />
    </div>
  )
}