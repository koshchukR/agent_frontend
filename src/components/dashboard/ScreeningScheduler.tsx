import React, { useState, useEffect } from "react";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BriefcaseIcon,
  UserCheckIcon,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

interface CandidateScreening {
  id: string;
  candidate_id: string;
  user_id: string;
  datetime: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  candidates: {
    name: string;
    phone: string;
    position: string;
  };
  users: {
    name: string;
    email: string;
  };
}

interface ScreeningDetails {
  screening: CandidateScreening;
  showModal: boolean;
}

export const ScreeningScheduler = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewScreeningModal, setShowNewScreeningModal] = useState(false);
  const [screenings, setScreenings] = useState<CandidateScreening[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDateScreenings, setSelectedDateScreenings] = useState<
    CandidateScreening[]
  >([]);
  const [screeningDetails, setScreeningDetails] =
    useState<ScreeningDetails | null>(null);
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  useEffect(() => {
    if (user?.id) {
      fetchScreenings();
    }
  }, [currentMonth, user?.id]);

  useEffect(() => {
    updateSelectedDateScreenings();
  }, [selectedDate, screenings]);

  const fetchScreenings = async () => {
    if (!user?.id) {
      console.log("No user ID available, skipping fetch");
      return;
    }

    try {
      setLoading(true);
      const startOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
      );

      console.log("Query parameters:", {
        startOfMonth: startOfMonth.toISOString(),
        endOfMonth: endOfMonth.toISOString(),
        currentMonth: currentMonth,
        userId: user.id,
      });

      // Get screenings for the current user only
      const { data: screeningsData, error } = await supabase
        .from("candidate_screenings")
        .select("*")
        .eq("status", "scheduled")
        .eq("user_id", user.id) // Only get screenings assigned to current user
        .order("datetime", { ascending: true });

      if (error) {
        console.error("Error fetching screenings:", error);
        return;
      }

      console.log("Raw screenings data:", screeningsData);

      // Now get candidate and user data separately
      const enrichedScreenings = [];

      if (screeningsData && screeningsData.length > 0) {
        for (const screening of screeningsData) {
          // Since screenings are already filtered by user_id, we can trust these belong to the user
          // Get candidate data
          const { data: candidateData, error: candidateError } = await supabase
            .from("candidates")
            .select("name, phone, position")
            .eq("id", screening.candidate_id)
            .single();

          if (candidateError) {
            console.warn(
              `Could not fetch candidate ${screening.candidate_id}:`,
              candidateError
            );
            continue; // Skip this screening if candidate doesn't exist
          }

          // Get user data
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("name, email")
            .eq("id", screening.user_id)
            .single();

          if (userError) {
            console.warn(
              `Could not fetch user ${screening.user_id}:`,
              userError
            );
          }

          // Add the screening since it already passed the user_id filter
          enrichedScreenings.push({
            ...screening,
            candidates: candidateData || {
              name: "Unknown Candidate",
              phone: "",
              position: "Unknown",
            },
            users: userData || { name: "Unknown Agent", email: "" },
          });

          console.log(
            `✅ Added screening for candidate: ${candidateData?.name} (User: ${user.id})`
          );
        }
      }

      console.log(
        `Enriched screenings for user ${user.id}:`,
        enrichedScreenings
      );
      const data = enrichedScreenings;

      console.log(
        `Fetched ${data?.length || 0} screenings for user ${user.id}`
      );

      // Log which candidates are being displayed
      data?.forEach((screening) => {
        console.log(
          `📅 Screening: ${screening.candidates?.name} on ${screening.datetime} (User: ${user.id})`
        );
      });

      // Filter by month on the client side to ensure we get data
      const filteredData =
        data?.filter((screening) => {
          const screeningDate = new Date(screening.datetime);
          const screeningYear = screeningDate.getFullYear();
          const screeningMonth = screeningDate.getMonth();

          const currentYear = currentMonth.getFullYear();
          const currentMonthNum = currentMonth.getMonth();

          const inCurrentMonth =
            screeningYear === currentYear && screeningMonth === currentMonthNum;

          if (inCurrentMonth) {
            console.log(
              `✅ Screening in current month (${currentYear}-${
                currentMonthNum + 1
              }):`,
              {
                candidateName: screening.candidates?.name,
                screeningDate: screening.datetime,
                screeningYear,
                screeningMonth: screeningMonth + 1,
              }
            );
          }

          return inCurrentMonth;
        }) || [];

      console.log("Filtered screenings for current month:", filteredData);

      console.log(
        `Setting ${filteredData.length} screenings for calendar display`
      );
      setScreenings(filteredData);
    } catch (error) {
      console.error("Error fetching screenings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSelectedDateScreenings = () => {
    // Use the same date parsing logic as getScreeningsForDate
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const selectedDateStr = `${year}-${month}-${day}`;

    const dayScreenings = screenings.filter((screening) => {
      const screeningDate = new Date(screening.datetime);
      const screeningYear = screeningDate.getFullYear();
      const screeningMonth = String(screeningDate.getMonth() + 1).padStart(
        2,
        "0"
      );
      const screeningDay = String(screeningDate.getDate()).padStart(2, "0");
      const screeningDateStr = `${screeningYear}-${screeningMonth}-${screeningDay}`;

      return screeningDateStr === selectedDateStr;
    });

    console.log(
      `Selected date ${selectedDateStr} has ${dayScreenings.length} screenings`
    );
    setSelectedDateScreenings(dayScreenings);
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getScreeningsForDate = (date: Date) => {
    // Use local date to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const dayScreenings = screenings.filter((screening) => {
      // Parse the screening datetime properly
      const screeningDate = new Date(screening.datetime);
      const screeningYear = screeningDate.getFullYear();
      const screeningMonth = String(screeningDate.getMonth() + 1).padStart(
        2,
        "0"
      );
      const screeningDay = String(screeningDate.getDate()).padStart(2, "0");
      const screeningDateStr = `${screeningYear}-${screeningMonth}-${screeningDay}`;

      const matches = screeningDateStr === dateStr;

      if (matches) {
        console.log(`✅ Found screening on ${dateStr}:`, {
          candidateName: screening.candidates?.name,
          screeningDateTime: screening.datetime,
          parsedDate: screeningDateStr,
          calendarDate: dateStr,
        });
      }

      return matches;
    });

    return dayScreenings;
  };

  const hasScreenings = (date: Date) => {
    return getScreeningsForDate(date).length > 0;
  };
  const renderCalendar = () => {
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-32 border-t border-l border-gray-200"
        ></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const dayScreenings = getScreeningsForDate(date);
      const hasEvents = dayScreenings.length > 0;
      const _isToday = isToday(date);
      const _isSelected = isSelected(date);

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-32 border-t border-l border-gray-200 p-2 cursor-pointer transition-colors ${
            _isSelected ? "bg-indigo-50" : _isToday ? "bg-blue-50" : ""
          } hover:bg-gray-50`}
        >
          <div className="flex justify-between">
            <span
              className={`text-sm font-medium ${
                _isToday ? "text-blue-600" : ""
              }`}
            >
              {day}
            </span>
            {hasEvents && (
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            )}
          </div>

          {hasEvents && (
            <div className="mt-2 space-y-1">
              <div className="p-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                {dayScreenings.length} Screening
                {dayScreenings.length > 1 ? "s" : ""}
              </div>
              {dayScreenings.slice(0, 1).map((screening, index) => (
                <div
                  key={screening.id}
                  className="p-1 bg-gray-100 text-gray-700 text-xs rounded truncate"
                  onClick={(e) => {
                    e.stopPropagation();
                    setScreeningDetails({ screening, showModal: true });
                  }}
                >
                  {screening.candidates?.name || "Unknown"}
                </div>
              ))}
              {dayScreenings.length > 1 && (
                <div className="text-xs text-gray-500">
                  +{dayScreenings.length - 1} more
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Show loading or authentication message
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h1>
          <p className="text-gray-600">
            Please log in to view your screening schedule.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Screening Schedule</h1>
        <p className="text-gray-600">
          Manage and schedule candidate screenings.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <button
                  onClick={prevMonth}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <ChevronLeftIcon size={20} />
                </button>
                <h2 className="text-lg font-medium mx-4">
                  {currentMonth.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <ChevronRightIcon size={20} />
                </button>
              </div>
              <button
                onClick={() => setShowNewScreeningModal(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon size={16} className="mr-1" />
                New Screening
              </button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 border-b border-gray-200">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => (
                  <div key={index} className="py-2">
                    {day}
                  </div>
                )
              )}
            </div>
            <div className="grid grid-cols-7">{renderCalendar()}</div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium">
                {selectedDate.toLocaleDateString("default", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h3>
              <div className="text-sm text-gray-500">
                {selectedDateScreenings.length} screening
                {selectedDateScreenings.length !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="p-4 space-y-4">
              {selectedDateScreenings.length > 0 ? (
                selectedDateScreenings.map((screening) => (
                  <div
                    key={screening.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">
                          {screening.candidates?.name || "Unknown Candidate"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {screening.candidates?.position ||
                            "No position specified"}
                        </p>
                      </div>
                      <CheckCircleIcon size={16} className="text-green-500" />
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <ClockIcon size={14} className="mr-1" />
                      <span>{formatTime(screening.datetime)} (30 min)</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          setScreeningDetails({ screening, showModal: true })
                        }
                        className="flex-1 bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                      >
                        View Details
                      </button>
                      <button className="flex-1 border border-gray-300 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-50">
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon
                    size={40}
                    className="mx-auto text-gray-400 mb-3"
                  />
                  <p className="text-gray-500">
                    No screenings scheduled for this day
                  </p>
                  <button
                    onClick={() => setShowNewScreeningModal(true)}
                    className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <PlusIcon size={16} className="mr-1" />
                    Schedule Screening
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium">Upcoming Screenings</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Tomorrow
                  </h4>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Alex Johnson</h4>
                        <p className="text-sm text-gray-500">UX Designer</p>
                      </div>
                      <CheckCircleIcon size={16} className="text-green-500" />
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <ClockIcon size={14} className="mr-1" />
                      <span>9:30 AM (30 min)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    This Week
                  </h4>
                  <div className="space-y-2">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Maria Sanchez</h4>
                          <p className="text-sm text-gray-500">
                            Product Manager
                          </p>
                        </div>
                        <CheckCircleIcon size={16} className="text-green-500" />
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <CalendarIcon size={14} className="mr-1" />
                        <span>Wed, Jun 22 • 11:00 AM</span>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">David Park</h4>
                          <p className="text-sm text-gray-500">
                            Backend Developer
                          </p>
                        </div>
                        <AlertCircleIcon
                          size={16}
                          className="text-yellow-500"
                        />
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <CalendarIcon size={14} className="mr-1" />
                        <span>Fri, Jun 24 • 2:30 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showNewScreeningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium">Schedule New Screening</h3>
              <button onClick={() => setShowNewScreeningModal(false)}>
                <XCircleIcon size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Candidate
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <UserIcon size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Select or enter candidate name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <select className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Full Stack Developer</option>
                    <option>UX Designer</option>
                    <option>Product Manager</option>
                    <option>Data Scientist</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <CalendarIcon size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <ClockIcon size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="time"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <select className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Add any additional information..."
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewScreeningModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowNewScreeningModal(false)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Details Modal */}
      {screeningDetails?.showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Screening Details</h3>
              <button
                onClick={() => setScreeningDetails(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Candidate Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <UserIcon size={20} className="text-indigo-600" />
                    <h4 className="font-semibold text-gray-900">
                      Candidate Information
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Name
                      </label>
                      <p className="text-gray-900">
                        {screeningDetails.screening.candidates?.name ||
                          "Unknown"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Phone
                      </label>
                      <p className="text-gray-900">
                        {screeningDetails.screening.candidates?.phone ||
                          "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Position Applied
                      </label>
                      <p className="text-gray-900">
                        {screeningDetails.screening.candidates?.position ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Job & Interview Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <BriefcaseIcon size={20} className="text-indigo-600" />
                    <h4 className="font-semibold text-gray-900">
                      Job & Interview Details
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Vacancy
                      </label>
                      <p className="text-gray-900">
                        {screeningDetails.screening.candidates?.position ||
                          "General Position"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Interview Agent
                      </label>
                      <p className="text-gray-900">
                        {screeningDetails.screening.users?.name ||
                          "Not assigned"}
                        {screeningDetails.screening.users?.email && (
                          <span className="text-gray-500 text-sm block">
                            {screeningDetails.screening.users.email}
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Scheduled Time
                      </label>
                      <p className="text-gray-900">
                        {new Date(
                          screeningDetails.screening.datetime
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        at {formatTime(screeningDetails.screening.datetime)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Status
                      </label>
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon size={16} className="text-green-500" />
                        <span className="text-green-700 capitalize">
                          {screeningDetails.screening.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setScreeningDetails(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
                  Start Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
