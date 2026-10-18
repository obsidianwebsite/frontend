import { Injectable, signal } from '@angular/core';

export interface ModalConfig {
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  confirmText?: string;
  cancelText?: string;
  isConfirm?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export type ModalType = 'success' | 'warning' | 'error' | 'info' | 'danger';

export interface ConfirmConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ModalType;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  activeModal = signal<ModalConfig | null>(null);

  // Flexible alert supporting both object config and positional params
  alert(
    titleOrConfig: string | { title: string; message: string; type?: ModalType; confirmText?: string },
    message?: string,
    type: ModalType = 'info'
  ): Promise<void> & { subscribe: (fn?: () => void) => void } {
    let title = '';
    let msg = '';
    let alertType: 'success' | 'warning' | 'error' | 'info' = 'info';
    let confirmText = 'OK';

    if (typeof titleOrConfig === 'object' && titleOrConfig !== null) {
      title = titleOrConfig.title;
      msg = titleOrConfig.message;
      const rawType = titleOrConfig.type || 'info';
      alertType = rawType === 'danger' ? 'error' : rawType;
      confirmText = titleOrConfig.confirmText || 'OK';
    } else {
      title = titleOrConfig;
      msg = message || '';
      alertType = type === 'danger' ? 'error' : (type as any);
    }

    const p = new Promise<void>((resolve) => {
      this.activeModal.set({
        title,
        message: msg,
        type: alertType,
        confirmText,
        isConfirm: false,
        onConfirm: () => {
          this.close();
          resolve();
        }
      });
    });

    (p as any).subscribe = (fn?: () => void) => {
      p.then(() => { if (fn) fn(); });
    };

    return p as any;
  }

  // Replicates SweetAlert confirm dialog supporting positional params or object config, with .then() or .subscribe()
  confirm(
    titleOrConfig: string | ConfirmConfig,
    message?: string,
    confirmText = 'Yes, Proceed',
    cancelText = 'Cancel'
  ): Promise<boolean> & { subscribe: (fn: (confirmed: boolean) => void) => void } {
    let title = '';
    let msg = '';
    let cText = confirmText;
    let cnclText = cancelText;
    let modalType: 'success' | 'warning' | 'error' | 'info' = 'warning';

    if (typeof titleOrConfig === 'object' && titleOrConfig !== null) {
      title = titleOrConfig.title;
      msg = titleOrConfig.message;
      cText = titleOrConfig.confirmText || 'Yes, Proceed';
      cnclText = titleOrConfig.cancelText || 'Cancel';
      const rawType = titleOrConfig.type || 'warning';
      modalType = rawType === 'danger' ? 'error' : (rawType as any);
    } else {
      title = titleOrConfig;
      msg = message || '';
    }

    const p = new Promise<boolean>((resolve) => {
      this.activeModal.set({
        title,
        message: msg,
        type: modalType,
        confirmText: cText,
        cancelText: cnclText,
        isConfirm: true,
        onConfirm: () => {
          this.close();
          resolve(true);
        },
        onCancel: () => {
          this.close();
          resolve(false);
        }
      });
    });

    (p as any).subscribe = (fn: (confirmed: boolean) => void) => {
      p.then(fn);
    };

    return p as any;
  }

  close(): void {
    this.activeModal.set(null);
  }
}
