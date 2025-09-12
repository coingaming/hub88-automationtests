/**
 * Utility functions for generating dynamic time ranges for Hub88 BO API tests
 */

/**
 * Get ISO formatted date string for a date
 * @param {Date} date - The date to format
 * @returns {string} ISO formatted date string
 */
function getISODateString(date) {
  return date.toISOString();
}

/**
 * Get the start and end dates for the last month
 * @returns {Object} Object with startTime and endTime as ISO strings
 */
export function getLastMonthRange() {
  const now = new Date();
  const endDate = new Date(now);
  
  // Set to the beginning of the current day
  endDate.setHours(23, 59, 59, 999);
  
  // Go back one month for the start date
  const startDate = new Date(now);
  startDate.setMonth(startDate.getMonth() - 1);
  startDate.setHours(0, 0, 0, 0);
  
  return {
    startTime: getISODateString(startDate),
    endTime: getISODateString(endDate)
  };
}

/**
 * Get the start and end dates for the last week
 * @returns {Object} Object with startTime and endTime as ISO strings
 */
export function getLastWeekRange() {
  const now = new Date();
  const endDate = new Date(now);
  
  // Set to the end of the current day
  endDate.setHours(23, 59, 59, 999);
  
  // Go back 7 days for the start date
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 7);
  startDate.setHours(0, 0, 0, 0);
  
  return {
    startTime: getISODateString(startDate),
    endTime: getISODateString(endDate)
  };
}

/**
 * Get the start and end dates for yesterday
 * @returns {Object} Object with startTime and endTime as ISO strings
 */
export function getYesterdayRange() {
  const now = new Date();
  
  // Yesterday end (23:59:59)
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() - 1);
  endDate.setHours(23, 59, 59, 999);
  
  // Yesterday start (00:00:00)
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 1);
  startDate.setHours(0, 0, 0, 0);
  
  return {
    startTime: getISODateString(startDate),
    endTime: getISODateString(endDate)
  };
}
