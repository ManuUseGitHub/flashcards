import { describe, expect, test } from '@jest/globals';
import {
  findCarriage,
  htmlToCsv,
  makeTabbedCSV,
  mergeCSVs,
  pad,
  PAD_DIRECTION,
  trim,
  trimCSVValues,
  isCsvValide,
  getHeaderOfCsvText,
} from '../../lib/strings';
import { MissmatchError } from '../../lib/exceptions/custom';

 // Affichera l'URL de l'API en fonction de l'environnement configuré
const fs = require('fs');
const path = require('path');

type Expectation = {
  challenge: any;
  result: any;
};
describe('strings', () => {
  it.each<Expectation>([
    { challenge: '   lorem', result: 'lorem' },
    { challenge: 'ipsum   ', result: 'ipsum' },
    { challenge: '   dolor  ', result: 'dolor' },
  ])('trim works for both start and end of %p', (exp) => {
    expect(trim(exp.challenge)).toBe(exp.result);
  });

  it.each<Expectation>([
    { challenge: 'resources/csvSource.txt', result: 'resources/csvresult.txt' },
    {
      challenge: 'resources/csvWithTrailings.txt',
      result: 'resources/csvresult.txt',
    },
  ])('trim works for texts with returns', (exp) => {
    expect(trimCSVValues(readFile(exp.challenge))).toBe(readFile(exp.result));
  });

  test('Three csv can make one', () => {
    expect(
      mergeCSVs([
        readFile('resources/composition/csvPart1.txt'),
        readFile('resources/composition/csvPart2.txt'),
        readFile('resources/composition/csvPart3.txt'),
      ])
    ).toBe(readFile('resources/composition/csvMerged.txt'));
  });

  it.each<any[]>([
    [
      'having too many columns',
      { challenge: 'resources/malformated/falsyCsv.txt', result: false },
    ],
    [
      'having too few columns',
      { challenge: 'resources/malformated/falsyCsv2.txt', result: false },
    ],
    [
      'having no entries',
      { challenge: 'resources/malformated/falsyCsv4.txt', result: false },
    ],
    [
      'empty lines',
      { challenge: 'resources/malformated/falsyCsv5.txt', result: false },
    ],
    [
      'required field',
      { challenge: 'resources/malformated/falsyCsv6.txt', result: false },
    ],
  ])('%s can invalidate the whole CSV', (_, exp) => {
    const csv = readFile(exp.challenge);

    expect(isCsvValide(csv, []).valid).toBe(false);
  });

  it.each([
    ['altered header', 'resources/composition/csvPartOdd2.txt'],
    ['swapped headers', 'resources/composition/csvPart2Swapped.txt'],
  ])(
    'merging CSV should only be allowed when headers are the same here we have : %s',
    (_, file) => {
      expect(() => {
        mergeCSVs([
          readFile('resources/composition/csvPart1.txt'),
          readFile(file),
        ]);
      }).toThrow(MissmatchError);
    }
  );

  test('headers can be marked required if listed as such', () => {
    expect(
      getHeaderOfCsvText('dutch;french;type;article;tags;theme', [
        'dutch',
        'french',
      ]).join(';')
    ).toMatch(/\*/);
  });

  test('string with no carriage returns the default carriage', () => {
    expect(findCarriage('hello')).toBe('\n');
  });
  test('trailling semicolon', () => {
    expect(
      makeTabbedCSV(
        readFile('resources/csvTraillingSemicolon.txt'),
        PAD_DIRECTION.LEFT
      )
    ).not.toBe(readFile('resources/csvTraillingSemicolon.txt'));
  });

  test('trailling semicolon but no tabulation', () => {
    expect(
      makeTabbedCSV(
        readFile('resources/csvTraillingSemicolon.txt'),
        PAD_DIRECTION.NONE
      )
    ).toBe(readFile('resources/csvNoTrzilingSemiColon.txt'));
  });

  it.each<any>([
    [
      'padded right',
      {
        challenge: ['resources/csvNonTabbed.txt', PAD_DIRECTION.RIGHT],
        result: 'resources/csvTabbed.txt',
      },
    ],
    [
      'padded left',
      {
        challenge: ['resources/csvNonTabbed.txt', PAD_DIRECTION.LEFT],
        result: 'resources/csvTabbedLeft.txt',
      },
    ],
    [
      'padded outer',
      {
        challenge: ['resources/csvNonTabbed.txt', PAD_DIRECTION.CENTER],
        result: 'resources/csvTabbedCenter.txt',
      },
    ],
  ])('A CSV text can be tabbed %s', (_, exp) => {
    const challenge = exp as Expectation;
    expect(
      makeTabbedCSV(readFile(challenge.challenge[0]), challenge.challenge[1])
    ).toBe(readFile(challenge.result));
  });

  it.each([
    [
      'padded unspecified',
      {
        challenge: ['resources/csvNonPadded.txt', PAD_DIRECTION.NONE],
        result: 'resources/csvPadded.txt',
      },
    ],
  ])('A CSV text can be tabbed %s', (_, exp) => {
    const challenge = exp as Expectation;
    expect(
      makeTabbedCSV(readFile(challenge.challenge[0]), challenge.challenge[1])
    ).toBe(readFile(challenge.result));
  });

  it.each<any[]>([
    [
      'white spaces outer',
      { challenge: '   lorem;ipsum   ;', result: 'lorem;ipsum;' },
    ],
    [
      'white spaces inner',
      { challenge: 'lorem   ;   ipsum;', result: 'lorem;ipsum;' },
      'second',
    ],
    [
      'white spaces arround',
      { challenge: ' lorem  ;  ipsum ;', result: 'lorem;ipsum;' },
      'third',
    ],
  ])(`can trim values of CSV line %p`, (_, exp) => {
    expect(trimCSVValues(exp.challenge)).toBe(exp.result);
  });

  test(`can get a non padded CSV from html`, () => {
    expect(htmlToCsv(readFile('resources/htmlOfCsv.html'))).toBe(
      readFile('resources/csvNonPadded.txt')
    );
  });

  it.each<(Expectation | string)[]>([
    [
      'left',
      { challenge: ['leftPad', PAD_DIRECTION.LEFT], result: '        leftPad' },
    ],
    [
      'right',
      {
        challenge: ['rightPad', PAD_DIRECTION.RIGHT],
        result: 'rightPad      ',
      },
    ],
    [
      'outer odd',
      {
        challenge: ['outerPad', PAD_DIRECTION.CENTER],
        result: ' outerPad  ',
      },
    ],
    [
      'outer even',
      {
        challenge: ['outerPad', PAD_DIRECTION.CENTER],
        result: '    outerPad    ',
      },
    ],
  ])('can pad %s', (_, exp) => {
    const challenge = exp as Expectation;
    const diff = challenge.result.length - challenge.challenge[0].length;
    const expectedSpace = challenge.challenge[0].length + diff;
    expect(
      pad(challenge.challenge[0], expectedSpace, challenge.challenge[1])
    ).toBe(challenge.result);
  });
});

const readFile = (fileName: string) =>
  fs.readFileSync(
    path.join(__dirname, './', fileName),
    'utf8',
    function (err: any, data: any) {
      return data;
    }
  );
