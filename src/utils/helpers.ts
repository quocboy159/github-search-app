const calculateDaysBetweenDates = (date: Date) => {
  debugger;
  // Convert both dates to milliseconds
  const date1Ms = new Date(date).getTime();
  const date2Ms = new Date().getTime();

  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(date2Ms - date1Ms);

  // Convert back to days and return
  return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
};

export { calculateDaysBetweenDates };
