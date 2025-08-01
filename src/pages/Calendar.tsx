import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ClockIcon, UserIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BookingSlot {
  date: string;
  time: string;
  datetime: string;
  available: boolean;
}

interface Booking {
  id: string;
  candidate_id: string;
  user_id: string;
  datetime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
}

export const Calendar: React.FC = () => {
  const [searchParams] = useSearchParams();
  // Clean and fix the UUIDs (remove spaces and decode URL encoding)
  const rawCandidateId = searchParams.get('candidate_id');
  const rawUserId = searchParams.get('user_id');
  
  const candidateId = rawCandidateId?.replace(/\s+/g, '')?.trim();
  const userId = rawUserId?.replace(/\s+/g, '')?.trim();
  
  // Debug logging
  console.log('Calendar Debug Info:', {
    rawCandidateId,
    rawUserId,
    candidateId,
    userId,
    searchParams: Object.fromEntries(searchParams.entries())
  });
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<BookingSlot[]>([]);
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({ show: false, type: 'success', title: '', message: '' });
  const [candidateInfo, setCandidateInfo] = useState<{
    name: string;
    phone: string;
    position: string;
  } | null>(null);
  const [assignedJobTitle, setAssignedJobTitle] = useState<string>('');

  // Available time slots (9 AM to 5 PM, every hour)
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Check if we have required parameters
  const hasRequiredParams = candidateId && userId;
  
  // Debug the parameters
  console.log('Parameters check:', {
    candidateId,
    userId,
    hasRequiredParams,
    candidateIdLength: candidateId?.length,
    userIdLength: userId?.length
  });

  // Early return for debugging
  if (!candidateId || !userId) {
    console.log('Missing parameters, showing error page');
  }

  useEffect(() => {
    if (hasRequiredParams) {
      fetchExistingBookings();
      fetchCandidateInfo();
      fetchAssignedJobTitle();
    }
  }, [candidateId, userId]);

  useEffect(() => {
    generateAvailableSlots();
  }, [currentDate, existingBookings]);

  const fetchExistingBookings = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('candidate_screenings')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'scheduled')
        .gte('datetime', new Date().toISOString());

      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }

      setExistingBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidateInfo = async () => {
    if (!candidateId) return;

    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('name, phone, position')
        .eq('id', candidateId)
        .single();

      if (error) {
        console.error('Error fetching candidate info:', error);
        return;
      }

      setCandidateInfo(data);
    } catch (error) {
      console.error('Error fetching candidate info:', error);
    }
  };

  const fetchAssignedJobTitle = async () => {
    if (!candidateId) return;

    try {
      const { data, error } = await supabase
        .from('candidate_job_assignments')
        .select(`
          job_postings!inner(title)
        `)
        .eq('candidate_id', candidateId)
        .single();

      if (error) {
        console.error('Error fetching assigned job:', error);
        return;
      }

      if (data?.job_postings?.title) {
        setAssignedJobTitle(data.job_postings.title);
      }
    } catch (error) {
      console.error('Error fetching assigned job:', error);
    }
  };

  const generateAvailableSlots = () => {
    const slots: BookingSlot[] = [];
    const today = new Date();
    // Use local date to avoid timezone issues
    const todayStr = today.getFullYear() + '-' + 
                     String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(today.getDate()).padStart(2, '0');
    
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      // Create proper date string without timezone issues
      const dateStr = date.getFullYear() + '-' + 
                      String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                      String(date.getDate()).padStart(2, '0');
      
      // Skip past dates and weekends
      if (dateStr < todayStr || date.getDay() === 0 || date.getDay() === 6) {
        continue;
      }

      timeSlots.forEach(time => {
        const datetime = `${dateStr}T${time}:00`;
        const datetimeObj = new Date(datetime);
        
        // Skip past times for today
        if (dateStr === todayStr && datetimeObj <= today) {
          return;
        }

        // Check if this slot is already booked
        const isBooked = existingBookings.some(booking => {
          const bookingDateTime = new Date(booking.datetime);
          const slotDateTime = new Date(datetime);
          return bookingDateTime.getTime() === slotDateTime.getTime();
        });

        slots.push({
          date: dateStr,
          time,
          datetime,
          available: !isBooked
        });
      });
    }

    setAvailableSlots(slots);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const sendConfirmationSMS = async (name: string, phone: string, jobTitle: string, selectedDate: string, selectedTime: string) => {
    try {
      // Format the date and time properly without timezone conversion
      const [year, month, day] = selectedDate.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const formattedDateTime = `${formattedDate} at ${selectedTime}`;

      const res = await fetch('https://recruiter-agent-backend-sznn.onrender.com/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          job_title: jobTitle,
          datetime: formattedDateTime
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Confirmation SMS sent successfully:', data);
      } else {
        console.error('SMS confirmation failed:', data);
      }
    } catch (error) {
      console.error('Error sending confirmation SMS:', error);
    }
  };

  const handleBooking = async () => {
    if (!candidateId || !userId || !selectedDate || !selectedTime) {
      setNotification({
        show: true,
        type: 'error',
        title: 'Missing Information',
        message: 'Please select a date and time for your appointment.'
      });
      return;
    }

    if (!candidateInfo) {
      setNotification({
        show: true,
        type: 'error',
        title: 'Missing Candidate Information',
        message: 'Unable to retrieve candidate information. Please try again.'
      });
      return;
    }

    try {
      setBooking(true);
      
      const datetime = `${selectedDate}T${selectedTime}:00.000Z`;
      
      const { data, error } = await supabase
        .from('candidate_screenings')
        .insert([{
          candidate_id: candidateId,
          user_id: userId,
          datetime: datetime,
          status: 'scheduled'
        }])
        .select()
        .single();

      if (error) {
        console.error('Booking error:', error);
        setNotification({
          show: true,
          type: 'error',
          title: 'Booking Failed',
          message: `Failed to book your appointment: ${error.message}`
        });
        return;
      }

      // Send confirmation SMS with assigned job title
      const jobTitle = assignedJobTitle || candidateInfo.position;
      await sendConfirmationSMS(
        candidateInfo.name,
        candidateInfo.phone,
        jobTitle,
        selectedDate,
        selectedTime
      );

      setNotification({
        show: true,
        type: 'success',
        title: 'Booking Confirmed!',
        message: `Your screening appointment has been scheduled for ${new Date(datetime).toLocaleDateString()} at ${selectedTime}. A confirmation SMS has been sent to your phone.`
      });

      // Refresh bookings and reset selection
      await fetchExistingBookings();
      setSelectedDate('');
      setSelectedTime('');

    } catch (error) {
      console.error('Booking error:', error);
      setNotification({
        show: true,
        type: 'error',
        title: 'Network Error',
        message: 'Unable to book appointment. Please try again.'
      });
    } finally {
      setBooking(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getAvailableTimesForDate = (date: string) => {
    return availableSlots.filter(slot => slot.date === date);
  };

  const formatDate = (date: string) => {
    // Parse the date string manually to avoid timezone issues
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!hasRequiredParams) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <XCircleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
          <p className="text-gray-600 mb-4">
            This booking link is missing required information. Please check with the person who sent you this link.
          </p>
          <p className="text-sm text-gray-500">
            Required parameters: candidate_id and user_id
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CalendarIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Book Your Screening Call</h1>
          </div>
          <p className="text-lg text-gray-600">
            Select an available date and time for your screening appointment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth().map((day, index) => {
                if (day === null) {
                  return <div key={index} className="p-2"></div>;
                }

                // Use consistent date formatting
                const dateStr = currentDate.getFullYear() + '-' + 
                               String(currentDate.getMonth() + 1).padStart(2, '0') + '-' + 
                               String(day).padStart(2, '0');
                               
                const today = new Date();
                const todayStr = today.getFullYear() + '-' + 
                                String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                                String(today.getDate()).padStart(2, '0');
                
                const calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const isToday = dateStr === todayStr;
                const isPast = dateStr < todayStr;
                const isWeekend = calendarDate.getDay() === 0 || calendarDate.getDay() === 6;
                const hasAvailableSlots = getAvailableTimesForDate(dateStr).length > 0;
                const isSelected = selectedDate === dateStr;

                // A day is clickable if it's not past, not weekend, and either has available slots OR could potentially have slots
                const isClickable = !isPast && !isWeekend;
                const shouldShowAsAvailable = isClickable && (hasAvailableSlots || (!isPast && !isWeekend));

                return (
                  <button
                    key={day}
                    onClick={() => isClickable && handleDateSelect(dateStr)}
                    disabled={!isClickable}
                    className={`p-2 text-sm rounded-md transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : isPast || isWeekend
                        ? 'text-gray-300 cursor-not-allowed'
                        : shouldShowAsAvailable
                        ? 'text-gray-900 hover:bg-indigo-50 cursor-pointer'
                        : 'text-gray-400 cursor-not-allowed'
                    } ${isToday ? 'ring-2 ring-indigo-300' : ''}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-600 rounded mr-2"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
                  <span>Unavailable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2" />
              Available Times
            </h2>

            {selectedDate ? (
              <div>
                <div className="mb-4 p-3 bg-indigo-50 rounded-md">
                  <p className="text-sm font-medium text-indigo-900">
                    Selected Date: {formatDate(selectedDate)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {getAvailableTimesForDate(selectedDate).map(slot => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 text-sm rounded-md border transition-colors ${
                        !slot.available
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : selectedTime === slot.time
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-900 border-gray-300 hover:bg-indigo-50 hover:border-indigo-300'
                      }`}
                    >
                      {slot.time}
                      {!slot.available && <span className="ml-1 text-xs">(Booked)</span>}
                    </button>
                  ))}
                </div>

                {selectedTime && (
                  <div className="mb-6 p-4 bg-green-50 rounded-md border border-green-200">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          Ready to Book
                        </p>
                        <p className="text-sm text-green-700">
                          {formatDate(selectedDate)} at {selectedTime}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={!selectedTime || booking}
                  className={`w-full py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                    selectedTime && !booking
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {booking ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Booking...
                    </div>
                  ) : (
                    'Book Appointment'
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Please select a date to see available times</p>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-3"></div>
              <span className="text-gray-900">Loading available times...</span>
            </div>
          </div>
        )}

        {/* Notification Modal */}
        {notification.show && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 ${
                    notification.type === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {notification.type === 'success' ? (
                      <CheckCircleIcon className="h-6 w-6" />
                    ) : (
                      <XCircleIcon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-end">
                <button
                  onClick={() => setNotification({ ...notification, show: false })}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};