import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http"
import {Observable} from "rxjs"
import {environment} from "../../environments/environment";

export class ApiInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const cloneReq = req.clone({
      url: environment.apiUrl + req.url
    })
    return next.handle(cloneReq)
  }
}
