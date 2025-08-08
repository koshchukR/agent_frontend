import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeftIcon,
  MapPinIcon, 
  BuildingIcon, 
  ClockIcon,
  DollarSignIcon,
  UsersIcon,
  BriefcaseIcon,
  EditIcon,
  ShareIcon,
  BookmarkIcon,
  CheckCircleIcon,
  TrashIcon
} from 'lucide-react'
import { useJobs } from '../contexts/JobsContext'
import { JobFormModal } from '../components/JobFormModal'
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal'

export const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getJobById, loading, deleteJob } = useJobs()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    jobId: string;
    jobTitle: string;
  }>({
    isOpen: false,
    jobId: "",
    jobTitle: "",
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const job = id ? getJobById(id) : null

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="bg-white rounded-lg shadow border p-8">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <BriefcaseIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Job not found</h3>
          <p className="text-gray-600 mb-4">The job posting you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/dashboard/jobs"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Jobs
          </Link>
        </div>
      </div>
    )
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/dashboard/jobs"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-4"
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Jobs
        </Link>
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <BuildingIcon size={20} className="mr-2" />
              <span className="text-lg">{job.company}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
            <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-md">
              <ShareIcon size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-md">
              <BookmarkIcon size={18} />
            </button>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <EditIcon size={16} className="mr-2" />
              Edit Job
            </button>
            <button 
              onClick={() => setDeleteModal({
                isOpen: true,
                jobId: job.id,
                jobTitle: job.title,
              })}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              <TrashIcon size={16} className="mr-2" />
              Delete Job
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Overview */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <MapPinIcon size={18} className="mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{job.location}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <BriefcaseIcon size={18} className="mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Job Type</p>
                  <p className="font-medium capitalize">{job.type}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <UsersIcon size={18} className="mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{job.department}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <DollarSignIcon size={18} className="mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="font-medium">{formatSalary(job.salary_min, job.salary_max)}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Work Type:</span>
                  <span className="font-medium">{getRemoteTypeIcon(job.remote_type)} {job.remote_type}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Experience Level:</span>
                  <span className="font-medium capitalize">{job.experience_level}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
            <ul className="space-y-3">
              {job.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircleIcon size={18} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits & Perks</h2>
            <ul className="space-y-3">
              {job.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircleIcon size={18} className="mr-3 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
                Assign Candidates
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium">
                Share Job Posting
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium">
                View Analytics
              </button>
            </div>
          </div>

          {/* Job Statistics */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Applications</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Views</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Interviews</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Hired</span>
                <span className="font-semibold">0</span>
              </div>
            </div>
          </div>

          {/* Posting Information */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Posting Information</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <ClockIcon size={16} className="mr-2" />
                <div>
                  <p className="text-sm">Posted</p>
                  <p className="font-medium text-gray-900">
                    {new Date(job.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <EditIcon size={16} className="mr-2" />
                <div>
                  <p className="text-sm">Last Updated</p>
                  <p className="font-medium text-gray-900">
                    {new Date(job.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Edit Modal */}
      {job && (
        <JobFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          jobToEdit={job}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, jobId: "", jobTitle: "" })}
        onConfirm={async () => {
          setIsDeleting(true)
          try {
            const result = await deleteJob(deleteModal.jobId)
            if (result.success) {
              setDeleteModal({ isOpen: false, jobId: "", jobTitle: "" })
              navigate('/dashboard/jobs')
            } else {
              alert(`Failed to delete job: ${result.error}`)
            }
          } catch (error) {
            alert('An error occurred while deleting the job')
            console.error('Delete job error:', error)
          } finally {
            setIsDeleting(false)
          }
        }}
        title="Delete Job Posting"
        message="Are you sure you want to delete this job posting? All associated data will be permanently removed."
        itemName={deleteModal.jobTitle}
        isDeleting={isDeleting}
      />
    </div>
  )
}