import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root'})
export class CoreService {

    downloadAsExcel(blob: Blob): void {
        const type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        const ext = 'xls'
        const b = new Blob([blob], { type });
        const fileUrl = window.URL.createObjectURL(b);
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(b, `${fileUrl.split(':')[1] }.${ext}`);
        } else {
            window.open(fileUrl);
        }
    }

    downloadAsZip(blob: ArrayBuffer): void {
        const type = 'application/zip'
        const ext = 'zip'
        const b = new Blob([blob], { type });
        const fileUrl = window.URL.createObjectURL(b);
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(b, `${fileUrl.split(':')[1] }.${ext}`);
        } else {
            window.open(fileUrl);
        }
    }
}