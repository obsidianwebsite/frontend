import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  let modifiedReq = req;
  if (token && req.url.startsWith('/api/')) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Auto-clear stale/expired session on 401 and redirect to appropriate login portal
      const isAuthEndpoint = req.url.includes('/auth/login') || 
                             req.url.includes('/auth/verify-pin') || 
                             req.url.includes('/auth/admin-login');

      if (error.status === 401 && !isAuthEndpoint) {
        if (authService.isAdmin()) {
          authService.adminLogout();
        } else {
          authService.logout();
        }
      }
      return throwError(() => error);
    })
  );
};
