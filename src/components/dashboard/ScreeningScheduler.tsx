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
  recruiter?: {
    name: string;
    avatar: string;
  };
  job_title?: string;
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
  const [upcomingScreenings, setUpcomingScreenings] = useState<{
    tomorrow: CandidateScreening[];
    thisWeek: CandidateScreening[];
  }>({ tomorrow: [], thisWeek: [] });
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
      fetchUpcomingScreenings();
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

      // Test the formatting with your exact datetime formats
      console.log("=== TESTING TIME FORMATTING ===");
      const testTimes = ["2025-08-13 10:00:00+00", "2025-08-13 09:00:00+00"];
      testTimes.forEach((testTime) => {
        const isoFormat = testTime.replace(" ", "T").replace("+00", "Z");
        const date = new Date(isoFormat);
        console.log(`Test: ${testTime}`, {
          original: testTime,
          isoFormat: isoFormat,
          parsed: date,
          utcHours: date.getUTCHours(),
          utcMinutes: date.getUTCMinutes(),
          expectedDisplay: `${date.getUTCHours() % 12 || 12}:${date
            .getUTCMinutes()
            .toString()
            .padStart(2, "0")} ${date.getUTCHours() >= 12 ? "PM" : "AM"}`,
        });
      });

      // Debug: Log datetime formats from database
      if (screeningsData && screeningsData.length > 0) {
        screeningsData.forEach((screening, index) => {
          console.log(`Screening ${index} datetime:`, {
            raw: screening.datetime,
            type: typeof screening.datetime,
            parsed: new Date(screening.datetime),
            isValid: !isNaN(new Date(screening.datetime).getTime()),
          });
        });
      }

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

          // Get assigned recruiter information
          let recruiterData = null;
          try {
            const { data: assignmentData } = await supabase
              .from("candidate_recruiter_assignments")
              .select(
                `
                recruiters!inner(name, avatar)
              `
              )
              .eq("candidate_id", screening.candidate_id)
              .single();

            recruiterData = assignmentData?.recruiters;
          } catch (recruiterError) {
            console.log(
              `No recruiter assignment found for candidate ${screening.candidate_id}`
            );
          }

          // Get assigned job title
          let jobTitle = candidateData?.position || "Unknown Position";
          try {
            const { data: jobAssignmentData } = await supabase
              .from("candidate_job_assignments")
              .select(
                `
                job_postings!inner(title)
              `
              )
              .eq("candidate_id", screening.candidate_id)
              .single();

            if (jobAssignmentData?.job_postings?.title) {
              jobTitle = jobAssignmentData.job_postings.title;
            }
          } catch (jobError) {
            console.log(
              `No job assignment found for candidate ${screening.candidate_id}`
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
            recruiter: recruiterData || undefined,
            job_title: jobTitle,
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

  const fetchUpcomingScreenings = async () => {
    if (!user?.id) return;

    try {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const endOfTomorrow = new Date(tomorrow);
      endOfTomorrow.setHours(23, 59, 59, 999);

      const endOfWeek = new Date(now);
      endOfWeek.setDate(endOfWeek.getDate() + 7);
      endOfWeek.setHours(23, 59, 59, 999);

      console.log("Fetching upcoming screenings:", {
        now: now.toISOString(),
        tomorrow: tomorrow.toISOString(),
        endOfTomorrow: endOfTomorrow.toISOString(),
        endOfWeek: endOfWeek.toISOString(),
      });

      // Get all upcoming screenings
      const { data: screeningsData, error } = await supabase
        .from("candidate_screenings")
        .select("*")
        .eq("status", "scheduled")
        .eq("user_id", user.id)
        .gte("datetime", now.toISOString())
        .order("datetime", { ascending: true });

      if (error) {
        console.error("Error fetching upcoming screenings:", error);
        return;
      }

      const enrichedUpcomingScreenings = [];

      if (screeningsData && screeningsData.length > 0) {
        for (const screening of screeningsData) {
          // Get candidate data
          const { data: candidateData } = await supabase
            .from("candidates")
            .select("name, phone, position")
            .eq("id", screening.candidate_id)
            .single();

          // Get user data
          const { data: userData } = await supabase
            .from("users")
            .select("name, email")
            .eq("id", screening.user_id)
            .single();

          // Get assigned recruiter information
          let recruiterData = null;
          try {
            const { data: assignmentData } = await supabase
              .from("candidate_recruiter_assignments")
              .select(
                `
                recruiters!inner(name, avatar)
              `
              )
              .eq("candidate_id", screening.candidate_id)
              .single();

            recruiterData = assignmentData?.recruiters;
          } catch (recruiterError) {
            console.log(
              `No recruiter assignment found for upcoming screening candidate ${screening.candidate_id}`
            );
          }

          // Get assigned job title
          let jobTitle = candidateData?.position || "Unknown Position";
          try {
            const { data: jobAssignmentData } = await supabase
              .from("candidate_job_assignments")
              .select(
                `
                job_postings!inner(title)
              `
              )
              .eq("candidate_id", screening.candidate_id)
              .single();

            if (jobAssignmentData?.job_postings?.title) {
              jobTitle = jobAssignmentData.job_postings.title;
            }
          } catch (jobError) {
            console.log(
              `No job assignment found for upcoming screening candidate ${screening.candidate_id}`
            );
          }

          if (candidateData) {
            enrichedUpcomingScreenings.push({
              ...screening,
              candidates: candidateData,
              users: userData || { name: "Unknown Agent", email: "" },
              recruiter: recruiterData || undefined,
              job_title: jobTitle,
            });
          }
        }
      }

      // Separate tomorrow and this week screenings
      const tomorrowScreenings = enrichedUpcomingScreenings.filter(
        (screening) => {
          const screeningDate = new Date(screening.datetime);
          return screeningDate >= tomorrow && screeningDate <= endOfTomorrow;
        }
      );

      const thisWeekScreenings = enrichedUpcomingScreenings.filter(
        (screening) => {
          const screeningDate = new Date(screening.datetime);
          return screeningDate > endOfTomorrow && screeningDate <= endOfWeek;
        }
      );

      console.log("Upcoming screenings categorized:", {
        tomorrow: tomorrowScreenings.length,
        thisWeek: thisWeekScreenings.length,
        total: enrichedUpcomingScreenings.length,
      });

      setUpcomingScreenings({
        tomorrow: tomorrowScreenings,
        thisWeek: thisWeekScreenings,
      });
    } catch (error) {
      console.error("Error fetching upcoming screenings:", error);
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
        console.log(`Found screening on ${dateStr}:`, {
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

  const formatTime = (datetime: string | null | undefined) => {
    // Handle null/undefined cases
    if (!datetime) {
      console.warn("formatTime received null/undefined datetime");
      return "Time not available";
    }

    console.log("formatTime input:", datetime, typeof datetime);

    try {
      let date: Date;

      // Handle PostgreSQL timestamp format: "2025-08-13 10:00:00+00"
      if (
        datetime.includes(" ") &&
        (datetime.includes("+00") || datetime.includes("-00"))
      ) {
        // PostgreSQL format: "2025-08-13 10:00:00+00"
        // Convert to ISO format for proper parsing
        const isoFormat = datetime.replace(" ", "T").replace("+00", "Z");
        console.log("Converting PostgreSQL format:", datetime, "->", isoFormat);
        date = new Date(isoFormat);
      } else {
        // Standard ISO format or other formats
        date = new Date(datetime);
      }

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date created from:", datetime);
        return "Invalid time";
      }

      console.log("Parsed date:", {
        input: datetime,
        dateObject: date,
        isValid: !isNaN(date.getTime()),
        toISOString: date.toISOString(),
        getHours: date.getHours(),
        getMinutes: date.getMinutes(),
        getUTCHours: date.getUTCHours(),
        getUTCMinutes: date.getUTCMinutes(),
      });

      // Since the original time is in UTC (+00), use UTC methods to get the exact stored time
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();

      if (isNaN(hours) || isNaN(minutes)) {
        console.error("NaN hours or minutes:", { hours, minutes, datetime });
        return "Invalid time";
      }

      console.log("Extracted time:", { hours, minutes, from: datetime });

      // Format to 12-hour format
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, "0");

      const result = `${displayHours}:${displayMinutes} ${ampm}`;
      console.log("formatTime result:", result);

      return result;
    } catch (error) {
      console.error("Error in formatTime:", error, "for datetime:", datetime);
      return "Error formatting time";
    }
  };

  const formatDateTime = (datetime: string | null | undefined) => {
    if (!datetime) {
      return "Date not available";
    }

    try {
      let date: Date;

      // Handle PostgreSQL timestamp format: "2025-08-13 10:00:00+00"
      if (
        datetime.includes(" ") &&
        (datetime.includes("+00") || datetime.includes("-00"))
      ) {
        const isoFormat = datetime.replace(" ", "T").replace("+00", "Z");
        date = new Date(isoFormat);
      } else {
        date = new Date(datetime);
      }

      if (isNaN(date.getTime())) {
        console.error("Invalid date in formatDateTime:", datetime);
        return "Invalid date";
      }

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Compare dates using local date comparison (what users see)
      const getDateString = (d: Date) => {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;
      };

      const screeningDateStr = getDateString(date);
      const todayDateStr = getDateString(today);
      const tomorrowDateStr = getDateString(tomorrow);

      console.log("Date comparison:", {
        screening: screeningDateStr,
        today: todayDateStr,
        tomorrow: tomorrowDateStr,
      });

      // Check if it's today, tomorrow, or another date
      if (screeningDateStr === todayDateStr) {
        return `Today • ${formatTime(datetime)}`;
      } else if (screeningDateStr === tomorrowDateStr) {
        return `Tomorrow • ${formatTime(datetime)}`;
      } else {
        // Format date using local time
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const weekday = weekdays[date.getDay()];
        const month = months[date.getMonth()];
        const day = date.getDate();

        return `${weekday}, ${month} ${day} • ${formatTime(datetime)}`;
      }
    } catch (error) {
      console.error(
        "Error in formatDateTime:",
        error,
        "for datetime:",
        datetime
      );
      return "Error formatting date";
    }
  };

  const formatFullDateTime = (datetime: string | null | undefined) => {
    if (!datetime) {
      return "Date and time not available";
    }

    try {
      let date: Date;

      // Handle PostgreSQL timestamp format: "2025-08-13 10:00:00+00"
      if (
        datetime.includes(" ") &&
        (datetime.includes("+00") || datetime.includes("-00"))
      ) {
        const isoFormat = datetime.replace(" ", "T").replace("+00", "Z");
        date = new Date(isoFormat);
      } else {
        date = new Date(datetime);
      }

      if (isNaN(date.getTime())) {
        console.error("Invalid date in formatFullDateTime:", datetime);
        return "Invalid date and time";
      }

      // Format date using local time (what users expect)
      const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const weekday = weekdays[date.getDay()];
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();

      const formattedDate = `${weekday}, ${month} ${day}, ${year}`;
      const formattedTime = formatTime(datetime);

      return `${formattedDate} at ${formattedTime}`;
    } catch (error) {
      console.error(
        "Error in formatFullDateTime:",
        error,
        "for datetime:",
        datetime
      );
      return "Error formatting date and time";
    }
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
                          {screening.job_title ||
                            screening.candidates?.position ||
                            "No position specified"}
                        </p>
                      </div>
                      <CheckCircleIcon size={16} className="text-green-500" />
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <ClockIcon size={14} className="mr-1" />
                      <span>{formatTime(screening.datetime)}</span>
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
                {/* Tomorrow's Screenings */}
                {upcomingScreenings.tomorrow.length > 0 && (
                  <div>
                    <div className="space-y-2">
                      {upcomingScreenings.tomorrow.map((screening) => (
                        <div
                          key={screening.id}
                          className="border border-gray-200 rounded-lg p-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">
                                {screening.candidates.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {screening.job_title ||
                                  screening.candidates.position}
                              </p>
                              {screening.recruiter && (
                                <div className="flex items-center text-xs text-indigo-600 mt-1">
                                  <UserCheckIcon size={12} className="mr-1" />
                                  <span>Agent: {screening.recruiter.name}</span>
                                </div>
                              )}
                            </div>
                            <CheckCircleIcon
                              size={16}
                              className="text-green-500"
                            />
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <ClockIcon size={14} className="mr-1" />
                            <span>{formatTime(screening.datetime)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* This Week's Screenings */}
                {upcomingScreenings.thisWeek.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      This Week
                    </h4>
                    <div className="space-y-2">
                      {upcomingScreenings.thisWeek.map((screening) => (
                        <div
                          key={screening.id}
                          className="border border-gray-200 rounded-lg p-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">
                                {screening.candidates.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {screening.job_title ||
                                  screening.candidates.position}
                              </p>
                              {screening.recruiter && (
                                <div className="flex items-center text-xs text-indigo-600 mt-1">
                                  <UserCheckIcon size={12} className="mr-1" />
                                  <span>Agent: {screening.recruiter.name}</span>
                                </div>
                              )}
                            </div>
                            <CheckCircleIcon
                              size={16}
                              className="text-green-500"
                            />
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <CalendarIcon size={14} className="mr-1" />
                            <span>{formatDateTime(screening.datetime)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No upcoming screenings message */}
                {upcomingScreenings.tomorrow.length === 0 &&
                  upcomingScreenings.thisWeek.length === 0 && (
                    <div className="text-center py-8">
                      <CalendarIcon
                        size={40}
                        className="mx-auto text-gray-400 mb-3"
                      />
                      <p className="text-gray-500 mb-2">
                        No upcoming screenings
                      </p>
                      <p className="text-sm text-gray-400">
                        Schedule some interviews to see them here
                      </p>
                    </div>
                  )}
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
                        {screeningDetails.screening.job_title ||
                          screeningDetails.screening.candidates?.position ||
                          "General Position"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Interview Agent
                      </label>
                      <p className="text-gray-900">
                        {screeningDetails.screening.recruiter?.name ||
                          screeningDetails.screening.users?.name ||
                          "Not assigned"}
                        {screeningDetails.screening.users?.email && (
                          <span className="text-gray-500 text-sm block">
                            {screeningDetails.screening.users.email}
                          </span>
                        )}
                      </p>
                      {screeningDetails.screening.recruiter && (
                        <div className="flex items-center text-xs text-indigo-600 mt-1">
                          <UserCheckIcon size={12} className="mr-1" />
                          <span>
                            AI Recruiter:{" "}
                            {screeningDetails.screening.recruiter.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Scheduled Time
                      </label>
                      <p className="text-gray-900">
                        {formatFullDateTime(
                          screeningDetails.screening.datetime
                        )}
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
