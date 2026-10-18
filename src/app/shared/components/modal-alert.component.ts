import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../core/services/modal.service';

@Component({
  selector: 'app-modal-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (modal(); as m) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-2xl shadow-elevated border border-slate-200/80 max-w-md w-full p-6 text-center transform transition-all duration-300 scale-100 animate-scale-up">
          
          <!-- Icon Circle -->
          <div class="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full border-4"
               [ngClass]="{
                 'bg-emerald-50 border-emerald-100 text-emerald-600': m.type === 'success',
                 'bg-amber-50 border-amber-100 text-amber-500': m.type === 'warning',
                 'bg-red-50 border-red-100 text-red-500': m.type === 'error',
                 'bg-cyan-50 border-cyan-100 text-cyan-600': m.type === 'info'
               }">
            
            @if (m.type === 'success') {
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
              </svg>
            } @else if (m.type === 'warning') {
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            } @else if (m.type === 'error') {
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            } @else {
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            }
          </div>

          <!-- Title -->
          <h3 class="text-xl font-bold text-[#003432] mb-2">
            {{ m.title }}
          </h3>

          <!-- Message -->
          <p class="text-sm text-slate-600 mb-6 leading-relaxed">
            {{ m.message }}
          </p>

          <!-- Action Buttons -->
          <div class="flex items-center justify-center gap-3">
            @if (m.isConfirm) {
              <button (click)="onCancel()"
                      class="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition">
                {{ m.cancelText || 'Cancel' }}
              </button>
            }
            <button (click)="onConfirm()"
                    class="px-6 py-2.5 rounded-lg font-semibold text-white transition shadow-md"
                    [ngClass]="{
                      'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20': m.type === 'success',
                      'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20': m.type === 'warning',
                      'bg-red-600 hover:bg-red-700 shadow-red-500/20': m.type === 'error',
                      'btn-gradient-mountain': m.type === 'info'
                    }">
              {{ m.confirmText || 'OK' }}
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class ModalAlertComponent {
  private modalService = inject(ModalService);
  modal = this.modalService.activeModal;

  onConfirm(): void {
    const m = this.modal();
    if (m?.onConfirm) {
      m.onConfirm();
    } else {
      this.modalService.close();
    }
  }

  onCancel(): void {
    const m = this.modal();
    if (m?.onCancel) {
      m.onCancel();
    } else {
      this.modalService.close();
    }
  }
}
