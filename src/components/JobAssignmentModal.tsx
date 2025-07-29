import React, { useState } from 'react'
import { XIcon, SearchIcon, BriefcaseIcon, BuildingIcon, MapPinIcon } from 'lucide-react'
import { useJobs, type JobPosting } from '../contexts/JobsContext'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface JobAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  candidateId: string
  candidateName: string
  currentJobId?: string
}

export const JobAssignmentModal: React.FC<JobAssignmentModalProps> = ({
  isOpen,
  onClose,
  candidateId,
  candidateName,
  currentJobId
}) => {
  const { jobs, loading } = useJobs()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJobId, setSelectedJobId] = useState('')
  const [isAssigning, setIsAssigning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasUserMadeSelection, setHasUserMadeSelection] = useState(false)

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedJobId('')
      setHasUserMadeSelection(false)
      setError(null)
      setSearchTerm('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const filteredJobs = jobs.filter(job => 
    job.status === 'active' &&
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
     job.department.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleAssign = async () => {
    if (!selectedJobId) return

    try {
      setIsAssigning(true)
      setError(null)

      // First, remove any existing job assignment for this candidate (enforce one job per candidate)
      await supabase
        .from('candidate_job_assignments')
        .delete()
        .eq('candidate_id', candidateId)

      // Create new assignment
      const { error: assignError } = await supabase
        .from('candidate_job_assignments')
        .insert([{
          candidate_id: candidateId,
          job_id: selectedJobId,
          assigned_by: user?.id || 'unknown'
        }])

      if (assignError) {
        setError(assignError.message)
        return
      }

      onClose()
      // Reset selection state
      setSelectedJobId('')
      setHasUserMadeSelection(false)
    } catch (err) {
      setError('Failed to assign job to candidate')
    } finally {
      setIsAssigning(false)
    }
  }

  const handleJobSelection = (jobId: string) => {
    setSelectedJobId(jobId)
    setHasUserMadeSelection(true)
    setError(null)
  }

  const handleRemoveAssignment = async () => {
    try {
      setIsAssigning(true)
      setError(null)

      // Remove all job assignments for this candidate
      const { error } = await supabase
        .from('candidate_job_assignments')
        .delete()
        .eq('candidate_id', candidateId)

      if (error) {
        setError(error.message)
        return
      }

      setSelectedJobId('')
      onClose()
    } catch (err) {
      setError('Failed to remove job assignment')
    } finally {
      setIsAssigning(false)
    }
  }

  const selectedJob = jobs.find(job => job.id === selectedJobId)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Assign Job to {candidateName}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon size={24} />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Current Assignment */}
            {currentJobId && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Currently Assigned:</p>
                    <p className="text-sm text-blue-700">
                      {jobs.find(job => job.id === currentJobId)?.title || 'Unknown Job'}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveAssignment}
                    disabled={isAssigning}
                    className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}


            {/* Job List */}
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading jobs...
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <BriefcaseIcon size={24} className="mx-auto mb-2 text-gray-400" />
                  No active jobs found
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredJobs.map((job) => {
                    const isSelected = selectedJobId === job.id;
                    const isCurrentAssignment = currentJobId === job.id;
                    
                    return (
                      <div
                        key={job.id}
                        className={`p-4 cursor-pointer border-l-4 transition-all duration-200 ${
                          isSelected 
                            ? 'bg-indigo-50 border-l-indigo-500 shadow-sm' 
                            : isCurrentAssignment
                            ? 'bg-blue-50 border-l-blue-500'
                            : 'border-l-transparent hover:bg-gray-50 hover:border-l-gray-200'
                        }`}
                        onClick={() => handleJobSelection(job.id)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected 
                                ? 'border-indigo-500 bg-indigo-500' 
                                : 'border-gray-300 bg-white'
                            }`}>
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-start justify-between">
                              <h4 className={`text-sm font-medium ${
                                isSelected ? 'text-indigo-900' : 'text-gray-900'
                              }`}>
                                {job.title}
                                {isCurrentAssignment && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    Current
                                  </span>
                                )}
                              </h4>
                              {isSelected && (
                                <div className="ml-2 flex-shrink-0">
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <BuildingIcon size={12} className="mr-1" />
                              <span className="mr-3">{job.company}</span>
                              <MapPinIcon size={12} className="mr-1" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {job.department}
                              </span>
                              <span className={`text-xs ${
                                isSelected ? 'text-indigo-600 font-medium' : 'text-gray-400'
                              }`}>
                                {job.experience_level} • {job.remote_type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Job Summary */}
            {selectedJob && (
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Job:</h4>
                <p className="text-sm text-gray-700">{selectedJob.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedJob.company} • {selectedJob.department} • {selectedJob.location}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleAssign}
              disabled={!hasUserMadeSelection || !selectedJobId || isAssigning}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 ${
                hasUserMadeSelection && selectedJobId && !isAssigning
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isAssigning ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Assigning...
                </div>
              ) : hasUserMadeSelection ? (
                'Assign Job'
              ) : (
                'Select a Job First'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}