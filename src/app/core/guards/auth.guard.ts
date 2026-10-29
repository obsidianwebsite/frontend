import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getToken()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.getToken()) {
    router.navigate(['/admin/login']);
    return false;
  }

  if (authService.currentUser() && !authService.isAdmin()) {
    router.navigate(['/admin/login']);
    return false;
  }

  return true;
};

export const pinStageGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.preAuthData()?.token || sessionStorage.getItem('otb_preauth_token')) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
