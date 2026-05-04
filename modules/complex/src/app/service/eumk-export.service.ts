import { Injectable } from '@angular/core'
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { Observable, from, of, throwError } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

export type EumkExportFormat = 'docx' | 'pdf'

export interface EumkExportLabels {
  testQuestionsHeading: string
  attachedMaterials: string
}

@Injectable({ providedIn: 'root' })
export class EumkExportService {
  private readonly baseUrl = '/Services/Concept/ConceptService.svc/ExportEumk'

  constructor(private http: HttpClient) {}

  exportEumk(
    complexId: string,
    documentTitle: string,
    format: EumkExportFormat,
    labels: EumkExportLabels
  ): Observable<void> {
    const params = new HttpParams()
      .set('complexId', complexId)
      .set('format', format)
      .set('title', documentTitle != null ? documentTitle : '')
      .set(
        'testQuestionsHeading',
        labels.testQuestionsHeading != null ? labels.testQuestionsHeading : ''
      )
      .set(
        'attachedMaterialsHeading',
        labels.attachedMaterials != null ? labels.attachedMaterials : ''
      )

    return this.http
      .get(this.baseUrl, {
        params,
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        mergeMap((res) => {
          if (res.ok && res.body) {
            const name = this.pickFilename(res, format, documentTitle)
            this.triggerDownload(res.body, name)
            return of(undefined as void)
          }
          return from(this.readErrorBody(res.body)).pipe(
            mergeMap((txt) =>
              throwError(new Error(txt || 'HTTP ' + res.status))
            )
          )
        })
      )
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  private pickFilename(
    res: HttpResponse<Blob>,
    format: EumkExportFormat,
    title: string
  ): string {
    const cd = res.headers.get('Content-Disposition')
    if (cd) {
      const star = cd.match(/filename\*=UTF-8''([^;\n]+)/i)
      if (star && star[1]) {
        try {
          return decodeURIComponent(star[1].trim())
        } catch (_e) {}
      }
      const plain = cd.match(/filename="([^"]+)"/i)
      if (plain && plain[1]) {
        return plain[1]
      }
    }
    const base = (title || 'EUMK').replace(/[\\/:*?"<>|]+/g, '_').trim() || 'EUMK'
    return `${base}.${format}`
  }

  private readErrorBody(blob: Blob | null): Promise<string> {
    if (!blob) {
      return Promise.resolve('')
    }
    return new Promise(function (resolve) {
      const r = new FileReader()
      r.onload = function () {
        resolve(String(r.result || ''))
      }
      r.onerror = function () {
        resolve('')
      }
      r.readAsText(blob)
    })
  }
}
