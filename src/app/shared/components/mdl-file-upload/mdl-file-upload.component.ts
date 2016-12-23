import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
  NgZone
} from '@angular/core';

import { Subject } from 'rxjs';

export interface FileUploadCommands {
  reset: Function;
  hasFile: Function;
}

@Component({
  selector: 'mdl-file-upload',
  templateUrl: 'mdl-file-upload.component.html',
  styleUrls: ['mdl-file-upload.component.scss']
})

export class MdlFileUploadComponent implements OnInit {

  private _hasContent = false;

  private _fileContent = null;
  private _fileContent$: Subject<string>;

  @ViewChild('label') $label: ElementRef;
  @ViewChild('fileInput') $fileInput: ElementRef;

  @Output() onInit = new EventEmitter<any>();
  @Output() onFileChange = new EventEmitter<any>();

  constructor(private zone: NgZone) {
    this._fileContent$ = <Subject<string>>new Subject();
  }

  ngOnInit() {
    this.setFileContent('');
    this.onInit.emit({
      reset: this.reset.bind(this),
      hasFile: this.hasFile.bind(this)
    } as FileUploadCommands);
  }

  get hasContent() {
    return this._hasContent;
  }

  get fileContent$() {
    return this._fileContent$.asObservable();
  }

  onChange(evt) {
    if (evt.target.files.length > 0) {
      this.update(evt.target.files[0]);
    }
  }

  onDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  }

  onFileDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    if (evt.dataTransfer.files.length > 0) {
      this.update(evt.dataTransfer.files[0]);
    }
  }

  private update(file) {
    if (file) {
      this.$label.nativeElement.value = file.name;
      this.readBlob(file);
      this.zone.run(() => this._hasContent = true);
    }
  }

  private onFileReadLoad(evt) {
    if (evt.target.readyState === FileReader['DONE']) {
      this.onFileChange.emit(evt);
      this.setFileContent(evt.target.result);
    }
  }

  private setFileContent(file: string) {
    this._fileContent = file;
    this._fileContent$.next(file);
  }

  private hasFile() {
    return this._fileContent && this._fileContent !== '';
  }

  private reset() {
    this.$label.nativeElement.value = null;
    this.$fileInput.nativeElement.value = null;
    this.setFileContent('');
    this._hasContent = false;
  }

  private readBlob(file) {
    if (!file) {
      console.error('Please select a file!');
      return;
    }

    let reader = new FileReader();

    reader.addEventListener('loadend', this.onFileReadLoad.bind(this));
    reader.readAsBinaryString(file.slice(0, file.size));
  }

}
