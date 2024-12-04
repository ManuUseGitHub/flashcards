import { evalueateFilter } from './sorter';

export const hasMatchingClassmentSelect = (
  valeurs: string[],
  name: string,
  e: any
) => {
  return evalueateFilter(valeurs.length == 0, () => {
    //console.log(e[name]);
    return valeurs.includes(e[name]);
  });
};
