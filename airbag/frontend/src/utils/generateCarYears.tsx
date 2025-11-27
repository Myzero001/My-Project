export const generateCarYears = () => {
  const startYear = 1990;
  const currentYear = new Date().getFullYear();

  return Array.from({ length: currentYear - startYear + 1 }, (_, index) => {
    const year = startYear + index;
    return { value: year.toString(), label: year.toString() };
  });
};
