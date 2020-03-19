import {HttpErrorResponse} from '@angular/common/http';
import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {forkJoin} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpService} from '../../../../services/helper/http.service';
import {InterfaceFileUploadDialogComponent} from '../file-upload.component';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss'],
})
export class FileUploadDialogComponent implements OnInit {

  progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  constructor(
    private httpService: HttpService,
    public dialogRef: MatDialogRef<FileUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InterfaceFileUploadDialogComponent) {
  }

  ngOnInit(): void {
  }

  closeDialog() {
    // if everything is uploaded, just close the dialog
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map
    this.progress = this.httpService.postUploadFiles(
      this.data.files,
      this.data.url,
      this.data.postVariables,
    );

    // convert the progress map into an array
    const allProgressObservables = [];
    for (const key of Object.keys(this.progress)) {
      allProgressObservables
        .push(this.progress[key].progress);
    }

    // Adjust the state variables

    // The OK-button should have the text "Finish" now
    this.primaryButtonText = 'Finish';

    // The dialog should not be closed while uploading
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;

    // Hide the cancel-button
    this.showCancelButton = false;

    // When all progress-observables are completed...
    forkJoin(allProgressObservables)
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe(end => {
        // ... the dialog can be closed again...
        this.canBeClosed = true;
        this.dialogRef.disableClose = false;

        // ... the upload was successful...
        this.uploadSuccessful = true;

        // ... and the component is no longer uploading
        this.uploading = false;
        this.data.uploadComplete.emit(true);
        if (this.data.autoClose) {
          return this.dialogRef.close();
        }
      });
  }

  private handleError(error: HttpErrorResponse) {
    this.data.uploadComplete.emit(true);
    return this.dialogRef.close();
  }
}
