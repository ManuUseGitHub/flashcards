import { v4 } from 'uuid';
import { removeRequiredMarkers, trim } from '../lib/strings';

const ROW_HEADER = [
  'article',
  'dutch',
  'french',
  'type',
  'theme',
  'issuer',
  'chapter',
  'part',
  'tags',
];
const getMatchingColumnValueOrDefault = (
  csvRow: any,
  headers: { [x: string]: string },
  column: string,
  defaultValue: any = null
) => {
  if (!(column in headers)) {
    return defaultValue;
  }
  const value = csvRow[headers[column]];
  return value || null;
};

const onReadingRow = (
  csvrow: any,
  count: number,
  headers: { [x: string]: string },
  records: any[]
) => {
  if (count > 0) {
    const entry: { [x: string]: any } = {
      id: getMatchingColumnValueOrDefault(csvrow, headers, 'id', v4()),
      date: getMatchingColumnValueOrDefault(
        csvrow,
        headers,
        'date',
        new Date()
      ),

      difficulty: Number.parseInt(
        getMatchingColumnValueOrDefault(csvrow, headers, 'difficulty', '-1,0')
      ),
    };
    ROW_HEADER.forEach((key) => {
      entry[key] = getMatchingColumnValueOrDefault(csvrow, headers, key);
    });

    if (entry['tags']) {
      entry['tags'] = entry['tags'].split(',').map(trim).join(',');
    }
    records.push(entry);
  } else {
    csvrow.forEach((collumn: string, id: any) => {
      if (collumn) {
        headers[collumn.replace(/\s\*$/,'')] = id;
      }
    });
  }
};
export { onReadingRow };
