import * as React from "react"

// Simple calendar component that doesn't rely on external libraries
export interface CalendarProps {
  mode?: "single" | "multiple" | "range";
  selected?: Date | Date[] | { from: Date; to: Date };
  onSelect?: (date: Date | undefined) => void;
  className?: string;
}

function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
  ...props
}: CalendarProps & React.HTMLAttributes<HTMLDivElement>) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth());
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear());
  
  // Get the first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Get the last day of the month
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Generate days for the calendar
  const generateCalendarDays = () => {
    const days = [];
    // Previous month days to fill the first week
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ 
        day, 
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, day)
      });
    }
    
    return days;
  };
  
  const days = generateCalendarDays();
  
  // Check if a day is selected
  const isSelected = (date: Date) => {
    if (!selected) return false;
    
    if (selected instanceof Date) {
      return date.toDateString() === selected.toDateString();
    }
    
    return false;
  };
  
  // Format month name
  const getMonthName = (month: number) => {
    return new Date(0, month).toLocaleString('default', { month: 'long' });
  };
  
  // Handle navigation
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Handle day click
  const handleDayClick = (date: Date) => {
    if (onSelect) {
      onSelect(date);
    }
  };
  
  return (
    <div className={`p-3 ${className || ''}`} {...props}>
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPreviousMonth}
          className="p-1 rounded-md hover:bg-gray-200"
          type="button"
        >
          &lt;
        </button>
        <div className="font-medium">
          {getMonthName(currentMonth)} {currentYear}
        </div>
        <button 
          onClick={goToNextMonth}
          className="p-1 rounded-md hover:bg-gray-200"
          type="button"
        >
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => (
          <div key={index} className="text-sm text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((item, index) => (
          <div 
            key={index} 
            className={`h-8 w-8 flex items-center justify-center rounded-md text-sm
              ${!item.isCurrentMonth ? 'text-gray-300' : ''}
              ${item.isCurrentMonth && item.date && isSelected(item.date) ? 'bg-blue-600 text-white' : ''}
              ${item.isCurrentMonth && item.date && !isSelected(item.date) ? 'hover:bg-gray-100 cursor-pointer' : ''}
            `}
            onClick={() => item.isCurrentMonth && item.date && handleDayClick(item.date)}
          >
            {item.day}
          </div>
        ))}
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };