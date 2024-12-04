import { CardEntry, EffectiveFilters } from '../../ressources/types';
import { evalueateFilter } from './sorter';

export const hasMatrchingText = (filters: EffectiveFilters, e: CardEntry) => {
  const { containing } = filters;
  
  return evalueateFilter(
    containing == null || !containing,
    () =>
      new RegExp(`.*(${containing}).*`, 'ig').test(e.dutch) ||
      new RegExp(`.*(${containing}).*`, 'ig').test(e.french)
  );
};
