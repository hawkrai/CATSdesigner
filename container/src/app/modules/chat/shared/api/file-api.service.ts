import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class FileApiService {
  private readonly baseUrl = 'catService/file'

  constructor(private http: HttpClient) {}

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/UploadFile`, formData)
  }

  downloadFile(chatId: number, filename: string): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/Download?chatId=${chatId}&file=${filename}`,
      {
        responseType: 'blob',
      }
    )
  }
}
