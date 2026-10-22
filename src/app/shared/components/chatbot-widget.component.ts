import { Component, inject, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupportService, ChatbotSuggestedAction } from '../../core/services/support.service';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  suggestedActions?: ChatbotSuggestedAction[];
  canEscalate?: boolean;
}

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Floating Trigger Launcher Button -->
    <div class="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 select-none">
      
      @if (!isOpen()) {
        <button (click)="toggleOpen()"
                class="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#003432] hover:bg-[#002625] text-white shadow-xl shadow-teal-950/40 border border-[#0BB4D2]/40 transition-all duration-300 transform hover:scale-105 active:scale-95"
                aria-label="Open VaultBot Banking Chatbot">
          <!-- Modern AI Starburst & Sparkle Assistant Avatar -->
          <div class="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#0BB4D2] via-teal-300 to-cyan-200 text-[#003432] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <svg class="w-4.5 h-4.5 text-[#003432]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 2C10 6.418 6.418 10 2 10C6.418 10 10 13.582 10 18C10 13.582 13.582 10 18 10C13.582 10 10 6.418 10 2Z"/>
              <path d="M19 11C19 13.209 17.209 15 15 15C17.209 15 19 16.791 19 19C19 16.791 20.791 15 23 15C20.791 15 19 13.209 19 11Z"/>
              <path d="M19 3C19 4.105 18.105 5 17 5C18.105 5 19 5.895 19 7C19 5.895 19.895 5 21 5C19.895 5 19 4.105 19 3Z"/>
            </svg>
            <span class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#003432] animate-pulse"></span>
          </div>

          <div class="text-left hidden sm:block">
            <div class="text-xs font-black tracking-tight flex items-center gap-1.5">
              <span>VaultBot</span>
              <span class="text-[9px] px-1.5 py-0.2 rounded bg-teal-400/20 text-[#0BB4D2] font-mono font-bold uppercase">AI</span>
            </div>
            <div class="text-[10px] text-teal-200/80">Banking Assistant</div>
          </div>

          <!-- Pulsing ping ring -->
          <span class="absolute -inset-1 rounded-full border border-[#0BB4D2]/40 animate-ping opacity-30 pointer-events-none"></span>
        </button>
      }

      <!-- Floating Chat Panel Window -->
      @if (isOpen()) {
        <div class="w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-scale-up font-sans">
          
          <!-- Chat Window Header -->
          <header class="p-3.5 bg-[#003432] text-white flex items-center justify-between border-b border-[#002625] shrink-0">
            <div class="flex items-center gap-2.5">
              <div class="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0BB4D2] via-teal-300 to-cyan-200 text-[#003432] flex items-center justify-center shadow-sm">
                <svg class="w-5 h-5 text-[#003432]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 2C10 6.418 6.418 10 2 10C6.418 10 10 13.582 10 18C10 13.582 13.582 10 18 10C13.582 10 10 6.418 10 2Z"/>
                  <path d="M19 11C19 13.209 17.209 15 15 15C17.209 15 19 16.791 19 19C19 16.791 20.791 15 23 15C20.791 15 19 13.209 19 11Z"/>
                  <path d="M19 3C19 4.105 18.105 5 17 5C18.105 5 19 5.895 19 7C19 5.895 19.895 5 21 5C19.895 5 19 4.105 19 3Z"/>
                </svg>
                <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#003432]"></span>
              </div>
              <div>
                <div class="text-xs font-black tracking-tight flex items-center gap-1.5">
                  <span>VaultBot</span>
                  <span class="text-[9px] px-1.5 py-0.2 rounded bg-emerald-400/20 text-emerald-300 font-bold uppercase tracking-wider">AI Live</span>
                </div>
                <div class="text-[10px] text-teal-200/80">Obsidian Trust Bancorp Concierge &amp; Treasury AI</div>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <button (click)="resetChat()" 
                      title="Clear chat and restart conversation"
                      class="p-1.5 rounded-lg text-teal-200/70 hover:text-white hover:bg-white/10 transition text-[11px]"
                      aria-label="Restart Chat">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              </button>

              <a routerLink="/e-banking/support" (click)="toggleOpen()" 
                 title="Open Human Support Desk"
                 class="px-2 py-1 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 transition text-[11px] font-bold flex items-center gap-1">
                <span>Support</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>

              <button (click)="toggleOpen()"
                      class="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
                      aria-label="Close Chat">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </header>

          <!-- Chat Conversation Scroll Area -->
          <div #scrollContainer class="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-[#f8fafc] text-xs">
            
            <!-- Default System Notice -->
            <div class="p-2.5 rounded-2xl bg-teal-50/80 border border-teal-100/90 text-[11px] text-teal-950 leading-relaxed flex items-center gap-2">
              <span class="text-base shrink-0">🔒</span>
              <div>
                <strong class="font-bold">End-to-End Encrypted Session.</strong> Ask about balances, international SWIFT clearances, COT/IMF tokens, cards, or connect to human compliance officers.
              </div>
            </div>

            <!-- Messages Stream -->
            @for (msg of messages(); track msg.id) {
              <div class="flex flex-col" [ngClass]="msg.sender === 'user' ? 'items-end' : 'items-start'">
                
                @if (msg.sender === 'user') {
                  <!-- User Message Bubble -->
                  <div class="max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs whitespace-pre-line leading-relaxed bg-[#003432] text-white rounded-br-xs text-xs font-medium">
                    {{ msg.text }}
                  </div>
                } @else {
                  <!-- Bot Message Bubble with Rich Formatting -->
                  <div class="relative group max-w-[90%] rounded-2xl px-3.5 py-3 shadow-xs leading-relaxed bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs text-xs">
                    
                    <!-- Bot Rich Rendered Content -->
                    <div [innerHTML]="formatBotMessage(msg.text)"></div>

                    <!-- Copy Message Button -->
                    <button (click)="copyText(msg.text, msg.id)"
                            title="Copy response"
                            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-[10px]">
                      @if (copiedId() === msg.id) {
                        <span class="text-emerald-600 font-bold text-[9px]">Copied!</span>
                      } @else {
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                      }
                    </button>
                  </div>
                }

                <!-- Suggested Action Links -->
                @if (msg.suggestedActions && msg.suggestedActions.length > 0) {
                  <div class="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    @for (action of msg.suggestedActions; track action.label) {
                      <a [routerLink]="action.link" (click)="toggleOpen()"
                         class="px-2.5 py-1 rounded-lg bg-teal-100/70 hover:bg-[#0BB4D2] hover:text-white text-teal-900 font-bold text-[10px] border border-teal-200 transition flex items-center gap-1 shadow-2xs">
                        <span>{{ action.label }}</span>
                        <span>&rarr;</span>
                      </a>
                    }
                  </div>
                }

                <!-- Escalation Prompt Button -->
                @if (msg.canEscalate) {
                  <div class="mt-2">
                    <a routerLink="/e-banking/support" (click)="toggleOpen()"
                       class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] shadow-xs transition inline-flex items-center gap-1.5">
                      <span>👤 Open Priority Ticket with Human Officer</span>
                    </a>
                  </div>
                }

                <span class="text-[9px] text-slate-400 mt-1 px-1">{{ msg.time }}</span>
              </div>
            }

            <!-- Loading Indicator Bubble -->
            @if (isThinking()) {
              <div class="flex items-center gap-2 max-w-[70%] bg-white border border-slate-200/90 rounded-2xl rounded-bl-xs px-3.5 py-2.5 text-slate-500 shadow-xs">
                <span class="w-1.5 h-1.5 rounded-full bg-[#0BB4D2] animate-bounce"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-[#0BB4D2] animate-bounce [animation-delay:0.2s]"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-[#0BB4D2] animate-bounce [animation-delay:0.4s]"></span>
                <span class="text-[10px] font-semibold text-slate-400 ml-1">Analyzing institutional ledger...</span>
              </div>
            }

          </div>

          <!-- Quick Starter Prompts Tray (Always Available for Rapid Inquiries) -->
          <div class="px-3 py-2 border-t border-slate-100 bg-slate-50/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <button (click)="sendPreset('What is my account balance?')"
                    class="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-teal-50 hover:border-teal-300 text-slate-700 text-[10.5px] font-semibold transition border border-slate-200 shadow-2xs">
              💰 Balance
            </button>
            <button (click)="sendPreset('What is my COT code and what does it mean?')"
                    class="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-teal-50 hover:border-teal-300 text-slate-700 text-[10.5px] font-semibold transition border border-slate-200 shadow-2xs">
              🔐 COT Code
            </button>
            <button (click)="sendPreset('What is the SWIFT and routing code?')"
                    class="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-teal-50 hover:border-teal-300 text-slate-700 text-[10.5px] font-semibold transition border border-slate-200 shadow-2xs">
              🌐 SWIFT &amp; Wire Info
            </button>
            <button (click)="sendPreset('How long does an international SWIFT wire take and what is the fee?')"
                    class="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-teal-50 hover:border-teal-300 text-slate-700 text-[10.5px] font-semibold transition border border-slate-200 shadow-2xs">
              ⚡ Wire Fees &amp; Speed
            </button>
            <button (click)="sendPreset('How do I request a Vault Black metal card?')"
                    class="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-teal-50 hover:border-teal-300 text-slate-700 text-[10.5px] font-semibold transition border border-slate-200 shadow-2xs">
              💳 Black Metal Card
            </button>
            <button (click)="sendPreset('What are the high-yield treasury investment plans and APY?')"
                    class="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-teal-50 hover:border-teal-300 text-slate-700 text-[10.5px] font-semibold transition border border-slate-200 shadow-2xs">
              📈 Treasury Vaults
            </button>
            <button (click)="sendPreset('Can I download an official PDF bank statement?')"
                    class="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-teal-50 hover:border-teal-300 text-slate-700 text-[10.5px] font-semibold transition border border-slate-200 shadow-2xs">
              📄 PDF Statement
            </button>
            <button (click)="sendPreset('Can I speak with a human support officer?')"
                    class="shrink-0 px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10.5px] font-bold transition border border-amber-200 shadow-2xs">
              👤 Human Agent
            </button>
          </div>

          <!-- Chat Input Footer -->
          <footer class="p-3 bg-white border-t border-slate-200 shrink-0">
            <form (ngSubmit)="sendMessage()" class="flex items-center gap-2">
              <input type="text" [(ngModel)]="userInput" name="chatInput"
                     placeholder="Ask any question (e.g. balance, COT code, wires, loans)..."
                     [disabled]="isThinking()"
                     class="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none transition">
              
              <button type="submit" [disabled]="!userInput.trim() || isThinking()"
                      class="px-4 py-2.5 rounded-xl bg-[#003432] hover:bg-[#002625] text-white font-bold text-xs transition disabled:opacity-40 flex items-center justify-center shadow-xs">
                <svg class="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
              </button>
            </form>
          </footer>

        </div>
      }

    </div>
  `
})
export class ChatbotWidgetComponent implements AfterViewChecked {
  private supportService = inject(SupportService);
  private router = inject(Router);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen = signal<boolean>(false);
  isThinking = signal<boolean>(false);
  copiedId = signal<string | null>(null);
  userInput = '';

  messages = signal<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: '### Welcome to Obsidian Trust Bancorp!\nI am **VaultBot AI**, your 24/7 sovereign banking concierge and treasury assistant.\n\nAsk me about your live account balance, SWIFT wire coordinates, statutory **COT / IMF** clearance codes, payment cards, commercial loans, or connect directly with our human compliance officers.',
      time: 'Just now',
      suggestedActions: [
        { label: 'Check Balance', link: '/e-banking/overview' },
        { label: 'Wire Instructions', link: '/e-banking/deposit' },
        { label: 'Human Support', link: '/e-banking/support' }
      ]
    }
  ]);

  toggleOpen(): void {
    this.isOpen.update(v => !v);
  }

  resetChat(): void {
    this.messages.set([
      {
        id: 'welcome-' + Date.now(),
        sender: 'bot',
        text: '### Conversation Reset\nHow may I assist you with your Obsidian Trust Bancorp accounts or institutional services today?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: 'Account Overview', link: '/e-banking/overview' },
          { label: 'Transfer Desk', link: '/e-banking/fund-transfer' }
        ]
      }
    ]);
  }

  sendPreset(query: string): void {
    this.userInput = query;
    this.sendMessage();
  }

  sendMessage(): void {
    if (!this.userInput.trim() || this.isThinking()) return;

    const query = this.userInput.trim();
    this.userInput = '';

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.messages.update(msgs => [...msgs, userMsg]);
    this.isThinking.set(true);

    this.supportService.chatbotQuery(query).subscribe({
      next: (res) => {
        this.isThinking.set(false);
        if (res.data) {
          const botMsg: ChatMessage = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: res.data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedActions: res.data.suggestedActions,
            canEscalate: res.data.canEscalateToHuman
          };
          this.messages.update(msgs => [...msgs, botMsg]);
        }
      },
      error: () => {
        this.isThinking.set(false);
        const errorMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: '### System Notice\nI am temporarily having trouble accessing the banking core. Please feel free to open a ticket directly at our Human Support Desk.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          canEscalate: true
        };
        this.messages.update(msgs => [...msgs, errorMsg]);
      }
    });
  }

  copyText(text: string, id: string): void {
    // Strip markdown formatting for clean clipboard copy
    const cleanText = text
      .replace(/###/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/\|/g, ' ')
      .trim();

    navigator.clipboard.writeText(cleanText).then(() => {
      this.copiedId.set(id);
      setTimeout(() => this.copiedId.set(null), 2000);
    }).catch(() => {});
  }

  formatBotMessage(text: string): string {
    if (!text) return '';

    // 1. Escape HTML
    let out = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 2. Headings (### Heading)
    out = out.replace(/^### (.*$)/gim, '<div class="font-black text-slate-900 text-xs mt-1 mb-1 pb-1 border-b border-slate-100 flex items-center gap-1.5">$1</div>');

    // 3. Bold (**text**)
    out = out.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');

    // 4. Italic (*text*)
    out = out.replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>');

    // 5. Code tags (`code`)
    out = out.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-teal-50 text-teal-900 font-mono text-[10.5px] font-bold border border-teal-200/80">$1</code>');

    // 6. Tables (| col | col | col | or | col | col |)
    out = out.replace(/^\|([^|\n]+)\|([^|\n]+)\|([^|\n]+)\|$/gim, (match, c1, c2, c3) => {
      if (c1.includes('---')) return '';
      return `<div class="grid grid-cols-3 gap-1 py-1 px-2 rounded-lg bg-slate-50 border border-slate-100 my-1 text-[10.5px]"><span class="font-bold text-slate-800">${c1.trim()}</span><span class="text-teal-700 font-medium">${c2.trim()}</span><span class="text-slate-600">${c3.trim()}</span></div>`;
    });
    out = out.replace(/^\|([^|\n]+)\|([^|\n]+)\|$/gim, (match, c1, c2) => {
      if (c1.includes('---')) return '';
      return `<div class="flex justify-between items-center py-1 px-2 rounded-lg bg-slate-50 border border-slate-100 my-1 text-[10.5px]"><span class="font-bold text-slate-800">${c1.trim()}</span><span class="text-teal-800 font-medium">${c2.trim()}</span></div>`;
    });

    // 7. Bullet points (• item)
    out = out.replace(/^• (.*$)/gim, '<div class="flex items-start gap-1.5 my-1"><span class="text-[#0BB4D2] font-black leading-tight">•</span><span class="flex-1">$1</span></div>');

    // 8. Line breaks
    out = out.replace(/\n\n/g, '<div class="h-1.5"></div>');
    out = out.replace(/\n/g, '<br/>');

    return out;
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer && this.scrollContainer.nativeElement) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }
}
