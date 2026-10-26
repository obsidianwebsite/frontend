import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-[#f9f9f9] text-[#4d4e4f] font-sans">
      
      <!-- HERO SLIDER AREA (Exact otbplc.com main_slider_area with slider-2.jpg) -->
      <section class="relative bg-[#003432] text-white min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden">
        <!-- Background Banner Image -->
        <div class="absolute inset-0 z-0 bg-cover bg-center"
             style="background-image: url('images/slider-2.jpg');">
          <div class="absolute inset-0 bg-gradient-to-r from-[#003432]/95 via-[#003432]/80 to-transparent"></div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-20 w-full">
          <div class="max-w-2xl space-y-5">
            
            <div class="inline-block px-3 py-1 bg-[#0BB4D2]/20 border border-[#0BB4D2]/40 rounded text-xs font-bold uppercase tracking-wider text-[#0BB4D2]">
              Personal &bull; Business &bull; Fixed Deposit
            </div>

            <h1 class="text-4xl sm:text-6xl font-black font-nunito tracking-tight text-white leading-tight">
              Why Not Open An Account <span class="text-[#0BB4D2]">Today</span>
            </h1>

            <p class="text-slate-200 text-base sm:text-lg font-normal leading-relaxed max-w-xl">
              Consolidating debt? Paying for a large expense like home improvement or a special occasion? We have you covered with flexible terms and low fixed rates.
            </p>

            <div class="pt-4 flex flex-wrap items-center gap-4">
              <a routerLink="/open-account" class="theme_btn">
                Open An Account
              </a>
              <a routerLink="/login" class="theme_btn apply_btn">
                E-Banking
              </a>
            </div>

          </div>
        </div>
      </section>

      <!-- ACHIEVE YOUR FINANCIAL AREA (Exact otbplc.com achieve_financial_area afa_2) -->
      <section id="services" class="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div class="max-w-7xl mx-auto px-5 sm:px-8">
          
          <!-- Quality Service Banner -->
          <div class="bg-[#f4f7f6] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-16 border border-slate-200">
            <div>
              <p class="text-base sm:text-lg text-slate-700">
                <span class="font-bold text-[#003432]">16 YEARS OF QUALITY SERVICE IN BANKING.</span> 
                We strive to deliver sustainable economic growth.
              </p>
            </div>
            <a routerLink="/open-account" class="theme_btn shrink-0">
              Open An Account Today
            </a>
          </div>

          <!-- 3 Service Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <!-- Card 1: Personal Loan -->
            <div class="scroll-reveal delay-100 p-8 rounded-xl bg-white border border-slate-200 hover:shadow-xl transition-all duration-300 text-center space-y-4 group">
              <div class="w-20 h-20 mx-auto flex items-center justify-center">
                <img src="images/icons/banker.png" alt="Personal Loan" class="h-16 w-auto group-hover:scale-110 transition-transform">
              </div>
              <h3 class="text-xl font-bold font-nunito text-[#003432]">Personal Loan</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Existing customers looking to borrow money can get a loan with fixed repayments over 1 to 7 years.
              </p>
              <div class="pt-2">
                <a routerLink="/loans" class="text-xs font-bold text-[#0BB4D2] hover:text-[#003432] uppercase tracking-wider inline-flex items-center gap-1">
                  <span>Learn More</span> &rarr;
                </a>
              </div>
            </div>

            <!-- Card 2: Mutual Funds -->
            <div class="scroll-reveal delay-200 p-8 rounded-xl bg-white border border-slate-200 hover:shadow-xl transition-all duration-300 text-center space-y-4 group">
              <div class="w-20 h-20 mx-auto flex items-center justify-center">
                <img src="images/icons/money-bag.png" alt="Mutual Funds" class="h-16 w-auto group-hover:scale-110 transition-transform">
              </div>
              <h3 class="text-xl font-bold font-nunito text-[#003432]">Mutual Funds</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Mutual funds are one of the most popular ways for new investors to buy stocks, bonds and real estate.
              </p>
              <div class="pt-2">
                <a routerLink="/services" class="text-xs font-bold text-[#0BB4D2] hover:text-[#003432] uppercase tracking-wider inline-flex items-center gap-1">
                  <span>Learn More</span> &rarr;
                </a>
              </div>
            </div>

            <!-- Card 3: Savings & Investment -->
            <div class="scroll-reveal delay-300 p-8 rounded-xl bg-white border border-slate-200 hover:shadow-xl transition-all duration-300 text-center space-y-4 group">
              <div class="w-20 h-20 mx-auto flex items-center justify-center">
                <img src="images/icons/money-bag-2.png" alt="Savings & Investment" class="h-16 w-auto group-hover:scale-110 transition-transform">
              </div>
              <h3 class="text-xl font-bold font-nunito text-[#003432]">Savings &amp; Investment</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Let our financial planning experts manage your savings and investment both short and long term.
              </p>
              <div class="pt-2">
                <a routerLink="/savings" class="text-xs font-bold text-[#0BB4D2] hover:text-[#003432] uppercase tracking-wider inline-flex items-center gap-1">
                  <span>Learn More</span> &rarr;
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- PREVIOUS RECORD AREA (Exact otbplc.com previous_record_area pra_2) -->
      <section id="history" class="py-20 bg-[#f9f9f9] border-b border-slate-200/80">
        <div class="max-w-7xl mx-auto px-5 sm:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <!-- Left Text Content -->
            <div class="lg:col-span-7 space-y-6">
              <div class="space-y-2">
                <h2 class="text-3xl sm:text-4xl font-black font-nunito text-[#003432] tracking-tight">
                  Obsidian Trust Bancorp's Previous Record
                </h2>
                <h4 class="text-lg font-bold text-[#0BB4D2]">
                  More than 15 years experience
                </h4>
              </div>

              <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
                Over the past 15 years, Obsidian Trust Bancorp Plc. has evolved from an obscure British Bank into a world-class financial institution. Today, we are one of the largest banks in UK in terms of assets, loans, deposits and branch network; a feat which has been achieved through a robust long-term approach to client solutions – providing committed and innovative advice.
              </p>
              
              <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
                Obsidian Trust Bancorp has built its strength and success in corporate banking and is now applying that expertise to the personal and business banking platforms. Obsidian Trust Bancorp is focused on mainstreaming sustainable business practices into its operations. The Bank strives to deliver sustainable economic growth that is profitable, environmentally responsible, and socially relevant.
              </p>

              <div class="flex items-center gap-6 pt-2">
                <a routerLink="/about" class="theme_btn">
                  Read more details
                </a>
                <img src="images/icons/signuarte.png" alt="Director Signature" class="h-12 w-auto object-contain">
              </div>

              <!-- Stat Counters -->
              <div class="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200">
                <div>
                  <h4 class="text-xs text-slate-500 font-bold uppercase tracking-wider">Years Experience</h4>
                  <div class="text-3xl sm:text-4xl font-black font-nunito text-[#003432]">16</div>
                </div>
                <div>
                  <h4 class="text-xs text-slate-500 font-bold uppercase tracking-wider">Happy Customers</h4>
                  <div class="text-3xl sm:text-4xl font-black font-nunito text-[#003432]">72K+</div>
                </div>
                <div>
                  <h4 class="text-xs text-slate-500 font-bold uppercase tracking-wider">Satisfaction</h4>
                  <div class="text-3xl sm:text-4xl font-black font-nunito text-[#003432]">100%</div>
                </div>
              </div>

            </div>

            <!-- Right Image -->
            <div class="lg:col-span-5 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img src="images/previous_record-2.jpg" alt="Obsidian Trust Bancorp Headquarters" class="w-full h-auto object-cover">
            </div>

          </div>
        </div>
      </section>

      <!-- APPLICATION PROCESS / WHY US (Exact otbplc.com application_process) -->
      <section class="py-20 bg-white border-b border-slate-200/80">
        <div class="max-w-7xl mx-auto px-5 sm:px-8">
          
          <div class="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 class="text-3xl sm:text-4xl font-black font-nunito text-[#003432] tracking-tight">
              Why Us <span class="block text-base font-normal text-slate-500 pt-1">Reasons &amp; To Bank With Us.</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <!-- Step 1 -->
            <div class="p-8 rounded-xl bg-[#f8f9fa] border border-slate-200 text-center space-y-4 hover:shadow-lg transition">
              <h3 class="text-base font-bold uppercase tracking-wider text-[#003432]">FAST LOAN APPROVAL</h3>
              <div class="h-20 flex items-center justify-center">
                <img src="images/icons/step-1.png" alt="Fast Loan Approval" class="h-16 w-auto">
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Existing Obsidian Trust Bancorp customers looking to borrow money can get a loan from &pound;1,000 to &pound;50,000 with fixed repayments over 1 to 7 years.
              </p>
            </div>

            <!-- Step 2 -->
            <div class="p-8 rounded-xl bg-[#f8f9fa] border border-slate-200 text-center space-y-4 hover:shadow-lg transition">
              <h3 class="text-base font-bold uppercase tracking-wider text-[#003432]">DEDICATED TEAM</h3>
              <div class="h-20 flex items-center justify-center">
                <img src="images/icons/step-2.png" alt="Dedicated Team" class="h-16 w-auto">
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Our Banking Team and Managers are dedicated to serving you and our goal is to give you maximum satisfaction in banking with us.
              </p>
            </div>

            <!-- Step 3 -->
            <div class="p-8 rounded-xl bg-[#f8f9fa] border border-slate-200 text-center space-y-4 hover:shadow-lg transition">
              <h3 class="text-base font-bold uppercase tracking-wider text-[#003432]">24/7 SUPPORT</h3>
              <div class="h-20 flex items-center justify-center">
                <img src="images/icons/step-3.png" alt="24/7 Support" class="h-16 w-auto">
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Our Customer Support Lines are open 24 hours a day all week so free to call in or send us an email.
              </p>
            </div>

          </div>

        </div>
      </section>

      <!-- GETTING A LOAN / E-BANKING (Exact otbplc.com getting_loan_area gla_2) -->
      <section class="py-20 bg-[#f4f7f6] border-b border-slate-200/80">
        <div class="max-w-7xl mx-auto px-5 sm:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <!-- Left Card Image -->
            <div class="lg:col-span-6 flex justify-center">
              <img src="images/loan-card.png" alt="Obsidian Trust Bancorp Card" class="max-w-md w-full h-auto drop-shadow-2xl">
            </div>

            <!-- Right E-Banking Features -->
            <div class="lg:col-span-6 space-y-8">
              <div class="space-y-2">
                <h2 class="text-3xl sm:text-4xl font-black font-nunito text-[#003432]">
                  E-Banking <span class="block text-lg font-normal text-[#0BB4D2]">Offering Even More</span>
                </h2>
              </div>

              <!-- Feature 1 -->
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-[#003432] text-white flex items-center justify-center shrink-0 text-xl font-bold">
                  💳
                </div>
                <div>
                  <h3 class="text-lg font-bold text-[#003432]">Card Services</h3>
                  <p class="text-sm text-slate-600 leading-relaxed">
                    With our easy online platform you can request for cards, activate or deactivate credit/debit cards.
                  </p>
                </div>
              </div>

              <!-- Feature 2 -->
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-[#0BB4D2] text-white flex items-center justify-center shrink-0 text-xl font-bold">
                  ⚡
                </div>
                <div>
                  <h3 class="text-lg font-bold text-[#003432]">Instant Wire Transfer</h3>
                  <p class="text-sm text-slate-600 leading-relaxed">
                    You can send money from your account via our wire transfer to any bank account domestically or internationally.
                  </p>
                </div>
              </div>

              <!-- Feature 3 -->
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-[#003432] text-white flex items-center justify-center shrink-0 text-xl font-bold">
                  📑
                </div>
                <div>
                  <h3 class="text-lg font-bold text-[#003432]">Account Statement</h3>
                  <p class="text-sm text-slate-600 leading-relaxed">
                    You can also request for your e-bank statement from our online banking platform anytime in PDF format.
                  </p>
                </div>
              </div>

              <div class="pt-4 flex items-center gap-4">
                <a routerLink="/login" class="theme_btn apply_btn">
                  Launch E-Banking
                </a>
                <a routerLink="/open-account" class="theme_btn">
                  Open An Account
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      <!-- TESTIMONIAL AREA (Exact otbplc.com testimonial_area) -->
      <section class="py-20 bg-white border-b border-slate-200/80">
        <div class="max-w-7xl mx-auto px-5 sm:px-8">
          
          <div class="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 class="text-3xl sm:text-4xl font-black font-nunito text-[#003432]">
              Words From Customers <span class="block text-base font-normal text-slate-500 pt-1">Testimonial</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            <!-- Testimonial 1 -->
            <div class="p-8 rounded-2xl bg-[#f8f9fa] border border-slate-200 space-y-4 shadow-sm">
              <div class="flex items-center gap-4">
                <img src="images/testimonial-1.jpg" alt="Philip Felps" class="w-16 h-16 rounded-full object-cover border-2 border-[#0BB4D2]">
                <div>
                  <h4 class="font-bold text-[#003432] text-base">Philip Felps</h4>
                  <span class="text-xs text-slate-500 font-semibold">Engineer</span>
                </div>
              </div>
              <p class="text-sm text-slate-600 leading-relaxed italic">
                &ldquo;Banking with Obsidian Trust Bancorp has been an experience from inception till date and they have the best banking staffs have met. they are the best in all of UK.&rdquo;
              </p>
            </div>

            <!-- Testimonial 2 -->
            <div class="p-8 rounded-2xl bg-[#f8f9fa] border border-slate-200 space-y-4 shadow-sm">
              <div class="flex items-center gap-4">
                <img src="images/testimonial-2.jpg" alt="Anita Lugard" class="w-16 h-16 rounded-full object-cover border-2 border-[#0BB4D2]">
                <div>
                  <h4 class="font-bold text-[#003432] text-base">Anita Lugard</h4>
                  <span class="text-xs text-slate-500 font-semibold">Teacher</span>
                </div>
              </div>
              <p class="text-sm text-slate-600 leading-relaxed italic">
                &ldquo;The representative helping me was absolutely fantastic. Not only did I get my loan but she also advised me that she could help me get my credit back. No other financial institute comes close.&rdquo;
              </p>
            </div>

          </div>

        </div>
      </section>

      <!-- LATEST NEWS AREA (Exact otbplc.com latest_news_area) -->
      <section class="py-20 bg-[#f9f9f9] border-b border-slate-200/80">
        <div class="max-w-7xl mx-auto px-5 sm:px-8">
          
          <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-14">
            <div>
              <h2 class="text-3xl sm:text-4xl font-black font-nunito text-[#003432]">
                Banking News <span class="block text-base font-normal text-slate-500 pt-1">Get more Latest News here ...</span>
              </h2>
            </div>
            <a routerLink="/about" class="theme_btn">
              See All News List
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <!-- News 1 -->
            <div class="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl transition group">
              <div class="h-48 overflow-hidden">
                <img src="images/blog/latet-news-1.jpg" alt="Business Credit Score" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
              </div>
              <div class="p-6 space-y-3">
                <span class="text-xs font-bold text-[#0BB4D2] uppercase tracking-wider">20 November 2018</span>
                <h3 class="text-base font-bold font-nunito text-[#003432] group-hover:text-[#0BB4D2] transition">
                  How to build a better business credit score
                </h3>
              </div>
            </div>

            <!-- News 2 -->
            <div class="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl transition group">
              <div class="h-48 overflow-hidden">
                <img src="images/blog/latet-news-2.jpg" alt="Mortgage Rates" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
              </div>
              <div class="p-6 space-y-3">
                <span class="text-xs font-bold text-[#0BB4D2] uppercase tracking-wider">2 January 2026</span>
                <h3 class="text-base font-bold font-nunito text-[#003432] group-hover:text-[#0BB4D2] transition">
                  Mortgage rates move lower for Tuesday
                </h3>
              </div>
            </div>

            <!-- News 3 -->
            <div class="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl transition group">
              <div class="h-48 overflow-hidden">
                <img src="images/blog/latet-news-3.jpg" alt="Buying a House" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
              </div>
              <div class="p-6 space-y-3">
                <span class="text-xs font-bold text-[#0BB4D2] uppercase tracking-wider">25 March 2026</span>
                <h3 class="text-base font-bold font-nunito text-[#003432] group-hover:text-[#0BB4D2] transition">
                  5 essential factors to consider when buying a house
                </h3>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- GET STARTED AREA (Exact otbplc.com get_started_area with #003432 background) -->
      <section class="py-16 bg-[#003432] text-white text-center">
        <div class="max-w-4xl mx-auto px-5 sm:px-8 space-y-4">
          <h2 class="text-3xl sm:text-4xl font-black font-nunito">Ready to get started?</h2>
          <p class="text-slate-300 text-sm sm:text-base">Would recommend Money Me to a friend</p>
          <div class="pt-2">
            <a routerLink="/open-account" class="theme_btn apply_btn">
              Apply for business loan
            </a>
          </div>
        </div>
      </section>

      <!-- SUBSCRIBE NEWSLETTER (Exact otbplc.com subscirbe_area with #0BB4D2 background) -->
      <section class="py-12 bg-[#0BB4D2] text-white">
        <div class="max-w-7xl mx-auto px-5 sm:px-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <h2 class="text-2xl sm:text-3xl font-black font-nunito">Subscribe Our Newsletter!!</h2>
            <div class="w-full md:w-auto flex items-center max-w-md bg-white rounded-md overflow-hidden p-1">
              <input type="email" placeholder="Your Email address" class="px-4 py-2 w-full text-slate-800 text-sm focus:outline-none">
              <button class="bg-[#003432] text-white px-5 py-2 rounded text-xs font-bold uppercase hover:bg-[#002625] transition shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  `
})
export class HomeComponent {}
