import { useState } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const Calendar = ({selectedDate, setSelectedDate, highlightDates, allDoneNotes}) => {
  
  const [currentDate, setCurrentDate] = useState(new Date());
  //const [selectedDate, setSelectedDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const today = new Date();

    // Create array of days for the current month
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    // Create array of days from previous month to fill the first week
    const prevMonthDays = [];
    const prevMonthDaysCount = firstDayOfMonth;
    if (prevMonthDaysCount > 0) {
      const prevMonth = new Date(currentDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const daysInPrevMonth = getDaysInMonth(prevMonth);
      for (let i = daysInPrevMonth - prevMonthDaysCount + 1; i <= daysInPrevMonth; i++) {
        prevMonthDays.push(i);
      }
    }

    // Create array of days from next month to fill the last week
    const nextMonthDays = [];
    const totalCells = prevMonthDays.length + days.length;
    const nextMonthDaysCount = totalCells > 35 ? 42 - totalCells : 35 - totalCells;
    for (let i = 1; i <= nextMonthDaysCount; i++) {
      nextMonthDays.push(i);
    }

    return (
      <div className="grid grid-cols-7 gap-1 p-2">
        {/* Previous month days */}
        {prevMonthDays.map((day, index) => (
          <div
            key={`prev-${index}`}
            className="h-10 flex items-center justify-center text-gray-400"
          >
            {day}
          </div>
        ))}
              
        {/* Current month days */}
        
        {days.map((day) => {
          const isToday = 
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
          
          const isSelected =
            day === selectedDate.getDate() &&
            currentDate.getMonth() === selectedDate.getMonth() &&
            currentDate.getFullYear() === selectedDate.getFullYear();

          const isHighlighted = highlightDates.some(
            (dateString) => (
              day === new Date(dateString).getDate() && 
              currentDate.getMonth() === new Date(dateString).getMonth() &&
              currentDate.getFullYear() === new Date(dateString).getFullYear()
          ));


          return (
            <button
              key={`current-${day}`}
              onClick={() => handleDateClick(day)}
              className={`h-10 flex items-center justify-center rounded-full transition-colors
                ${isToday ? 'border border-yellow border-3' : ''}
                ${isSelected ? 'bg-yellow text-black' : 'hover:bg-gray-100'}
              `}
            >
              
              {isHighlighted 
                ? (<div className="flex flex-col items-center"> 
                    <div> {day} </div>
                    <div className="w-2 h-1 rounded-full bg-yellow-800"> </div>
                   </div>
                  )
                : day
              }
              
            </button>
          );
        })}

        {/* Next month days */}
        {nextMonthDays.map((day, index) => (
          <div
            key={`next-${index}`}
            className="h-10 flex items-center justify-center text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
      <div className="flex items-center justify-between px-6 py-4 bg-yellow-400 text-black">
        <button 
          onClick={() => navigateMonth(-1)}
          className="hover:bg-yellow-700 p-2 rounded-full"
        >
          <IoIosArrowBack/>
        </button>
        
        <h2 className="text-xl font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button 
          onClick={() => navigateMonth(1)}
          className="hover:bg-yellow-700 p-2 rounded-full"
        >
          <IoIosArrowForward/>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 p-2 text-center text-gray-600 font-medium">
        {dayNames.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {renderCalendar()}

      {/* <div className="px-6 py-4 border-t border-gray-200">
        <p className="text-gray-700">
          Selected: {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div> */}
    </div>
  );
};

export default Calendar;