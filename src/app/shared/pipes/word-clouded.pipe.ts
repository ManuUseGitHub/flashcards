import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'wordClouded',
  standalone: false,
})
export class WordCloudedPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(
    data: string[],
    alternative: string = '(click to set)',
    separator: string = '<a class="bull">•</a>'
  ): SafeHtml {
    let cpt = 0;

    // Sanitize the HTML to make it safe for Angular
    return this.sanitizer.bypassSecurityTrustHtml(
      data
        .filter((x) => x)
        .map((x) => {
          const str = `${x}`;
          let indexPlus = str.indexOf('+');
          indexPlus = indexPlus < 0 ? 0 : indexPlus + 1;
          return `<a class="tag-in-table ${cpt++ % 2 ? '' : 'font-bold'} ${
            /:\s\/$/.test(str)
              ? 'not-filled'
              : /^\s*\+/.test(str)
              ? 'insertable'
              : ''
          }">${str.substring(indexPlus)}</a>`;
        })
        .join(separator) || `<a class="tag-in-table">${alternative}</a>`
    );
  }
}
