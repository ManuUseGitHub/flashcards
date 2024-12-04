import { evalueateFilter } from './sorter';

export const hasMultipleClassmentSelect = (
  valeurs: string[],
  name: string,
  e: any
) => {
  return evalueateFilter(valeurs.length == 0, () => {
    if (e[name].length == 0) return false;
    return valeurs.filter((element) => e[name].includes(element)).length > 0;
  });
};

export const removeMatchingSelect = (
  valeurs: string[],
  name: string,
  e: any
) => {
  return evalueateFilter(valeurs.length == 0, () => {
    if (e[name].length == 0) return true;
    return !(valeurs.filter((element) => e[name].includes(element)).length > 0);
  });
};