import React, { useState } from 'react'
import { XIcon, SearchIcon, UserIcon, BriefcaseIcon } from 'lucide-react'
import { useRecruiters, type Recruiter } from '../contexts/RecruitersContext'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface RecruiterAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  candidateId: string
  candidateName: string
  currentRecruiterId?: string
}

export const RecruiterAssignmentModal: React.FC<RecruiterAssignmentModalProps> = ({
  isOpen,
  onClose,
  candidateId,
  candidateName,
  currentRecruiterId
}) => {
  const { recruiters, loading } = useRecruiters()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecruiterId, setSelectedRecruiterId] = useState('')
  const [isAssigning, setIsAssigning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasUserMadeSelection, setHasUserMadeSelection] = useState(false)

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedRecruiterId('')
      setHasUserMadeSelection(false)
      setError(null)
      setSearchTerm('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const filteredRecruiters = recruiters.filter(recruiter => 
    (recruiter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     recruiter.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleAssign = async () => {
    if (!selectedRecruiterId) return

    try {
      setIsAssigning(true)
      setError(null)

      // First, remove any existing assignment for this candidate
      await supabase
        .from('candidate_recruiter_assignments')
        .delete()
        .eq('candidate_id', candidateId)

      // Create new assignment
      const { error: assignError } = await supabase
        .from('candidate_recruiter_assignments')
        .insert([{
          candidate_id: candidateId,
          recruiter_id: selectedRecruiterId,
          assigned_by: user?.id || 'unknown'
        }])

      if (assignError) {
        setError(assignError.message)
        return
      }

      // Also update the candidate's call_agent field for automated calling
      const { error: candidateUpdateError } = await supabase
        .from('candidates')
        .update({ 
          call_agent: selectedRecruiterId,
          updated_at: new Date().toISOString()
        })
        .eq('id', candidateId)

      if (candidateUpdateError) {
        console.error('Error updating candidate call_agent field:', candidateUpdateError)
        // Don't fail the assignment if this update fails, just log it
      }

      onClose()
      // Reset selection state
      setSelectedRecruiterId('')
      setHasUserMadeSelection(false)
    } catch (err) {
      setError('Failed to assign recruiter to candidate')
    } finally {
      setIsAssigning(false)
    }
  }

  const handleRecruiterSelection = (recruiterId: string, enabled: boolean) => {
    if (!enabled) {
      setError('This recruiter is currently disabled and cannot be assigned')
      return
    }
    setSelectedRecruiterId(recruiterId)
    setHasUserMadeSelection(true)
    setError(null)
  }

  const handleRemoveAssignment = async () => {
    try {
      setIsAssigning(true)
      setError(null)

      // Remove all recruiter assignments for this candidate
      const { error } = await supabase
        .from('candidate_recruiter_assignments')
        .delete()
        .eq('candidate_id', candidateId)

      if (error) {
        setError(error.message)
        return
      }

      // Also clear the candidate's call_agent field
      const { error: candidateUpdateError } = await supabase
        .from('candidates')
        .update({ 
          call_agent: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', candidateId)

      if (candidateUpdateError) {
        console.error('Error clearing candidate call_agent field:', candidateUpdateError)
        // Don't fail the removal if this update fails, just log it
      }

      setSelectedRecruiterId('')
      onClose()
    } catch (err) {
      setError('Failed to remove recruiter assignment')
    } finally {
      setIsAssigning(false)
    }
  }

  const selectedRecruiter = recruiters.find(recruiter => recruiter.id === selectedRecruiterId)

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
                Assign Recruiter to {candidateName}
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
                  placeholder="Search recruiters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Current Assignment */}
            {currentRecruiterId && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Currently Assigned:</p>
                    <p className="text-sm text-blue-700">
                      {recruiters.find(recruiter => recruiter.id === currentRecruiterId)?.name || 'Unknown Recruiter'}
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


            {/* Recruiter List */}
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading recruiters...
                </div>
              ) : filteredRecruiters.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <UserIcon size={24} className="mx-auto mb-2 text-gray-400" />
                  No available recruiters found
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredRecruiters.map((recruiter) => {
                    const isSelected = selectedRecruiterId === recruiter.id;
                    const isCurrentAssignment = currentRecruiterId === recruiter.id;
                    
                    return (
                      <div
                        key={recruiter.id}
                        className={`p-4 border-l-4 transition-all duration-200 ${
                          !recruiter.enabled
                            ? 'bg-gray-50 border-l-gray-300 cursor-not-allowed opacity-60'
                            : isSelected 
                            ? 'bg-indigo-50 border-l-indigo-500 shadow-sm cursor-pointer' 
                            : isCurrentAssignment
                            ? 'bg-blue-50 border-l-blue-500 cursor-pointer'
                            : 'border-l-transparent hover:bg-gray-50 hover:border-l-gray-200 cursor-pointer'
                        }`}
                        onClick={() => handleRecruiterSelection(recruiter.id, recruiter.enabled)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              !recruiter.enabled
                                ? 'border-gray-300 bg-gray-100'
                                : isSelected 
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
                                !recruiter.enabled
                                  ? 'text-gray-400'
                                  : isSelected 
                                  ? 'text-indigo-900' 
                                  : 'text-gray-900'
                              }`}>
                                {recruiter.name}
                                {!recruiter.enabled && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                                    Disabled
                                  </span>
                                )}
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
                              <BriefcaseIcon size={12} className="mr-1" />
                              <span>{recruiter.industry}</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                recruiter.enabled 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {recruiter.enabled ? 'Available' : 'Disabled'}
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

            {/* Selected Recruiter Summary */}
            {selectedRecruiter && (
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Recruiter:</h4>
                <p className="text-sm text-gray-700">{selectedRecruiter.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedRecruiter.industry}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleAssign}
              disabled={!hasUserMadeSelection || !selectedRecruiterId || isAssigning}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 ${
                hasUserMadeSelection && selectedRecruiterId && !isAssigning
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
                'Assign Recruiter'
              ) : (
                'Select a Recruiter First'
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