import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportService } from '../../../core/services/domain.services';
import { ModalService } from '../../../core/services/modal.service';
import { SystemSettingsService } from '../../../core/services/system-settings.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <!-- Header Banner with Photography -->
      <section class="relative bg-[#003432] text-white py-16 px-4 sm:px-8 border-b border-[#002625] overflow-hidden">
        <div class="absolute inset-0 z-0 opacity-15 bg-cover bg-center"
             style="background-image: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80');">
        </div>
        <div class="relative z-10 max-w-4xl mx-auto text-center space-y-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0BB4D2]/20 text-[#0BB4D2] border border-[#0BB4D2]/40 backdrop-blur-sm">
            <span>💬</span>
            <span>Customer Support</span>
          </span>
          <h1 class="text-3xl sm:text-5xl font-black tracking-tight">Get in Touch</h1>
          <p class="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-normal">
            Have questions about your account, loans, or transfers? Our banking advisors are here to help you anytime.
          </p>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          <!-- Office Details & Support Channels -->
          <div class="lg:col-span-5 space-y-8">
            <div>
              <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">We're here for you</h2>
              <p class="text-sm text-slate-600 leading-relaxed">
                Whether you prefer phone, email, or meeting in person at our banking suites, our customer support team is ready to assist.
              </p>
            </div>

            <div class="space-y-4">
              <!-- Location Card -->
              <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#003432] shrink-0 mt-0.5">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div class="space-y-1">
                  <strong class="text-[#003432] block text-sm font-bold">{{ systemSettings.siteName() }} Headquarters</strong>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    {{ systemSettings.address() }}
                  </p>
                </div>
              </div>

              <!-- Phone Card -->
              <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0BB4D2] shrink-0 mt-0.5">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <div class="space-y-1">
                  <strong class="text-[#003432] block text-sm font-bold">Phone Support</strong>
                  <p class="text-xs text-slate-600">{{ systemSettings.phoneNumber() }}</p>
                  <span class="text-[11px] text-slate-400 block">Available 24 hours a day, 7 days a week</span>
                </div>
              </div>

              <!-- Email Card -->
              <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#003432] shrink-0 mt-0.5">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div class="space-y-1">
                  <strong class="text-[#003432] block text-sm font-bold">Email Inquiries</strong>
                  <p class="text-xs text-slate-600">{{ systemSettings.contactEmail() }}</p>
                  <span class="text-[11px] text-slate-400 block">Official customer desk response channel</span>
                </div>
              </div>
            </div>

            <!-- Operating Hours Box -->
            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h4 class="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2.5">Banking Hours</h4>
              <div class="space-y-1.5 text-xs text-slate-600">
                <div class="flex justify-between"><span>Monday &ndash; Friday:</span><strong class="text-slate-900">8:00 AM &ndash; 6:00 PM GMT</strong></div>
                <div class="flex justify-between"><span>Saturday:</span><strong class="text-slate-900">9:00 AM &ndash; 1:00 PM GMT</strong></div>
                <div class="flex justify-between"><span>Online &amp; Mobile Banking:</span><span class="text-emerald-700 font-bold">Available 24/7</span></div>
              </div>
            </div>
          </div>

          <!-- Contact Form Interface -->
          <div class="lg:col-span-7">
            <div class="obsidian-card p-6 sm:p-10 bg-white border border-slate-200/90 shadow-xl rounded-3xl">
              <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1">Send Us a Message</h3>
              <p class="text-xs sm:text-sm text-slate-500 mb-6">Fill out the quick form below and our team will get right back to you.</p>

              <form (ngSubmit)="submitForm()" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Your Name *</label>
                    <input type="text" [(ngModel)]="form.name" name="name" required
                           class="floating-input" placeholder="e.g. Alex Morgan">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Email Address *</label>
                    <input type="email" [(ngModel)]="form.email" name="email" required
                           class="floating-input" placeholder="alex@example.com">
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Phone Number</label>
                    <input type="text" [(ngModel)]="form.phone" name="phone"
                           class="floating-input" placeholder="+44 20 7000 0000">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Subject *</label>
                    <select [(ngModel)]="form.subject" name="subject" required class="floating-input">
                      <option value="Personal Checking Account">Personal Checking Account</option>
                      <option value="Car Loan or Mortgage">Car Loan or Mortgage</option>
                      <option value="High-Yield Savings &amp; Deposits">High-Yield Savings &amp; Deposits</option>
                      <option value="Online Banking Support">Online Banking Support</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Your Message *</label>
                  <textarea rows="5" [(ngModel)]="form.message" name="message" required
                            class="floating-input resize-none" 
                            placeholder="Tell us what you need help with..."></textarea>
                </div>

                <button type="submit" [disabled]="isSubmitting"
                        class="btn-gradient-mountain w-full py-3.5 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2">
                  @if (isSubmitting) {
                    <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending message...</span>
                  } @else {
                    <span>Send Message</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  }
                </button>
              </form>

            </div>
          </div>

        </div>
      </section>
    </div>
  `
})
export class ContactComponent {
  systemSettings = inject(SystemSettingsService);
  private supportService = inject(SupportService);
  private modalService = inject(ModalService);

  isSubmitting = false;
  form = {
    name: '',
    email: '',
    phone: '',
    subject: 'Personal Checking Account',
    message: ''
  };

  submitForm(): void {
    if (!this.form.name || !this.form.email || !this.form.message) {
      this.modalService.alert({
        title: 'Missing Information',
        message: 'Please fill in your name, email, and message.',
        type: 'warning'
      });
      return;
    }

    this.isSubmitting = true;
    this.supportService.submitContact(this.form).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.modalService.alert({
          title: 'Message Sent',
          message: 'Thank you for reaching out! We have received your message and our support team will get back to you shortly.',
          type: 'success'
        });
        this.form = {
          name: '',
          email: '',
          phone: '',
          subject: 'Personal Checking Account',
          message: ''
        };
      },
      error: (err) => {
        this.isSubmitting = false;
        this.modalService.alert({
          title: 'Unable to Send Message',
          message: `Something went wrong while sending your message. Please try again or call us at ${this.systemSettings.phoneNumber()}.`,
          type: 'danger'
        });
      }
    });
  }
}
