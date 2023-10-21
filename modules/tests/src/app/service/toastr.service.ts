import { Injectable } from '@angular/core'
import { ToastrService } from 'ngx-toastr'

@Injectable({
  providedIn: 'root',
})
export class AppToastrService {
  constructor(private toastr: ToastrService) {}

  public addSuccessFlashMessage(msg: string) {
    this.toastr.success(msg)
  }

  public addErrorFlashMessage(msg: string) {
    this.toastr.error(msg)
  }

  public addWarningFlashMessage(msg: string) {
    this.toastr.warning(msg)
  }
}
