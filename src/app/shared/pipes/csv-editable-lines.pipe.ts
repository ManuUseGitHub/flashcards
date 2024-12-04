import { Pipe, PipeTransform } from '@angular/core';
import { replaceSemicolon } from '../../../lib/strings';

@Pipe({
  name: 'csvEditableLines',
})
export class CsvEditableLinesPipe implements PipeTransform {
  transform(
    value: string,
    index: number = 0,
    validation = { valid: true, lines: [5] }
  ): unknown {
    const lines = replaceSemicolon(value).split('\n');
    if (lines.length && index == 0) {
      return `<div class="bg-primary csv-headers text-white rounded">${lines[0].replace(
        /\s/g,
        '&nbsp;'
      )}</div>`;
    }
    return lines

      .map((l, i) => {
        if (!i) {
          return '';
        }
        const badLineClass = validation.lines.includes(i) ? 'line-errored' : '';
        return [
          `<div class="csv-line ${badLineClass}">`,
          l
            .split(';')
            .map(
              (x, c) =>
                `<span class="value-csv value-csv-${c}">${x.replace(
                  /\s/g,
                  '&nbsp;'
                )}</span>`
            )
            .join(`<span class="semic">;</span>`),
          '</div>',
        ].join('');
      })
      .filter((x) => x)
      .join('')
      .replace('﹔', ';');
  }
}
