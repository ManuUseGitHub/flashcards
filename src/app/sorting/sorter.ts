export const evalueateFilter = (testSkip: boolean, test: () => boolean) => {
  if (testSkip) return 0;
  return test() ? 1 : -1;
};
