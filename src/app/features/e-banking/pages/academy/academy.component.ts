import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../../core/services/account.service';
import { AcademyCourse } from '../../../../core/models/bank.models';

@Component({
  selector: 'app-academy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 lg:space-y-8 animate-fade-in">
      
      <!-- Top Hero Banner -->
      <div class="rounded-2xl p-6 sm:p-8 bg-[#003432] text-white relative overflow-hidden shadow-xs">
        <div class="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div class="space-y-1.5 max-w-xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0BB4D2]/20 text-[#0BB4D2] border border-[#0BB4D2]/30">
              <span>Financial Intelligence Hub</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">VaultProvenance Financial Academy</h1>
            <p class="text-xs sm:text-sm text-slate-300">
              Master capital preservation, algorithmic liquidity, institutional grant procurement, and risk-hedged market mechanics.
            </p>
          </div>

          <div class="bg-white/10 border border-white/20 p-4 rounded-2xl flex items-center gap-3 backdrop-blur-xs">
            <div class="w-10 h-10 rounded-xl bg-[#0BB4D2]/20 text-[#0BB4D2] flex items-center justify-center text-lg font-bold">
              🎓
            </div>
            <div>
              <div class="text-[10px] uppercase font-bold text-slate-300">Accredited Content</div>
              <div class="text-sm font-extrabold text-white">4 Certified Tracks</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex flex-wrap items-center gap-2">
        @for (cat of categories; track cat) {
          <button (click)="selectCategory(cat)"
                  [ngClass]="selectedCategory() === cat ? 'bg-[#003432] text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
                  class="px-4 py-2 rounded-xl text-xs font-bold transition">
            {{ cat }}
          </button>
        }
      </div>

      <!-- Courses Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (course of filteredCourses(); track course.id) {
          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition group">
            <div>
              <div class="relative h-44 overflow-hidden bg-slate-900">
                <img [src]="course.thumbnail_url" [alt]="course.title" 
                     class="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white font-bold">
                  <span class="px-2.5 py-0.5 rounded-full bg-[#003432]/90 border border-teal-500/30 backdrop-blur-xs">
                    {{ course.category }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span>{{ course.duration_mins }}m</span>
                  </span>
                </div>
              </div>

              <div class="p-5 space-y-3">
                <div class="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <span>{{ course.modules_count }} Modules</span>
                  <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700">{{ course.level }}</span>
                </div>

                <h3 class="text-sm font-extrabold text-slate-900 leading-snug group-hover:text-[#003432] transition">
                  {{ course.title }}
                </h3>

                <p class="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {{ course.description }}
                </p>
              </div>
            </div>

            <div class="p-5 pt-0">
              <button (click)="openCourseModal(course)" 
                      class="w-full py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-1.5 shadow-xs">
                <span>▶ Start Masterclass</span>
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Course Lesson Viewer Modal -->
      @if (activeCourse()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div class="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#003432] bg-teal-50 px-2.5 py-0.5 rounded border border-teal-100">
                  {{ activeCourse()?.category }} Track
                </span>
                <h3 class="text-lg font-black text-[#003432] mt-1">{{ activeCourse()?.title }}</h3>
              </div>
              <button (click)="activeCourse.set(null)" class="text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
            </div>

            <!-- Simulated Video Frame -->
            <div class="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center text-white border border-slate-800 shadow-inner">
              <img [src]="activeCourse()?.thumbnail_url" class="absolute inset-0 w-full h-full object-cover opacity-40">
              <div class="relative z-10 text-center space-y-2">
                <div class="w-16 h-16 rounded-full bg-[#0BB4D2] text-slate-950 flex items-center justify-center mx-auto text-2xl shadow-xl pl-1 hover:scale-110 transition cursor-pointer">
                  ▶
                </div>
                <div class="text-xs font-bold text-slate-200">Interactive Curriculum Module 1 / {{ activeCourse()?.modules_count }}</div>
              </div>
            </div>

            <!-- Syllabus Modules -->
            <div class="space-y-2">
              <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Curriculum Syllabus</h4>
              <div class="divide-y divide-slate-100 text-xs text-slate-700 border border-slate-200 rounded-xl overflow-hidden">
                <div class="p-3.5 bg-slate-50/80 font-bold flex items-center justify-between">
                  <span>Module 1: Executive Overview &amp; Foundations</span>
                  <span class="text-emerald-600 font-semibold">✓ Completed</span>
                </div>
                <div class="p-3.5 flex items-center justify-between">
                  <span>Module 2: Risk-Adjusted Allocation &amp; Portfolio Symmetry</span>
                  <span class="text-slate-400 font-bold">12 mins</span>
                </div>
                <div class="p-3.5 flex items-center justify-between">
                  <span>Module 3: Fiduciary Governance &amp; Regulatory Protocols</span>
                  <span class="text-slate-400 font-bold">18 mins</span>
                </div>
                <div class="p-3.5 flex items-center justify-between">
                  <span>Module 4: Case Studies in High-Yield Liquidity</span>
                  <span class="text-slate-400 font-bold">15 mins</span>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button (click)="activeCourse.set(null)" 
                      class="bg-[#003432] hover:bg-[#002625] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs transition">
                Close Lesson
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class AcademyComponent implements OnInit {
  private accountService = inject(AccountService);

  courses = signal<AcademyCourse[]>([]);
  activeCourse = signal<AcademyCourse | null>(null);
  selectedCategory = signal<string>('All Tracks');

  categories = ['All Tracks', 'Wealth Management', 'Trading & Markets', 'Grants & Capital', 'Treasury & Forex'];

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.accountService.listAcademyCourses().subscribe({
      next: (res) => {
        if (res.success) this.courses.set(res.data);
      }
    });
  }

  selectCategory(cat: string) {
    this.selectedCategory.set(cat);
  }

  filteredCourses(): AcademyCourse[] {
    const cat = this.selectedCategory();
    if (cat === 'All Tracks') return this.courses();
    return this.courses().filter(c => c.category === cat);
  }

  openCourseModal(c: AcademyCourse) {
    this.activeCourse.set(c);
  }
}
