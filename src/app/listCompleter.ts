import { CardEntry } from '../ressources/types';

export const makeCompleteList = (data: { [x: string]: CardEntry[] }) => {
  const complete: CardEntry[] = [];
  Object.entries(data).forEach((x: [string, CardEntry[]]) => {
    const [key, entries] = x;
    const t = entries.length;

    for (let i = 0; i < t; i++) {
        entries[i].file = key
      complete.push(entries[i]);
    }
  });
  return complete;
};
