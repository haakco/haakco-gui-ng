import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {IndividualConfig} from 'ngx-toastr/toastr/toastr-config';
import {EnumAlertTypes} from '../../enums/EnumAlertTypes';

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  private options: Partial<IndividualConfig> = {
    closeButton: true,
    progressBar: true,
    tapToDismiss: true,
    timeOut: 10000,
    // positionClass: 'md-toast-top-center',
  };

  constructor(private toastService: ToastrService) {
    this.toastService.toastrConfig.preventDuplicates = true;
    this.toastService.toastrConfig.countDuplicates = true;
    this.toastService.toastrConfig.resetTimeoutOnDuplicate = true;
    this.toastService.toastrConfig.maxOpened = 4;
    this.toastService.toastrConfig.autoDismiss = true;
  }

  addAlert(message, type: EnumAlertTypes = EnumAlertTypes.ALERT_TYPE_DANGER, head = null) {
    if (type === null) {
      type = EnumAlertTypes.ALERT_TYPE_DANGER;
    }
    if (type === EnumAlertTypes.ALERT_TYPE_SUCCESS) {
      this.toastService.success(message, null, this.options);
    } else if (type === EnumAlertTypes.ALERT_TYPE_DANGER) {
      this.toastService.error(message, null, this.options);
    } else if (type === EnumAlertTypes.ALERT_TYPE_INFO) {
      this.toastService.info(message, null, this.options);
    } else if (type === EnumAlertTypes.ALERT_TYPE_WARNING) {
      this.toastService.warning(message, null, this.options);
    } else {
      this.toastService.info(message, null, this.options);
    }
  }
}
