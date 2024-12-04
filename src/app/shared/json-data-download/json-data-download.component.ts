import { Component } from '@angular/core';
import { icons } from '../../../ressources/icons';

@Component({
  selector: 'app-json-data-download',
  templateUrl: './json-data-download.component.html',
  styleUrl: './json-data-download.component.scss',
  standalone: false,
})
export class JsonDataDownloadComponent {
  icons = icons;

  async download() {
    const blob = new Blob([sessionStorage.getItem('filters') as string], {
      type: 'application/json',
    });

    // Check if the File System Access API is supported
    if ('showSaveFilePicker' in window) {
      try {
        // Open the "Save As" dialog
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: 'flipCard.fcconf',
          types: [
            {
              description: 'JSON Files',
              accept: { 'application/json': ['.fcconf', '.json'] },
            },
          ],
        });

        // Get the writable stream to save the file
        const writableStream = await handle.createWritable();

        // Get the JSON data and write it to the file

        await writableStream.write(blob);
        await writableStream.close();
      } catch (error) {
        console.error('Save operation canceled or failed:', error);
      }
    } else {
      console.warn(
        'File System Access API not supported. Defaulting to basic download.'
      );

      // Fallback method if File System Access API is unavailable

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'flipCard.fcconf';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }
}
