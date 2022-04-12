import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, concatMap, Observable, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { Token } from '../models/Token';
import { AuthService } from './auth.service';

const AUTHORIZATION = 'Authorization';
const BEARER = 'Bearer ';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Si no es una ruta protegida, simplemente pasamos
    if (!this.tokenService.isLogged()) return next.handle(req);

    let intReq = req;
    const token = this.tokenService.getToken();

    intReq = this.addToken(req, token!);

    return next.handle(intReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // El token anterior ha caducado
        if (error.status === 401) {
          const token: Token = { token: this.tokenService.getToken()! };
          return this.authService.refreshToken(token).pipe(
            concatMap((data: any) => {
              console.log('Refreshing token');
              this.tokenService.setToken(data.token);
              intReq = this.addToken(req, data.token);
              return next.handle(intReq);
            })
          );
        }
        // En caso contrario, un error inesperado ocurre, desconectamos la sesión
        else {
          this.tokenService.logOut();
        }
        return throwError(error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set(AUTHORIZATION, BEARER + token),
    });
  }
}

export const interceptorProvider = [
  { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
];
