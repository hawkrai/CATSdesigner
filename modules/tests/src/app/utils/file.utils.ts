export class FileUtils {
    public static downloadFile(httpResponse: Response, filename?: string): void {
        const wnd: any = (<any>window);

        const contentDisposition: string = httpResponse.headers.get("content-disposition");
        if (contentDisposition) {
            const fileName: string = filename || contentDisposition.replace("attachment; filename=", "");

            if (wnd.navigator.appVersion.toString().indexOf(".NET") > 0) { // for IE browser
                wnd.navigator.msSaveBlob(httpResponse.body, fileName);
            } else { // for other browsers
                const anchor = document.createElement("a");
                anchor.download = fileName;
                anchor.href = URL.createObjectURL(httpResponse.body);
                anchor.click();
            }
        }
    }
}
