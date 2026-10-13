import { useState, useEffect } from 'react';

/**
 * Returns the current date as a YYYY-MM-DD string in local time.
 */
export const getTodayDateStr = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns current year-month as YYYY-MM in local time.
 */
export const getCurrentMonthStr = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Formats YYYY-MM-DD into Indonesian human-readable format.
 * E.g., '12 Okt 2026' or 'Senin, 12 Okt 2026'
 */
export const formatDateIndo = (dateStr: string, withDayName: boolean = false): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const dateObj = new Date(year, month, day);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const formatted = `${day} ${monthNames[month] || ''} ${year}`;
  if (withDayName) {
    return `${dayNames[dateObj.getDay()]}, ${formatted}`;
  }
  return formatted;
};

/**
 * Custom React Hook that automatically updates whenever the date changes (e.g., at midnight,
 * or when the user re-opens/focuses the app on their phone).
 */
export const useCurrentDate = (): {
  todayStr: string;
  monthStr: string;
  formattedIndo: string;
} => {
  const [todayStr, setTodayStr] = useState<string>(getTodayDateStr);

  useEffect(() => {
    const checkDateChange = () => {
      const current = getTodayDateStr();
      setTodayStr(prev => (prev !== current ? current : prev));
    };

    // Check periodically every 20 seconds
    const interval = setInterval(checkDateChange, 20000);

    // Also check immediately when the user returns to the tab or phone screen wakes up
    window.addEventListener('focus', checkDateChange);
    document.addEventListener('visibilitychange', checkDateChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkDateChange);
      document.removeEventListener('visibilitychange', checkDateChange);
    };
  }, []);

  return {
    todayStr,
    monthStr: todayStr.slice(0, 7),
    formattedIndo: formatDateIndo(todayStr)
  };
};
