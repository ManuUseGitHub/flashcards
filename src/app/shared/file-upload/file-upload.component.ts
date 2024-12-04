import {
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { icons } from '../../../ressources/icons';

@Component({
  selector: 'app-file-upload',
  templateUrl: 'file-upload.component.html',
  styleUrls: ['file-upload.component.scss'],
  standalone: false,
})
export class FileUploadComponent {
  icons = icons;
  @ContentChild(TemplateRef) child!: TemplateRef<any>;
  @Input() isMultiple = false;
  @Output() onReadFileContent = new EventEmitter<string[]>();

  onFileSelected(event: any) {
    const contents: string[] = [];
    const files: File[] = Object.values(event.target.files);
    files.map((file) => {
      if (file) {
        let fileReader: FileReader = new FileReader();
        fileReader.onloadend = (f) => {
          contents.push(fileReader.result as string);
          if (contents.length == files.length) {
            this.onReadFileContent.emit(contents);
          }
        };
        fileReader.readAsText(file);
      }
    });
  }
}
