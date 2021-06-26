import { HttpResponse } from "@angular/common/http";
import { Injectable, Renderer2, RendererFactory2 } from "@angular/core";

@Injectable({ providedIn: 'root'})
export class CoreService {

    private renderer: Renderer2;
    constructor(
        rendererFactory: RendererFactory2,
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }
    download(response: HttpResponse<Blob> | HttpResponse<ArrayBuffer>): void {
        const a = this.renderer.createElement('a');
        this.renderer.setAttribute(a, 'style', 'display:none;');
        this.renderer.appendChild(document.body, a);
        const filename = this.getFileNameFromHttpResponse(response);
        a.href = response.body instanceof ArrayBuffer ? URL.createObjectURL(new Blob([response.body])) : URL.createObjectURL(response.body);
        a.download = filename;
        a.target = '_blank';
        a.click();
        this.renderer.removeChild(document.body, a);
    }

    private getFileNameFromHttpResponse(httpResponse: HttpResponse<any>) {
        var contentDispositionHeader = httpResponse.headers.get('content-disposition');
        var result = contentDispositionHeader.split(';')[1].trim().split('=')[1];
        return result.replace(/"/g, '');
    }
}