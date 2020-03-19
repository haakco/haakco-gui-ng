import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {extension, lookup} from 'mime-types';
import {FileUploadDialogComponent} from './file-upload-dialog/file-upload-dialog.component';

export interface InterfaceFileUploadDialogComponent {
  accept: string;
  allowMultipleFiles: boolean;
  fileImageBlobUrls: { [fileName: string]: string | ArrayBuffer };
  files: Set<File>;
  url: string;
  autoClose: boolean;
  postVariables: object;
  uploadComplete: any;
}

@Component({
             selector: 'app-file-upload',
             templateUrl: './file-upload.component.html',
             styleUrls: ['./file-upload.component.scss'],
           })
export class FileUploadComponent implements OnInit {

  @Output() uploadComplete: EventEmitter<boolean> = new EventEmitter();

  @Input() primaryButtonText = 'Add Files';
  @Input() allowMultipleFiles = false;
  @Input() uploadIcon: IconProp = 'upload';
  @Input() postUrl: string;
  @Input() postVariables = {};
  @Input() autoClose = false;

  _accept = '';
  @Input() set accept(acceptList: string) {
    this._accept = acceptList
      .split(',')
      .flatMap((acceptItem) => {
        const acceptListResult = [];
        const mimeExt = acceptItem.trim();
        const mimeType = lookup(mimeExt);
        if (!mimeType) {
          const tempMimeType = mimeExt;
          const tempMimeExt = extension(mimeExt);
          if (tempMimeExt) {
            acceptListResult.push(tempMimeExt);
            acceptListResult.push(tempMimeType);
          } else {
            acceptListResult.push(mimeExt);
          }
        } else {
          acceptListResult.push(mimeExt);
          acceptListResult.push(mimeType);
        }
        return acceptListResult;
      })
      .join(',');
  };

  @ViewChild('fileUploadInput', {static: false}) fileUploadInput;

  files: Set<File>;
  fileImageBlobUrls: { [fileName: string]: string | ArrayBuffer } = {};

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  handleFileInput(files: { [key: string]: File }) {
    if (files) {
      this.files = new Set();
      this.fileImageBlobUrls = {};

      for (const key in files) {
        if (!isNaN(+key)) {
          this.files.add(files[key]);
          const fileReader = new FileReader();
          fileReader.readAsDataURL(files[key]);
          fileReader.onload = (event) => {
            // called once readAsDataURL is completed
            this.fileImageBlobUrls[files[key].name] = event.target.result;
          };
        }
      }

      const data: InterfaceFileUploadDialogComponent = {
        accept: this._accept,
        allowMultipleFiles: this.allowMultipleFiles,
        fileImageBlobUrls: this.fileImageBlobUrls,
        files: this.files,
        url: this.postUrl,
        autoClose: this.autoClose,
        postVariables: this.postVariables,
        uploadComplete: this.uploadComplete,
      };

      const dialogRef = this.dialog.open(
        FileUploadDialogComponent,
        {
          width: '50%',
          height: '50%',
          data,
        },
      );
    }
  }

  addFiles() {
    this.fileUploadInput.nativeElement.click();
  }
}
