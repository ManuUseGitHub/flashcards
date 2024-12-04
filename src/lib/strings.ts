import { arraysEqual } from '../ressources/arrayHelper';
import { MissmatchError } from './exceptions/custom';
import { firstGroup, onMatched, truthy } from './regex';

const enum PAD_DIRECTION {
  LEFT,
  RIGHT,
  CENTER,
  NONE,
}

const trim = (s: string) => {
  return s.trim();
};
const findCarriage = (s: string) => {
  let carriage = '\n';
  if (s) {
    const m = /([\r\n])/.exec(s);
    carriage = m ? m[1] : carriage;
  }
  return carriage;
};
const makeTabbedCSV = (
  s: string,
  direction: PAD_DIRECTION = PAD_DIRECTION.LEFT
) => {
  let trimmedTrailling = trimCSVValuesLines(sanitizeEndOfLines(s));

  if (trimmedTrailling.length <= 1) {
    return s;
  }
  const t = trimmedTrailling[0].split(';').length;
  let ofsets = getColumnOfsets(t);

  trimmedTrailling.forEach((line) => {
    if (direction == PAD_DIRECTION.NONE) {
      ofsets.push(line.length);
    } else {
      line
        .split(';')
        .forEach((columnValue: any, j: number) =>
          addMaxColumnOfset(ofsets, columnValue, j)
        );
    }
  });

  const result = trimmedTrailling
    .map((line) =>
      direction == PAD_DIRECTION.NONE
        ? pad(line, Math.max(...ofsets), PAD_DIRECTION.RIGHT)
        : line
            .split(';')
            .map((s: string, j: number) => pad(s, ofsets[j], direction))
            .join(';')
    )
    .join(findCarriage(s))
    .replace('\u{FE54}', ';');
  return result;
};
const trimCSVValues = (s: string) => {
  let trimmedTrailling = trimCSVValuesLines(s);
  return trimmedTrailling.join(findCarriage(s));
};

const replaceSemicolon = (s: string) => {
  let p = /(?:("[^\"]*;[^\"]*"|[^\;]*)[\n\r;])/g;
  let m;
  let segment = [];
  const started = s + '\n';
  do {
    m = p.exec(started);
    if (m && m[1]) {
      segment.push(m[1].replace(';', '\u{FE54}'));
    } else if (m != null) {
      segment.push('');
    }
  } while (m);
  return segment.join(';');
};

const makeFirstSignificant = (s: string) => {
  return s
    .split(/[\r\n]+/)
    .map((x) => (/^\s*;/.test(x) ? '""' + x : x))
    .join('\n');
};

const rawLinesEscaped = (s: string) => {
  return makeFirstSignificant(replaceSemicolon(s))
    .split(';')
    .map(trim)
    .join(';')
    .split(/[\r\n]+/);
};
const trimCSVValuesLines = (s: string) =>
  rawLinesEscaped(s).map(trimTrailingSpaces);

const whiteSpaceFeedOf = (ofset: number) => Array(ofset + 1).join(' ');

const padLeftAndRight = (s: string, padding: string) => {
  const half = padding.length / 2;
  return (
    whiteSpaceFeedOf(Math.floor(half)) + s + whiteSpaceFeedOf(Math.ceil(half))
  );
};
function pad(
  s: string,
  totalLength: number = 0,
  direction: PAD_DIRECTION = PAD_DIRECTION.LEFT
) {
  const stringValue = s.toString();
  const padding = Array(Math.max(totalLength - stringValue.length + 1, 0)).join(
    ' '
  );
  return (
    direction == PAD_DIRECTION.LEFT
      ? padding + stringValue
      : direction == PAD_DIRECTION.RIGHT
      ? stringValue + padding
      : direction == PAD_DIRECTION.CENTER
      ? padLeftAndRight(stringValue, padding)
      : stringValue
  ).replace('\u{FE54}', ';');
}
const trimTrailingSpaces = (line: string): any =>
  onMatched(/(.+[^\s])\s*$/, line, firstGroup);

function getColumnOfsets(t: any) {
  let ofsets: number[] = [];
  let j;
  for (j = 0; j < t; ++j) {
    ofsets[j] = 0;
  }
  return ofsets;
}
function addMaxColumnOfset(ofsets: number[], columnValue: any, j: number) {
  const valueLength = String(columnValue).length;
  if (ofsets[j] < valueLength) {
    ofsets[j] = valueLength;
  }
}

const htmlToCsv = (html: string) => {
  return trimCSVValues(
    html
      .replace(/<(?:div|span)[^\>]+>|<\/span>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/<\/div>/g, '\n')
  );
};
const removeRequiredMarkers = (x: string) => {
  return x.replace(/\s\*/g, '');
};
const checkHeaderMatch = (headers: string[], candidate: string[]) => {
  if (
    !arraysEqual(
      headers.map(removeRequiredMarkers),
      candidate.map(removeRequiredMarkers)
    )
  ) {
    throw new MissmatchError('headers should match');
  }
};

const mergeCSVs = (contents: string[], requiredHeaders: string[] = []) => {
  let headers: string[] = [];

  const result: string[] = [];
  contents.forEach((x) => {
    const pattern = /^([^\n\r]+)[\n\r](.+)$/gs;
    const normalized = x.replace(/[\n\r]+/, '\n');
    if (headers.length == 0) {
      headers = getHeaderOfCsvText(normalized, requiredHeaders);

      result.push(headers.join(';'));
    }

    result.push(
      onMatched(pattern, normalized, (m) => {
        checkHeaderMatch(
          headers,
          trimCSVValues(m[1]).split(';').filter(truthy)
        );
        return m[2];
      })
    );
  });

  return result.join('\n');
};

const introducedValue = (
  introduction: string,
  actualValue: any,
  registered: any[] = []
) => {
  const actualValueString = reprepend(
    introduction,
    prependAPlusIfIncluded(registered, actualValue)
  );

  return actualValue ? `${actualValueString}` : actualValue;
};
function prependAPlusIfIncluded(registered: any[], actualValue: any) {
  return registered.includes(actualValue) ? actualValue : `+${actualValue}`;
}
function reprepend(introduction: string, p0: any) {
  const introducted = `${introduction}${p0}`;
  const m = /(?<before>.+)\s*\+(?<after>.+)/.exec(introducted);
  if (m) {
    const { before, after } = m?.groups as { before: string; after: string };
    return `+${before}${after}`;
  }
  return introducted;
}

const isCsvValide = (csv: string, requiredHeaders: string[] = []) => {
  const escaped = replaceSemicolon(csv).replace(/;[\r\n]/g, '\n');
  const headers = getHeaderOfCsvText(escaped, requiredHeaders);
  const falsyLines: number[] = [];
  let hasRecords = escaped.trim().split(/[\r\n]/).length > 1;

  trimCSVValuesLines(escaped).forEach((x, i) => {
    const record = x.split(';');
    if (record.length != headers.length) {
      falsyLines.push(i);
    } else {
      headers.forEach((header, c) => {
        if (
          (/\*$/.test(header) && record[c] == '') ||
          record[c] == undefined ||
          record[c] == null
        ) {
          falsyLines.push(i);
          //console.log(falsyLines);
        }
      });
    }
  });
  return { valid: hasRecords && falsyLines.length == 0, lines: falsyLines };
};

function removePadding(text: string) {
  return text
    .split(/[\r\n]/)
    .map((x) => x.trim())
    .join('\n');
}

function sanitizeEndOfLines(s: string): string {
  const lines = s.split(/[\r\n]+/);
  const sanitized =
    lines.length > 1 && lines[0].charAt(lines[0].length - 1) == ';'
      ? s
          .split(/[\r\n]+/)
          .map((s) => onMatched(/(.*);$/, s, firstGroup))
          .join(findCarriage(s))
      : s;
  return sanitized;
}
function getHeaderOfCsvText(x: string, requiredHeaders: string[]): string[] {
  return trimCSVValues(x.split(/[\r\n]+/)[0])
    .split(';')
    .map((x) => {
      return requiredHeaders.includes(x) && !/.+\*$/.test(x) ? x + ' *' : x;
    })
    .filter(truthy);
}

export {
  trim,
  trimCSVValues,
  pad,
  PAD_DIRECTION,
  findCarriage,
  makeTabbedCSV,
  mergeCSVs,
  introducedValue,
  replaceSemicolon,
  htmlToCsv,
  isCsvValide,
  getHeaderOfCsvText,
  removeRequiredMarkers,
  removePadding,
};
