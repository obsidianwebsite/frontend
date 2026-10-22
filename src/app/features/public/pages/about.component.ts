import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      
      <!-- Banner -->
      <section class="bg-slate-950 text-white py-16 sm:py-24 px-5 sm:px-8 border-b border-slate-800 relative overflow-hidden">
        <div class="absolute -top-20 -right-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <span class="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
            About Our Bank
          </span>
          <h1 class="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Built for people who want better banking.
          </h1>
          <p class="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We started Obsidian Trust Bancorp with a simple goal: make managing, saving, and moving money honest, easy, and completely stress-free.
          </p>
        </div>
      </section>

      <!-- Main Story with Photography -->
      <section class="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div class="space-y-6">
            <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Our Mission</span>
            <h2 class="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              Banking shouldn't be complicated or full of hidden fees.
            </h2>
            <p class="text-base text-slate-600 leading-relaxed">
              For too long, traditional banks have relied on confusing fees, endless paperwork, and long branch lines. We believe you deserve better.
            </p>
            <p class="text-base text-slate-600 leading-relaxed">
              Obsidian Trust Bancorp combines the security of a regulated commercial bank with the ease of modern technology. Today, we proudly serve over 45,000 personal and business customers across the UK, Europe, North America, and worldwide.
            </p>
            <div class="pt-2 flex items-center gap-6">
              <div>
                <strong class="text-2xl sm:text-3xl font-black text-slate-900 font-tabular">45,000+</strong>
                <span class="block text-xs text-slate-500">Happy Customers</span>
              </div>
              <div class="border-l border-slate-200 pl-6">
                <strong class="text-2xl sm:text-3xl font-black text-emerald-600 font-tabular">&dollar;2.4B+</strong>
                <span class="block text-xs text-slate-500">Deposits Protected</span>
              </div>
              <div class="border-l border-slate-200 pl-6">
                <strong class="text-2xl sm:text-3xl font-black text-cyan-600 font-tabular">4.9 / 5</strong>
                <span class="block text-xs text-slate-500">Customer Rating</span>
              </div>
            </div>
          </div>

          <div class="rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80" 
                 alt="Canary Wharf Financial Tower London headquarters" class="w-full h-[400px] object-cover">
          </div>
        </div>

        <!-- 3 Core Values -->
        <div class="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900">What we stand for</h2>
          <p class="text-sm text-slate-600">Three simple promises we make to every customer.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          
          <div class="obsidian-card p-8 space-y-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-lg">01</div>
            <h3 class="font-bold text-xl text-slate-900">Total Transparency</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              No hidden account fees, surprise wire markups, or complicated fine print. You always know exactly what you're paying and earning.
            </p>
          </div>

          <div class="obsidian-card p-8 space-y-4">
            <div class="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-black text-lg">02</div>
            <h3 class="font-bold text-xl text-slate-900">Uncompromising Security</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Your money is protected by bank-level 256-bit encryption, two-tier PIN challenges, and FDIC deposit insurance up to &dollar;250,000.
            </p>
          </div>

          <div class="obsidian-card p-8 space-y-4">
            <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-lg">03</div>
            <h3 class="font-bold text-xl text-slate-900">Real Human Support</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              When you call or message us, you reach friendly, experienced people who are ready to help solve your problems quickly.
            </p>
          </div>

        </div>

        <!-- Leadership Team -->
        <div class="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
            Leadership
          </span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900">Meet our leadership team</h2>
          <p class="text-sm text-slate-600">Guided by seasoned leaders in digital banking and customer security.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div class="obsidian-card p-6 text-center space-y-3">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" 
                 alt="Marcus Sterling" class="w-24 h-24 rounded-full mx-auto object-cover shadow-md">
            <div>
              <h4 class="font-bold text-base text-slate-900">Marcus Sterling</h4>
              <div class="text-xs text-emerald-600 font-bold">Chief Executive Officer</div>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">20+ years building customer-first banking platforms in London and New York.</p>
          </div>

          <div class="obsidian-card p-6 text-center space-y-3">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80" 
                 alt="Eleanor Vance" class="w-24 h-24 rounded-full mx-auto object-cover shadow-md">
            <div>
              <h4 class="font-bold text-base text-slate-900">Eleanor Vance</h4>
              <div class="text-xs text-emerald-600 font-bold">Head of Customer Operations</div>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">Dedicated to making sure every customer gets fast, helpful service every time.</p>
          </div>

          <div class="obsidian-card p-6 text-center space-y-3">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" 
                 alt="Julian Bennett" class="w-24 h-24 rounded-full mx-auto object-cover shadow-md">
            <div>
              <h4 class="font-bold text-base text-slate-900">Julian Bennett</h4>
              <div class="text-xs text-emerald-600 font-bold">Chief Technology Officer</div>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">Fintech engineer focused on real-time payments and bank-grade data encryption.</p>
          </div>

          <div class="obsidian-card p-6 text-center space-y-3">
            <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80" 
                 alt="Sophia Al-Mansoor" class="w-24 h-24 rounded-full mx-auto object-cover shadow-md">
            <div>
              <h4 class="font-bold text-base text-slate-900">Sophia Al-Mansoor</h4>
              <div class="text-xs text-emerald-600 font-bold">Head of Personal Banking</div>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">Specialist in creating savings products that help families grow their wealth.</p>
          </div>

        </div>

        <!-- Join Us CTA -->
        <div class="mt-20 p-10 rounded-3xl bg-slate-900 text-white text-center space-y-5">
          <h3 class="text-2xl sm:text-3xl font-black">Experience the difference today.</h3>
          <p class="text-slate-300 text-sm max-w-xl mx-auto">Open your account online in 3 minutes and take control of your financial life.</p>
          <a routerLink="/open-account" class="btn-gradient-mountain px-8 py-3.5 rounded-xl font-bold text-sm inline-block shadow-lg">
            Open Free Account &rarr;
          </a>
        </div>

      </section>

    </div>
  `
})
export class AboutComponent {}
