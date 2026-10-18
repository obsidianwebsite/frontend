import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourService } from '../../core/services/tour.service';

@Component({
  selector: 'app-tour-guide',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (tourService.isOpen() && tourService.currentStep()) {
      <!-- Non-blocking floating guide widget -->
      <div class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] font-sans animate-fade-in pointer-events-auto">
        
        <div class="bg-white rounded-2xl shadow-2xl border-2 border-[#0BB4D2]/40 overflow-hidden flex flex-col ring-8 ring-black/10">
          
          <!-- Directional Guidance Banner -->
          <div [ngClass]="{
                 'bg-amber-400 text-slate-950': tourService.currentStep()!.directionArrow === 'left',
                 'bg-[#0BB4D2] text-[#003432]': tourService.currentStep()!.directionArrow === 'down' || tourService.currentStep()!.directionArrow === 'right',
                 'bg-teal-400 text-[#003432]': tourService.currentStep()!.directionArrow === 'up'
               }"
               class="px-4 py-2.5 font-black text-xs uppercase tracking-wider flex items-center justify-between select-none">
            
            <div class="flex items-center gap-2">
              <span class="text-base inline-block animate-bounce">
                @switch (tourService.currentStep()!.directionArrow) {
                  @case ('left') { 👈 }
                  @case ('down') { 👇 }
                  @case ('right') { 👉 }
                  @case ('up') { 👆 }
                }
              </span>
              <span class="font-extrabold tracking-wide">
                {{ tourService.currentStep()!.directionBadge }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-full bg-black/20 text-[11px] font-bold">
                Step {{ tourService.currentStep()!.stepNumber }} of {{ tourService.currentStep()!.totalSteps }}
              </span>
              <button (click)="tourService.skipTour()"
                      aria-label="Close guide"
                      class="text-current opacity-70 hover:opacity-100 p-0.5 transition rounded hover:bg-black/10">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          <!-- Step Content Area -->
          <div class="p-5 space-y-3.5 bg-white text-slate-800">
            
            <!-- Title & Icon -->
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-xl shrink-0 shadow-xs">
                {{ tourService.currentStep()!.icon }}
              </div>
              <div class="flex-1">
                <h3 class="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {{ tourService.currentStep()!.title }}
                </h3>
                <span class="text-[11px] text-teal-700 font-semibold">
                  {{ tourService.currentTourType() === 'admin' ? 'Administrator Simple Guide' : 'Customer Simple Guide' }}
                </span>
              </div>
            </div>

            <!-- Plain English Easy Explanation -->
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {{ tourService.currentStep()!.description }}
            </p>

            <!-- Quick Tip Callout -->
            @if (tourService.currentStep()!.quickTip) {
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2 text-xs text-slate-600">
                <span class="text-sm shrink-0">💡</span>
                <span class="leading-relaxed">{{ tourService.currentStep()!.quickTip }}</span>
              </div>
            }

            <!-- Direct 1-Click Action Shortcut -->
            @if (tourService.currentStep()!.targetRoute) {
              <div>
                <button (click)="tourService.navigateToCurrentTarget()"
                        class="w-full py-2 px-3 rounded-xl bg-teal-50/80 hover:bg-teal-100/90 border border-teal-200/90 text-[#003432] text-xs font-bold transition flex items-center justify-between group shadow-2xs">
                  <span class="flex items-center gap-1.5">
                    <span>🧭</span>
                    <span>{{ tourService.currentStep()!.targetButtonText || 'Open This Section' }}</span>
                  </span>
                  <span class="text-xs text-teal-600 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </button>
              </div>
            }

            <!-- Progress Step Dots -->
            <div class="flex items-center justify-center gap-1.5 pt-1">
              @for (step of tourService.steps(); track step.id; let idx = $index) {
                <button (click)="tourService.goToStep(idx)"
                        [ngClass]="tourService.currentStepIndex() === idx ? 'w-5 bg-[#003432]' : 'w-2 bg-slate-200 hover:bg-slate-300'"
                        class="h-2 rounded-full transition-all duration-200"
                        [title]="'Go to step ' + (idx + 1)"></button>
              }
            </div>

          </div>

          <!-- Bottom Action Buttons -->
          <div class="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button (click)="tourService.skipTour()"
                    class="text-xs font-medium text-slate-400 hover:text-slate-700 transition">
              Close Guide
            </button>

            <div class="flex items-center gap-2">
              @if (!tourService.isFirstStep()) {
                <button (click)="tourService.prevStep()"
                        class="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition shadow-2xs">
                  &larr; Back
                </button>
              }

              <button (click)="tourService.nextStep()"
                      class="px-4 py-1.5 rounded-lg bg-[#003432] hover:bg-[#002625] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5">
                <span>{{ tourService.isLastStep() ? 'Got It! Finish 🎉' : 'Next ➔' }}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    }
  `
})
export class TourGuideComponent {
  tourService = inject(TourService);
}
