import {Injectable} from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authReq = req.clone({
      headers: req.headers.set('Cookie', '__RequestVerificationToken=cqOmgkzLEU3_1R3OMUEndKtHrj6RaleiZ0WKh-w-bT7Ev9Wq3NZJQyfeshrTmMuybRzn4R97iggiIWmdVUWcXMyWSej1rb9rThthDJU2tf41; LMPlatform=07A6B2855C361BFEC4648CD41FC6F366C07DD73C0AC57B10227477B139F2FDD199F1AADFA0C032543DB013B2E1775D5364DD43383109747B8E94EC1E776597AF4F02CACB667CD9911302D9D097B37598EB72E43CDD1833D25EAF8C1DEED11E64')
    });

    return next.handle(authReq).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) console.log('Server response')
        },
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status == 401) console.log('Unauthorized')
          }
        }
      )
    )
  }
}
