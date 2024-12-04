import { CardEntry, EffectiveFilters } from '../../ressources/types';
import { evalueateFilter } from './sorter';

export const hasMatchingType = (filters: EffectiveFilters, e: CardEntry) => {
  const { type } = filters;
  return evalueateFilter(type == '*', () => e.type === type);
};
