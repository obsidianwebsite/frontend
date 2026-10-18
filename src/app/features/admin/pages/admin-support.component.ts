import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupportService, SupportTicket, SupportMessage } from '../../../core/services/support.service';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-admin-support',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto font-sans antialiased">
      
      <!-- Top Title & Stats Banner -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-teal-100 text-[#003432] text-[10px] font-black uppercase tracking-wider">
              Central Operations Desk
            </span>
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-xs text-slate-500 font-semibold">Live Ticket Dispatcher</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#003432] tracking-tight mt-1">
            Customer Inquiries &amp; Dispute Management
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">
            Real-time correspondence desk. Respond to user inquiries, investigate disputed wires, and update case statuses.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a routerLink="/admin/users"
             class="bg-[#003432] hover:bg-[#002625] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-2 border border-teal-600/30">
            <span>✉️</span>
            <span>Compose Client Email</span>
          </a>
          <button (click)="loadTickets()" 
                  class="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-2">
            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      <!-- Quick Metrics Ribbon -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Inquiries</span>
          <div class="text-xl sm:text-2xl font-black text-[#003432] font-tabular mt-1">{{ tickets().length }}</div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending / Open</span>
          <div class="text-xl sm:text-2xl font-black text-rose-600 font-tabular mt-1">
            {{ countByStatus('OPEN') }}
          </div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">In Progress</span>
          <div class="text-xl sm:text-2xl font-black text-blue-600 font-tabular mt-1">
            {{ countByStatus('IN_PROGRESS') }}
          </div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resolved Cases</span>
          <div class="text-xl sm:text-2xl font-black text-emerald-600 font-tabular mt-1">
            {{ countByStatus('RESOLVED') + countByStatus('CLOSED') }}
          </div>
        </div>
      </div>

      <!-- Filter Ribbon & Search Bar -->
      <div class="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <!-- Status Filter Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button (click)="filterStatus.set('ALL'); loadTickets()"
                  [ngClass]="filterStatus() === 'ALL' ? 'bg-[#003432] text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0">
            All Tickets ({{ tickets().length }})
          </button>
          <button (click)="filterStatus.set('OPEN'); loadTickets()"
                  [ngClass]="filterStatus() === 'OPEN' ? 'bg-rose-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0">
            Open
          </button>
          <button (click)="filterStatus.set('IN_PROGRESS'); loadTickets()"
                  [ngClass]="filterStatus() === 'IN_PROGRESS' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0">
            In Progress
          </button>
          <button (click)="filterStatus.set('AWAITING_USER'); loadTickets()"
                  [ngClass]="filterStatus() === 'AWAITING_USER' ? 'bg-amber-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0">
            Awaiting Client
          </button>
          <button (click)="filterStatus.set('RESOLVED'); loadTickets()"
                  [ngClass]="filterStatus() === 'RESOLVED' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0">
            Resolved
          </button>
        </div>

        <!-- Search Input -->
        <div class="relative w-full md:w-72">
          <input type="text" 
                 [(ngModel)]="searchQuery" 
                 (keyup.enter)="loadTickets()"
                 placeholder="Search ticket #, user, subject..."
                 class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BB4D2]/40" />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
      </div>

      <!-- Main Split Workspace Canvas -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Left Panel: Ticket Queue List (5 Columns) -->
        <div class="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-[700px]">
          
          <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 class="font-bold text-xs uppercase tracking-wider text-slate-700">Dispatch Queue</h3>
              <span class="text-[11px] text-slate-400">{{ filteredTickets().length }} matching tickets</span>
            </div>
            <span class="text-[10px] text-slate-400 font-medium">Sorted by activity</span>
          </div>

          <!-- Ticket Scrollable List -->
          <div class="flex-1 overflow-y-auto divide-y divide-slate-100">
            @if (loading()) {
              <div class="p-12 text-center text-xs text-slate-400 space-y-2">
                <div class="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div>Fetching tickets from database...</div>
              </div>
            } @else if (filteredTickets().length === 0) {
              <div class="p-12 text-center space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl mx-auto">
                  📭
                </div>
                <div class="font-bold text-xs text-slate-800">No support tickets found</div>
                <p class="text-[11px] text-slate-500 max-w-xs mx-auto">
                  No cases match the selected status or filter parameters.
                </p>
              </div>
            } @else {
              @for (t of filteredTickets(); track t.id) {
                <div (click)="selectTicket(t)"
                     [ngClass]="selectedTicket()?.id === t.id ? 'bg-teal-50/70 border-l-4 border-l-[#003432]' : 'hover:bg-slate-50'"
                     class="p-4 cursor-pointer transition flex flex-col gap-1.5 relative group">
                  
                  <!-- Top Row: Ticket Number, Badges, Time -->
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-1.5">
                      <span class="font-mono text-[11px] font-bold text-slate-800">{{ t.ticket_number }}</span>
                      
                      <!-- Priority Pill -->
                      <span [ngClass]="{
                        'bg-rose-100 text-rose-700 border-rose-200': t.priority === 'URGENT',
                        'bg-orange-100 text-orange-700 border-orange-200': t.priority === 'HIGH',
                        'bg-blue-100 text-blue-700 border-blue-200': t.priority === 'MEDIUM',
                        'bg-slate-100 text-slate-700 border-slate-200': t.priority === 'LOW'
                      }" class="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border">
                        {{ t.priority }}
                      </span>
                    </div>

                    <span class="text-[10px] text-slate-400">
                      {{ t.updated_at | date:'MMM d, HH:mm' }}
                    </span>
                  </div>

                  <!-- Client Name & Account Details -->
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-[#003432] truncate">
                      {{ t.customer_name || 'Customer' }}
                    </span>
                    <span class="text-[10px] font-mono text-slate-500">
                      {{ t.customer_account_number || '' }}
                    </span>
                  </div>

                  <!-- Subject Line -->
                  <div class="text-xs font-semibold text-slate-800 line-clamp-1">
                    {{ t.subject }}
                  </div>

                  <!-- Latest Message Snippet -->
                  <div class="text-[11px] text-slate-500 line-clamp-1 italic">
                    "{{ t.latest_message || 'No messages yet' }}"
                  </div>

                  <!-- Bottom Meta: Status & Department -->
                  <div class="flex items-center justify-between pt-1">
                    <span class="text-[10px] text-slate-400 font-medium">
                      {{ t.department }}
                    </span>

                    <div class="flex items-center gap-2">
                      @if (t.unread_user_messages && t.unread_user_messages > 0) {
                        <span class="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold animate-pulse">
                          {{ t.unread_user_messages }} new
                        </span>
                      }
                      <span [ngClass]="{
                        'bg-rose-50 text-rose-700 border-rose-200': t.status === 'OPEN',
                        'bg-blue-50 text-blue-700 border-blue-200': t.status === 'IN_PROGRESS',
                        'bg-amber-50 text-amber-700 border-amber-200': t.status === 'AWAITING_USER',
                        'bg-emerald-50 text-emerald-700 border-emerald-200': t.status === 'RESOLVED',
                        'bg-slate-100 text-slate-600 border-slate-200': t.status === 'CLOSED'
                      }" class="px-2 py-0.5 rounded-full text-[10px] font-bold border">
                        {{ formatStatus(t.status) }}
                      </span>
                    </div>
                  </div>

                </div>
              }
            }
          </div>

        </div>

        <!-- Right Panel: Conversation Transcript & Response Desk (7 Columns) -->
        <div class="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-[700px]">
          
          @if (!selectedTicket()) {
            <!-- Empty Placeholder -->
            <div class="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
              <div class="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center text-2xl shadow-inner">
                ⚖️
              </div>
              <h3 class="font-bold text-sm text-slate-700">No Ticket Selected</h3>
              <p class="text-xs text-slate-500 max-w-sm">
                Choose a ticket from the left dispatch queue to inspect the customer inquiry, verify their banking profile, and send administrative replies.
              </p>
            </div>
          } @else {
            
            <!-- Ticket Top Header -->
            <div class="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 shrink-0">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-mono text-xs font-black text-slate-800">{{ selectedTicket()?.ticket_number }}</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-[#003432]">
                      {{ selectedTicket()?.department }}
                    </span>
                    <span [ngClass]="{
                      'bg-rose-100 text-rose-800 border-rose-300': selectedTicket()?.priority === 'URGENT',
                      'bg-orange-100 text-orange-800 border-orange-300': selectedTicket()?.priority === 'HIGH',
                      'bg-blue-100 text-blue-800 border-blue-300': selectedTicket()?.priority === 'MEDIUM',
                      'bg-slate-100 text-slate-800 border-slate-300': selectedTicket()?.priority === 'LOW'
                    }" class="px-2 py-0.5 rounded-full text-[10px] font-black border uppercase">
                      {{ selectedTicket()?.priority }}
                    </span>
                  </div>
                  <h2 class="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug">
                    {{ selectedTicket()?.subject }}
                  </h2>
                </div>

                <!-- Status Modifier Dropdown -->
                <div class="flex items-center gap-2">
                  <label class="text-[11px] font-bold text-slate-500">Status:</label>
                  <select [ngModel]="selectedTicket()?.status" 
                          (ngModelChange)="changeTicketStatus($event)"
                          [disabled]="statusUpdating()"
                          class="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0BB4D2]">
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="AWAITING_USER">AWAITING CLIENT</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <!-- Customer Profile Strip -->
              <div class="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div class="bg-white p-2 rounded-xl border border-slate-200">
                  <span class="text-slate-400 block text-[9px] uppercase font-bold">Client</span>
                  <span class="font-bold text-[#003432] truncate block">{{ selectedTicket()?.customer_name || 'N/A' }}</span>
                </div>
                <div class="bg-white p-2 rounded-xl border border-slate-200">
                  <span class="text-slate-400 block text-[9px] uppercase font-bold">Account #</span>
                  <span class="font-mono font-bold text-slate-700 truncate block">{{ selectedTicket()?.customer_account_number || 'N/A' }}</span>
                </div>
                <div class="bg-white p-2 rounded-xl border border-slate-200">
                  <span class="text-slate-400 block text-[9px] uppercase font-bold">Ledger Balance</span>
                  <span class="font-bold text-emerald-700 truncate block">
                    <span>$</span>{{ (selectedTicket()?.customer_balance || 0) | number:'1.2-2' }}
                  </span>
                </div>
                <div class="bg-white p-2 rounded-xl border border-slate-200">
                  <span class="text-slate-400 block text-[9px] uppercase font-bold">KYC Status</span>
                  <span class="font-bold text-blue-700 truncate block">{{ selectedTicket()?.customer_kyc_status || 'VERIFIED' }}</span>
                </div>
              </div>
            </div>

            <!-- Threaded Messages Scroll Body -->
            <div #messagesContainer class="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/30">
              @if (loadingMessages()) {
                <div class="p-8 text-center text-xs text-slate-400">Loading case messages...</div>
              } @else if (messages().length === 0) {
                <div class="p-8 text-center text-xs text-slate-400">No messages in this case yet.</div>
              } @else {
                @for (m of messages(); track m.id) {
                  <!-- Admin Message (Sent by Admin) -->
                  @if (m.sender_role === 'ADMIN') {
                    <div class="flex flex-col items-end">
                      <div class="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                        <span class="px-1.5 py-0.2 rounded bg-teal-100 text-[#003432] font-black uppercase text-[9px]">
                          Admin Officer (You)
                        </span>
                        <span>{{ m.created_at | date:'MMM d, HH:mm' }}</span>
                      </div>
                      <div class="bg-[#003432] text-white p-3.5 sm:p-4 rounded-2xl rounded-tr-xs max-w-lg shadow-xs text-xs sm:text-[13px] leading-relaxed whitespace-pre-line">
                        {{ m.message }}
                      </div>
                    </div>
                  } 
                  <!-- Chatbot / Bot Message -->
                  @else if (m.sender_role === 'BOT') {
                    <div class="flex flex-col items-start">
                      <div class="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                        <span class="px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800 font-black uppercase text-[9px]">
                          VaultBot AI
                        </span>
                        <span>{{ m.created_at | date:'MMM d, HH:mm' }}</span>
                      </div>
                      <div class="bg-cyan-50/70 text-slate-800 border border-cyan-200 p-3 sm:p-3.5 rounded-2xl rounded-tl-xs max-w-lg text-xs leading-relaxed">
                        {{ m.message }}
                      </div>
                    </div>
                  } 
                  <!-- Customer Message -->
                  @else {
                    <div class="flex flex-col items-start">
                      <div class="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                        <span class="font-bold text-[#003432]">{{ m.sender_name || 'Customer' }}</span>
                        <span>{{ m.created_at | date:'MMM d, HH:mm' }}</span>
                      </div>
                      <div class="bg-white border border-slate-200 text-slate-800 p-3.5 sm:p-4 rounded-2xl rounded-tl-xs max-w-lg shadow-2xs text-xs sm:text-[13px] leading-relaxed whitespace-pre-line">
                        {{ m.message }}
                      </div>
                    </div>
                  }
                }
              }
            </div>

            <!-- Admin Reply & Action Box -->
            <div class="p-4 border-t border-slate-200 bg-white shrink-0 space-y-3">
              
              <!-- Canned Fast Responses Ribbon -->
              <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <span class="text-[10px] text-slate-400 uppercase font-bold shrink-0">Canned:</span>
                <button (click)="insertCanned('We have investigated your transaction and credited your balance accordingly. Please refresh your dashboard.')"
                        class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap text-[11px] transition">
                  ✓ Credit Applied
                </button>
                <button (click)="insertCanned('Your wire transfer has been processed successfully. Wire tracking reference has been attached.')"
                        class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap text-[11px] transition">
                  ✓ Wire Processed
                </button>
                <button (click)="insertCanned('Please provide a government-issued photo ID or utility bill to lift security restrictions on your account.')"
                        class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap text-[11px] transition">
                  📄 Request KYC
                </button>
                <button (click)="insertCanned('Your card security lock has been removed. You may now continue using your virtual card.')"
                        class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap text-[11px] transition">
                  💳 Card Unfrozen
                </button>
              </div>

              <!-- Reply Text Input -->
              <div class="relative">
                <textarea [(ngModel)]="replyMessage"
                          rows="3"
                          placeholder="Type your official administrative response to the customer..."
                          class="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs sm:text-[13px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003432] resize-none"></textarea>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                  <button (click)="sendReply('RESOLVED')"
                          [disabled]="sendingReply() || !replyMessage.trim()"
                          class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5">
                    <span>Send &amp; Resolve</span>
                  </button>
                </div>

                <button (click)="sendReply('IN_PROGRESS')"
                        [disabled]="sendingReply() || !replyMessage.trim()"
                        class="px-6 py-2 rounded-xl bg-[#003432] hover:bg-[#002625] disabled:opacity-50 text-white text-xs font-bold transition shadow-xs flex items-center gap-2">
                  @if (sendingReply()) {
                    <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Dispatching...</span>
                  } @else {
                    <span>Send Reply &rarr;</span>
                  }
                </button>
              </div>

            </div>

          }

        </div>

      </div>

    </div>
  `
})
export class AdminSupportComponent implements OnInit {
  private supportService = inject(SupportService);
  private modalService = inject(ModalService);

  tickets = signal<SupportTicket[]>([]);
  filteredTickets = signal<SupportTicket[]>([]);
  selectedTicket = signal<SupportTicket | null>(null);
  messages = signal<SupportMessage[]>([]);

  loading = signal<boolean>(false);
  loadingMessages = signal<boolean>(false);
  sendingReply = signal<boolean>(false);
  statusUpdating = signal<boolean>(false);

  filterStatus = signal<string>('ALL');
  searchQuery: string = '';
  replyMessage: string = '';

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading.set(true);
    const statusParam = this.filterStatus() === 'ALL' ? undefined : this.filterStatus();
    const searchParam = this.searchQuery.trim() || undefined;

    this.supportService.listAdminTickets(statusParam, searchParam).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.tickets.set(res.data);
          this.filteredTickets.set(res.data);
          // If already selected a ticket, refresh it
          const current = this.selectedTicket();
          if (current) {
            const found = res.data.find(t => t.id === current.id);
            if (found) {
              this.selectedTicket.set(found);
            }
          }
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.modalService.alert({
          title: 'Error Loading Tickets',
          message: err?.error?.message || 'Could not fetch support queue.',
          type: 'danger'
        });
      }
    });
  }

  selectTicket(t: SupportTicket): void {
    this.selectedTicket.set(t);
    this.loadMessages(t.id);
  }

  loadMessages(ticketId: string): void {
    this.loadingMessages.set(true);
    this.supportService.getAdminTicketDetails(ticketId).subscribe({
      next: (res) => {
        this.loadingMessages.set(false);
        if (res.success) {
          this.selectedTicket.set(res.data.ticket);
          this.messages.set(res.data.messages);
        }
      },
      error: () => {
        this.loadingMessages.set(false);
      }
    });
  }

  insertCanned(text: string): void {
    this.replyMessage = text;
  }

  sendReply(targetStatus: string = 'IN_PROGRESS'): void {
    const t = this.selectedTicket();
    const msg = this.replyMessage.trim();
    if (!t || !msg) return;

    this.sendingReply.set(true);
    this.supportService.replyAdminTicket(t.id, msg, targetStatus).subscribe({
      next: (res) => {
        this.sendingReply.set(false);
        if (res.success) {
          this.replyMessage = '';
          this.loadMessages(t.id);
          this.loadTickets();
        }
      },
      error: (err) => {
        this.sendingReply.set(false);
        this.modalService.alert({
          title: 'Dispatch Failed',
          message: err?.error?.message || 'Failed to send admin reply.',
          type: 'danger'
        });
      }
    });
  }

  changeTicketStatus(newStatus: string): void {
    const t = this.selectedTicket();
    if (!t || t.status === newStatus) return;

    this.statusUpdating.set(true);
    this.supportService.updateAdminTicketStatus(t.id, newStatus).subscribe({
      next: (res) => {
        this.statusUpdating.set(false);
        if (res.success) {
          t.status = newStatus as any;
          this.selectedTicket.set({ ...t });
          this.loadTickets();
        }
      },
      error: (err) => {
        this.statusUpdating.set(false);
        this.modalService.alert({
          title: 'Update Failed',
          message: err?.error?.message || 'Could not update ticket status.',
          type: 'danger'
        });
      }
    });
  }

  countByStatus(st: string): number {
    return this.tickets().filter(t => t.status === st).length;
  }

  formatStatus(st: string): string {
    switch (st) {
      case 'OPEN': return 'Open';
      case 'IN_PROGRESS': return 'In Progress';
      case 'AWAITING_USER': return 'Awaiting Client';
      case 'RESOLVED': return 'Resolved';
      case 'CLOSED': return 'Closed';
      default: return st;
    }
  }
}
