import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportService, SupportTicket, SupportMessage } from '../../../../core/services/support.service';
import { ModalService } from '../../../../core/services/modal.service';
import { SystemSettingsService } from '../../../../core/services/system-settings.service';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto font-sans antialiased">
      
      <!-- Top Title & Action Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-teal-100 text-[#003432] text-[10px] font-black uppercase tracking-wider">
              24/7 Executive Desk
            </span>
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-xs text-slate-500 font-semibold">Live Officers Online</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#003432] tracking-tight mt-1">
            Client Support &amp; Dispute Resolution Desk
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">
            Submit prioritized support tickets, chat directly with compliance officers, or review case resolutions.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button (click)="openDirectEmailModal()"
                  class="bg-gradient-to-r from-[#003432] to-[#004d4a] hover:to-[#003432] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 border border-teal-600/30">
            <svg class="w-4 h-4 text-[#0BB4D2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span>Direct Email to Admin</span>
          </button>
          <button (click)="openNewTicketModal()"
                  class="bg-[#003432] hover:bg-[#002625] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            <span>Open Support Ticket</span>
          </button>
        </div>
      </div>

      <!-- Quick Summary Metric Pills -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Inquiries</span>
          <div class="text-xl sm:text-2xl font-black text-[#003432] font-tabular mt-1">{{ tickets().length }}</div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active / In Progress</span>
          <div class="text-xl sm:text-2xl font-black text-blue-600 font-tabular mt-1">{{ countByStatus('OPEN') + countByStatus('IN_PROGRESS') }}</div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Awaiting Your Reply</span>
          <div class="text-xl sm:text-2xl font-black text-amber-600 font-tabular mt-1">{{ countByStatus('AWAITING_USER') }}</div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resolved Cases</span>
          <div class="text-xl sm:text-2xl font-black text-emerald-600 font-tabular mt-1">{{ countByStatus('RESOLVED') + countByStatus('CLOSED') }}</div>
        </div>
      </div>

      <!-- Main Workspace Split Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Left Column: Tickets Queue List (5 Cols) -->
        <div class="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-[650px]">
          
          <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 class="font-bold text-xs uppercase tracking-wider text-slate-700">Ticket Registry</h3>
              <span class="text-[11px] text-slate-400">{{ tickets().length }} recorded cases</span>
            </div>
            <button (click)="loadTickets()" class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition" title="Refresh">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </button>
          </div>

          <!-- Ticket Items Scrollable List -->
          <div class="flex-1 overflow-y-auto divide-y divide-slate-100">
            @if (loadingTickets()) {
              <div class="p-8 text-center text-xs text-slate-400">Loading your support tickets...</div>
            } @else if (tickets().length === 0) {
              <div class="p-12 text-center space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl mx-auto">
                  💬
                </div>
                <div class="font-bold text-xs text-slate-800">No support tickets found</div>
                <p class="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Have an inquiry or dispute? Create your first ticket to connect with our administrative team.
                </p>
                <button (click)="openNewTicketModal()"
                        class="px-4 py-2 rounded-xl bg-teal-50 text-teal-800 text-xs font-bold hover:bg-teal-100 transition">
                  Create First Ticket &rarr;
                </button>
              </div>
            } @else {
              @for (t of tickets(); track t.id) {
                <div (click)="selectTicket(t)"
                     [ngClass]="selectedTicket()?.id === t.id ? 'bg-teal-50/70 border-l-4 border-l-[#003432]' : 'hover:bg-slate-50'"
                     class="p-4 cursor-pointer transition flex flex-col gap-1.5">
                  
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-mono font-bold text-slate-400">{{ t.ticket_number }}</span>
                    <span class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider"
                          [ngClass]="getStatusBadgeClass(t.status)">
                      {{ t.status.replace('_', ' ') }}
                    </span>
                  </div>

                  <h4 class="font-bold text-xs text-slate-900 line-clamp-1">
                    {{ t.subject }}
                  </h4>

                  <p class="text-[11px] text-slate-500 line-clamp-1">
                    {{ t.latest_message || 'Awaiting response...' }}
                  </p>

                  <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span class="font-semibold text-slate-600">{{ t.department.replace('_', ' ') }}</span>
                    <div class="flex items-center gap-1.5">
                      @if (t.unread_admin_replies && t.unread_admin_replies > 0) {
                        <span class="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold text-[9px]">
                          {{ t.unread_admin_replies }} new
                        </span>
                      }
                      <span>{{ t.updated_at | date:'shortTime' }}</span>
                    </div>
                  </div>

                </div>
              }
            }
          </div>

        </div>

        <!-- Right Column: Active Conversation Workspace (7 Cols) -->
        <div class="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-[650px]">
          
          @if (!selectedTicket()) {
            <div class="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div class="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-3xl text-slate-400">
                📨
              </div>
              <h3 class="font-bold text-slate-800 text-sm">Select a ticket to view conversation</h3>
              <p class="text-xs text-slate-500 max-w-sm">
                Choose a ticket from the left panel to review responses, dispatch replies, or inspect case status.
              </p>
            </div>
          } @else {
            
            <!-- Conversation Top Bar -->
            <div class="p-4 sm:p-5 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs font-bold text-[#0BB4D2]">{{ selectedTicket()?.ticket_number }}</span>
                  <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase"
                        [ngClass]="getStatusBadgeClass(selectedTicket()!.status)">
                    {{ selectedTicket()?.status?.replace('_', ' ') }}
                  </span>
                  <span class="text-[10px] text-slate-400 uppercase font-bold px-2 py-0.5 rounded bg-slate-100">
                    {{ selectedTicket()?.priority }}
                  </span>
                </div>
                <h2 class="text-sm sm:text-base font-black text-slate-900 line-clamp-1">
                  {{ selectedTicket()?.subject }}
                </h2>
              </div>

              <div class="flex items-center gap-2">
                @if (selectedTicket()?.status !== 'RESOLVED' && selectedTicket()?.status !== 'CLOSED') {
                  <button (click)="markTicketResolved()" 
                          class="px-3 py-1.5 rounded-xl border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold transition">
                    ✓ Mark Resolved
                  </button>
                }
              </div>
            </div>

            <!-- Messages Thread Area -->
            <div class="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#f8fafc]">
              @if (loadingMessages()) {
                <div class="p-8 text-center text-xs text-slate-400">Loading message thread...</div>
              } @else {
                @for (m of currentMessages(); track m.id) {
                  <div class="flex flex-col" [ngClass]="m.sender_role === 'USER' ? 'items-end' : 'items-start'">
                    
                    <!-- Sender Header -->
                    <div class="flex items-center gap-1.5 mb-1 px-1">
                      @if (m.sender_role === 'ADMIN') {
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span class="text-[10px] font-black text-[#003432] uppercase tracking-wide">
                          VaultAtlantic Support Officer
                        </span>
                      } @else {
                        <span class="text-[10px] font-bold text-slate-500">
                          You (Client)
                        </span>
                      }
                      <span class="text-[9px] text-slate-400">&bull; {{ m.created_at | date:'short' }}</span>
                    </div>

                    <!-- Message Bubble -->
                    <div class="max-w-[85%] rounded-2xl px-4 py-3 shadow-xs whitespace-pre-line text-xs leading-relaxed"
                         [ngClass]="m.sender_role === 'USER'
                           ? 'bg-[#003432] text-white rounded-br-xs'
                           : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-2xs'">
                      {{ m.message }}
                    </div>

                  </div>
                }
              }
            </div>

            <!-- Reply Box Footer -->
            <div class="p-4 bg-white border-t border-slate-100 shrink-0">
              @if (selectedTicket()?.status === 'RESOLVED' || selectedTicket()?.status === 'CLOSED') {
                <div class="p-3 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                  This case has been marked as resolved. You can reopen it at any time by sending a new message below.
                </div>
              }
              <form (ngSubmit)="submitReply()" class="flex items-end gap-2 mt-2">
                <textarea [(ngModel)]="replyMessage" name="replyMessage" rows="2" required
                          placeholder="Type your response to the support team..."
                          class="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none resize-none transition">
                </textarea>
                <button type="submit" [disabled]="!replyMessage.trim() || sendingReply()"
                        class="bg-[#003432] hover:bg-[#002625] text-white px-5 py-3 rounded-xl text-xs font-bold transition disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-xs shrink-0">
                  <span>{{ sendingReply() ? 'Sending...' : 'Send' }}</span>
                  <svg class="w-3.5 h-3.5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
                </button>
              </form>
            </div>

          }

        </div>

      </div>

      <!-- CREATE NEW TICKET MODAL -->
      @if (showNewTicketModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 animate-scale-up">
            
            <div class="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 class="font-black text-lg text-[#003432]">Open Support Ticket</h3>
                <p class="text-xs text-slate-500">Directly dispatched to the VaultAtlantic executive desk</p>
              </div>
              <button (click)="showNewTicketModal.set(false)" class="p-1.5 rounded-full text-slate-400 hover:bg-slate-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <form (ngSubmit)="submitNewTicket()" class="space-y-4">
              
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Department *</label>
                <select [(ngModel)]="newTicketForm.department" name="department" required
                        class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] outline-none">
                  <option value="GENERAL_SUPPORT">General Banking Support</option>
                  <option value="TRANSFERS">Wire &amp; SWIFT Transfers</option>
                  <option value="CARDS">Payment Cards &amp; Limits</option>
                  <option value="LOANS">Loans &amp; Mortgages</option>
                  <option value="TAX_REFUND">IRS Tax Refund Desk</option>
                  <option value="SECURITY">Security &amp; PIN Authentication</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Priority Level</label>
                <select [(ngModel)]="newTicketForm.priority" name="priority"
                        class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] outline-none">
                  <option value="LOW">Low - Routine Question</option>
                  <option value="MEDIUM">Medium - General Account Request</option>
                  <option value="HIGH">High - Transaction or Card Issue</option>
                  <option value="URGENT">Urgent - Security / Critical Wire</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Subject *</label>
                <input type="text" [(ngModel)]="newTicketForm.subject" name="subject" required
                       placeholder="e.g. Assistance with International SWIFT Wire Routing"
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] outline-none">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Message / Case Details *</label>
                <textarea [(ngModel)]="newTicketForm.message" name="message" rows="4" required
                          placeholder="Provide all relevant transaction references, dates, or questions..."
                          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#003432] outline-none resize-none">
                </textarea>
              </div>

              <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" (click)="showNewTicketModal.set(false)"
                        class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" [disabled]="isSubmittingTicket()"
                        class="bg-[#003432] hover:bg-[#002625] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2">
                  <span>{{ isSubmittingTicket() ? 'Dispatching...' : 'Submit Support Ticket' }}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      }

      <!-- DIRECT EMAIL TO ADMIN MODAL -->
      @if (showDirectEmailModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
          <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100 animate-scale-up">
            
            <div class="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full bg-teal-100 text-[#003432] text-[10px] font-black uppercase tracking-wider">
                    Resend API Gateway
                  </span>
                  <span class="text-[10px] text-emerald-600 font-bold">● Live Direct Dispatch</span>
                </div>
                <h3 class="font-black text-lg text-[#003432] mt-1">Official Email to Executive Desk</h3>
                <p class="text-xs text-slate-500">Transmitted directly to: <strong class="text-slate-800">{{ systemSettings.adminEmail() }}</strong></p>
              </div>
              <button (click)="showDirectEmailModal.set(false)" class="p-1.5 rounded-full text-slate-400 hover:bg-slate-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <!-- Recipient & Security Info Box -->
            <div class="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 text-xs space-y-1.5">
              <div class="flex justify-between items-center text-slate-700">
                <span class="font-bold text-slate-500">Destination:</span>
                <span class="font-mono font-bold text-[#003432]">{{ systemSettings.adminEmail() }}</span>
              </div>
              <div class="flex justify-between items-center text-slate-700">
                <span class="font-bold text-slate-500">Reply-To Routing:</span>
                <span class="font-medium text-slate-700">Your registered email address</span>
              </div>
              <div class="flex justify-between items-center text-slate-700">
                <span class="font-bold text-slate-500">Compliance Docket:</span>
                <span class="text-emerald-700 font-bold">Automatic ticket created in support queue</span>
              </div>
            </div>

            <form (ngSubmit)="submitDirectEmail()" class="space-y-4">
              
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Department *</label>
                  <select [(ngModel)]="directEmailForm.department" name="emailDepartment" required
                          class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] outline-none">
                    <option value="GENERAL_SUPPORT">General Banking Support</option>
                    <option value="TRANSFERS">Wire &amp; SWIFT Transfers</option>
                    <option value="CARDS">Payment Cards &amp; Limits</option>
                    <option value="LOANS">Loans &amp; Mortgages</option>
                    <option value="TAX_REFUND">IRS Tax Refund Desk</option>
                    <option value="SECURITY">Security &amp; PIN Authentication</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Priority</label>
                  <select [(ngModel)]="directEmailForm.priority" name="emailPriority"
                          class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] outline-none">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High (Urgent Attention)</option>
                    <option value="URGENT">Urgent (Immediate Wire Lock)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Subject *</label>
                <input type="text" [(ngModel)]="directEmailForm.subject" name="emailSubject" required
                       placeholder="e.g. Inward Swift Wire Verification - Ref #49204"
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] outline-none">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Message / Case Particulars *</label>
                <textarea [(ngModel)]="directEmailForm.message" name="emailMessage" rows="4" required
                          placeholder="Provide all relevant details, account references, or instructions for the administrator..."
                          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#003432] outline-none resize-none">
                </textarea>
              </div>

              <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" (click)="showDirectEmailModal.set(false)"
                        class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" [disabled]="isSubmittingEmail()"
                        class="bg-[#003432] hover:bg-[#002625] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2">
                  @if (isSubmittingEmail()) {
                    <div class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Dispatching via Resend...</span>
                  } @else {
                    <span>✉️ Dispatch Official Email</span>
                  }
                </button>
              </div>

            </form>

          </div>
        </div>
      }

    </div>
  `
})
export class SupportComponent implements OnInit {
  systemSettings = inject(SystemSettingsService);
  private supportService = inject(SupportService);
  private modalService = inject(ModalService);

  tickets = signal<SupportTicket[]>([]);
  selectedTicket = signal<SupportTicket | null>(null);
  currentMessages = signal<SupportMessage[]>([]);

  loadingTickets = signal<boolean>(false);
  loadingMessages = signal<boolean>(false);
  showNewTicketModal = signal<boolean>(false);
  showDirectEmailModal = signal<boolean>(false);
  isSubmittingTicket = signal<boolean>(false);
  isSubmittingEmail = signal<boolean>(false);
  sendingReply = signal<boolean>(false);

  replyMessage = '';

  newTicketForm = {
    subject: '',
    department: 'GENERAL_SUPPORT',
    priority: 'MEDIUM',
    message: ''
  };

  directEmailForm = {
    subject: '',
    department: 'GENERAL_SUPPORT',
    priority: 'MEDIUM',
    message: ''
  };

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loadingTickets.set(true);
    this.supportService.listUserTickets().subscribe({
      next: (res) => {
        this.loadingTickets.set(false);
        if (res.data) {
          this.tickets.set(res.data);
          if (res.data.length > 0 && !this.selectedTicket()) {
            this.selectTicket(res.data[0]);
          }
        }
      },
      error: () => {
        this.loadingTickets.set(false);
      }
    });
  }

  selectTicket(ticket: SupportTicket): void {
    this.selectedTicket.set(ticket);
    this.loadingMessages.set(true);
    this.supportService.getTicketDetails(ticket.id).subscribe({
      next: (res) => {
        this.loadingMessages.set(false);
        if (res.data) {
          this.selectedTicket.set(res.data.ticket);
          this.currentMessages.set(res.data.messages);
          // clear unread counter in local ticket item
          ticket.unread_admin_replies = 0;
        }
      },
      error: () => {
        this.loadingMessages.set(false);
      }
    });
  }

  submitReply(): void {
    const ticket = this.selectedTicket();
    if (!ticket || !this.replyMessage.trim() || this.sendingReply()) return;

    this.sendingReply.set(true);
    const content = this.replyMessage.trim();
    this.replyMessage = '';

    this.supportService.sendTicketMessage(ticket.id, content).subscribe({
      next: (res) => {
        this.sendingReply.set(false);
        if (res.data) {
          this.currentMessages.update(msgs => [...msgs, res.data]);
          ticket.status = 'OPEN';
          ticket.latest_message = content;
        }
      },
      error: (err) => {
        this.sendingReply.set(false);
        this.modalService.alert({
          title: 'Dispatch Failed',
          message: err.error?.message || 'Failed to submit response.',
          type: 'danger'
        });
      }
    });
  }

  markTicketResolved(): void {
    const ticket = this.selectedTicket();
    if (!ticket) return;

    this.modalService.confirm({
      title: 'Resolve Ticket',
      message: 'Are you satisfied with the response and wish to mark this ticket as resolved?',
      confirmText: 'Yes, Mark Resolved',
      type: 'info'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.supportService.closeTicket(ticket.id).subscribe({
          next: () => {
            ticket.status = 'RESOLVED';
            this.modalService.alert({
              title: 'Case Resolved',
              message: 'Your ticket has been marked as resolved.',
              type: 'success'
            });
          }
        });
      }
    });
  }

  openNewTicketModal(): void {
    this.newTicketForm = {
      subject: '',
      department: 'GENERAL_SUPPORT',
      priority: 'MEDIUM',
      message: ''
    };
    this.showNewTicketModal.set(true);
  }

  submitNewTicket(): void {
    if (!this.newTicketForm.subject || !this.newTicketForm.message) {
      this.modalService.alert({
        title: 'Missing Fields',
        message: 'Please provide both a subject and message description.',
        type: 'warning'
      });
      return;
    }

    this.isSubmittingTicket.set(true);
    this.supportService.createTicket(this.newTicketForm).subscribe({
      next: (res) => {
        this.isSubmittingTicket.set(false);
        this.showNewTicketModal.set(false);
        this.modalService.alert({
          title: 'Ticket Submitted',
          message: res.message || 'Your support ticket has been received.',
          type: 'success'
        });
        this.loadTickets();
      },
      error: (err) => {
        this.isSubmittingTicket.set(false);
        this.modalService.alert({
          title: 'Submission Failed',
          message: err.error?.message || 'Failed to create ticket.',
          type: 'danger'
        });
      }
    });
  }

  openDirectEmailModal(): void {
    this.directEmailForm = {
      subject: '',
      department: 'GENERAL_SUPPORT',
      priority: 'MEDIUM',
      message: ''
    };
    this.showDirectEmailModal.set(true);
  }

  submitDirectEmail(): void {
    if (!this.directEmailForm.subject || !this.directEmailForm.message) {
      this.modalService.alert({
        title: 'Missing Fields',
        message: 'Please provide both a subject and inquiry message before dispatching.',
        type: 'warning'
      });
      return;
    }

    this.isSubmittingEmail.set(true);
    this.supportService.sendSupportEmailToAdmin(this.directEmailForm).subscribe({
      next: (res) => {
        this.isSubmittingEmail.set(false);
        this.showDirectEmailModal.set(false);
        this.modalService.alert({
          title: 'Direct Support Email Dispatched',
          message: res.message || 'Your support email has been transmitted to Executive Administration.',
          type: 'success'
        });
        this.loadTickets();
      },
      error: (err) => {
        this.isSubmittingEmail.set(false);
        this.modalService.alert({
          title: 'Dispatch Failed',
          message: err.error?.message || 'Failed to dispatch email to administration.',
          type: 'danger'
        });
      }
    });
  }

  countByStatus(status: string): number {
    return this.tickets().filter(t => t.status === status).length;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'bg-emerald-100 text-emerald-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'AWAITING_USER':
        return 'bg-amber-100 text-amber-800';
      case 'RESOLVED':
      case 'CLOSED':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }
}
