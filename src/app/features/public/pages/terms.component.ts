import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SystemSettingsService } from '../../../core/services/system-settings.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="font-sans text-slate-800 antialiased selection:bg-[#0BB4D2] selection:text-white bg-slate-50 min-h-screen">
      
      <!-- HERO BANNER -->
      <section class="relative bg-gradient-to-b from-[#002624] via-[#003432] to-[#00423f] text-white py-16 sm:py-20 px-5 sm:px-8 border-b border-teal-800/80 overflow-hidden">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-[#0BB4D2]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-900/60 border border-teal-700/60 text-xs text-teal-300 shadow-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span class="font-semibold uppercase tracking-wider">Regulatory Compliance &bull; Master Services Agreement</span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Terms &amp; Conditions of Banking
          </h1>

          <p class="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            These Terms &amp; Conditions govern all account opening, deposit administration, electronic funds transfers, global wire clearings, credit instruments, and digital treasury facilities provided by {{ systemSettings.siteName() }}.
          </p>

          <div class="flex flex-wrap justify-center items-center gap-4 text-xs text-teal-300/80 pt-2">
            <span><strong>Effective Date:</strong> October 1, 2026</span>
            <span>&bull;</span>
            <span><strong>Version:</strong> 4.8 (Enterprise Master Tier)</span>
            <span>&bull;</span>
            <span><strong>Jurisdiction:</strong> International Commercial Banking &amp; Trust Law</span>
          </div>
        </div>
      </section>

      <!-- MAIN CONTENT WRAPPER -->
      <section class="max-w-6xl mx-auto px-5 sm:px-8 py-12 lg:py-16">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- STICKY TABLE OF CONTENTS -->
          <div class="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Summary of Sections</span>
                <span class="text-[10px] text-teal-600 font-semibold">12 Articles</span>
              </h3>
              <nav class="space-y-1.5 text-xs">
                <a href="#article-1" class="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#003432] hover:bg-slate-100 transition font-medium">1. Corporate Entity &amp; Scope</a>
                <a href="#article-2" class="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#003432] hover:bg-slate-100 transition font-medium">2. Account Opening &amp; Eligibility</a>
                <a href="#article-3" class="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#003432] hover:bg-slate-100 transition font-medium">3. Authentication &amp; Security</a>
                <a href="#article-4" class="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#003432] hover:bg-slate-100 transition font-medium">4. Deposits &amp; Ledger Accounting</a>
                <a href="#article-5" class="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#003432] hover:bg-slate-100 transition font-medium">5. Wire Transfers &amp; Clearances</a>
                <a href="#article-6" class="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#003432] hover:bg-slate-100 transition font-medium">6. AML, KYC &amp; Sanctions Compliance</a>
                <a href="#article-7" class="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#003432] hover:bg-slate-100 transition font-medium">7. Cards &amp; Electronic Facilities</a>
                <a href="#article-8" class="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#003432] hover:bg-slate-100 transition font-medium">8. Fees, Levies &amp; Tariffs</a>
                <a href="#article-9" class="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#003432] hover:bg-slate-100 transition font-medium">9. Unauthorized Activity &amp; Liability</a>
                <a href="#article-10" class="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#003432] hover:bg-slate-100 transition font-medium">10. Suspension &amp; Termination</a>
                <a href="#article-11" class="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#003432] hover:bg-slate-100 transition font-medium">11. Governing Law &amp; Arbitration</a>
                <a href="#article-12" class="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#003432] hover:bg-slate-100 transition font-medium">12. Notices &amp; Legal Service</a>
              </nav>

              <div class="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <a routerLink="/privacy" class="flex items-center justify-between text-xs font-semibold text-teal-700 hover:text-teal-900 transition">
                  <span>View Privacy Policy &rarr;</span>
                  <span class="text-[10px] bg-teal-50 px-2 py-0.5 rounded text-teal-800">GDPR &bull; GLBA</span>
                </a>
                <a routerLink="/security" class="flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 transition">
                  <span>Security Infrastructure &rarr;</span>
                  <span class="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">SOC 2 &bull; TLS</span>
                </a>
              </div>
            </div>

            <!-- REGULATORY NOTICE CARD -->
            <div class="bg-gradient-to-br from-slate-900 to-[#003432] text-white rounded-2xl p-5 shadow-xs space-y-3">
              <div class="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider">
                <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clip-rule="evenodd"></path></svg>
                <span>Statutory Notice</span>
              </div>
              <p class="text-[11px] text-slate-300 leading-relaxed">
                {{ systemSettings.siteName() }} operates in full compliance with Basel III capital adequacy guidelines, the Financial Action Task Force (FATF) standards, and international commercial banking regulations.
              </p>
              <div class="text-[10px] text-slate-400 pt-1 border-t border-teal-800/60">
                SWIFT BIC: <span class="text-white font-mono font-semibold">{{ systemSettings.swiftCode() }}</span>
              </div>
            </div>
          </div>

          <!-- LEGAL ARTICLES CONTENT -->
          <div class="lg:col-span-8 space-y-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
            
            <!-- PREAMBLE -->
            <div class="bg-teal-50/60 border border-teal-100 rounded-2xl p-5 text-xs text-teal-950 leading-relaxed space-y-2">
              <div class="font-bold text-sm text-[#003432] flex items-center gap-2">
                <span>MASTER DIGITAL BANKING SERVICES AGREEMENT</span>
              </div>
              <p>
                PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE ACCESSING OR UTILIZING THE ONLINE BANKING PORTAL, INSTITUTIONAL TREASURY PLATFORM, OR FINANCIAL PRODUCTS OF {{ systemSettings.siteName().toUpperCase() }}. BY ENROLLING, SIGNING IN, EXECUTING TRANSACTIONS, OR MAINTAINING AN ACCOUNT, YOU EXPRESSLY ACKNOWLEDGE AND AGREE TO BE LEGALLY BOUND BY ALL PROVISIONS SET FORTH HEREIN.
              </p>
            </div>

            <!-- ARTICLE 1 -->
            <article id="article-1" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                Article 1. Corporate Identity, Licensing &amp; Scope
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                1.1. <strong>Operating Entity:</strong> The digital banking platform, depository facilities, transactional clearings, and wealth services are provided by <strong>{{ systemSettings.siteName() }}</strong> ("the Bank", "Institution", "we", "us", or "our"), with registered institutional headquarters situated at {{ systemSettings.address() }}.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                1.2. <strong>Regulatory Authority:</strong> The Bank is authorized to conduct private wealth custody, structured corporate escrow, multi-currency commercial lending, and cross-border payment processing. Transactions processed through our international correspondent network adhere to the Uniform Customs and Practice for Documentary Credits (UCP 600) and the International Chamber of Commerce (ICC) guidelines.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                1.3. <strong>Scope of Service:</strong> These terms govern individual consumer accounts, institutional corporate accounts, international wire transmittals, debit facilities, cryptographic asset wallets, and collateralized credit lines.
              </p>
            </article>

            <!-- ARTICLE 2 -->
            <article id="article-2" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                Article 2. Account Eligibility, Due Diligence &amp; Verification
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                2.1. <strong>Capacity:</strong> You represent and warrant that you are at least 18 years of age (or of legal majority in your home jurisdiction), possess the full legal power and authority to enter into this binding contract, and are not prohibited under international trade restrictions or sanctions programs.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                2.2. <strong>Customer Due Diligence (KYC):</strong> In accordance with the USA PATRIOT Act, UK Money Laundering Regulations 2017, and the European Anti-Money Laundering Directives (AMLD), all account holders are required to submit verifiable biometric identification, government-issued photo identification, proof of registered domicile, and beneficial ownership documentation.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                2.3. <strong>Accuracy of Records:</strong> You warrant that all statements, addresses, tax identification numbers, and contact protocols provided during enrollment are truthful, accurate, and up-to-date. Failure to immediately notify the Bank of material changes constitutes a material breach of this Agreement.
              </p>
            </article>

            <!-- ARTICLE 3 -->
            <article id="article-3" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                Article 3. Digital Credentials, Security &amp; Multi-Factor Authentication
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                3.1. <strong>Security Tier Architecture:</strong> Access to online banking requires primary credential authentication (Unique Email and Encrypted Password) accompanied by a mandatory secondary Four-Digit Transaction Security PIN (Personal Identification Number) and pre-authorization token handshake.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                3.2. <strong>Duty of Confidentiality:</strong> You are solely responsible for maintaining the absolute secrecy of your credentials, security PIN, cryptographic session tokens, and recovery passphrases. The Bank's staff will never ask you to disclose your Four-Digit Transaction Security PIN via phone, SMS, or unauthenticated email.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                3.3. <strong>Immediate Notification:</strong> If you suspect or discover that your credentials, hardware token, or device have been compromised, lost, stolen, or accessed without authority, you must contact our Global Treasury Support Desk immediately at <strong class="text-teal-800">{{ systemSettings.contactEmail() }}</strong> or <strong class="text-teal-800">{{ systemSettings.phoneNumber() }}</strong>.
              </p>
            </article>

            <!-- ARTICLE 4 -->
            <article id="article-4" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                Article 4. Deposits, Ledger Accounting &amp; Funds Availability
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                4.1. <strong>Available Balance vs. Ledger Balance:</strong> Your "Ledger Balance" reflects the raw total of all credits and debits posted to your account. Your "Available Balance" reflects funds immediately accessible for withdrawal or transfer, calculated after deducting holds, pending authorizations, regulatory clearance checks, and uncleared cheques.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                4.2. <strong>Deposit Holds:</strong> Pursuant to Regulation CC (Expedited Funds Availability Act) and equivalent international banking standards, the Bank reserves the right to impose a provisional holding period on deposited instruments, international drafts, and large-value inbound wires pending irrevocable bank-to-bank settlement.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                4.3. <strong>Interest &amp; Yield Calculations:</strong> Interest on High-Yield Savings, Institutional Fixed-Income Portfolios, and Term Certificates of Deposit accrues daily on the collected balance and compounds according to the specific schedule disclosed in your account schedule.
              </p>
            </article>

            <!-- ARTICLE 5 -->
            <article id="article-5" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                Article 5. Fund Transfers, Global Wire Clearing &amp; Regulatory Clearance
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                5.1. <strong>Execution of Transfer Orders:</strong> Transfer instructions submitted through the portal (Internal Transfers, Domestic Automated Clearing House [ACH], Fedwire, or SWIFT International MT103 Clearings) are processed in the order received during standard global treasury operating hours.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                5.2. <strong>Clearance Levies &amp; Mandatory Certifications:</strong> International outbound wire transfers in excess of prescribed institutional thresholds or involving multi-jurisdictional currency exchange may be subject to statutory clearance protocols, including Cost of Transfer (COT) levies, Anti-Money Laundering (AML) inspection certificates, or International Monetary Fund (IMF) cross-border clearance codes where mandated by correspondent banking regulations.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                5.3. <strong>Irrevocability:</strong> Once a wire transfer has cleared the SWIFT gateway or settlement clearinghouse, the instruction is final, binding, and irrevocable. The Bank cannot recall funds transferred to a beneficiary whose payment order has already been credited by the destination bank.
              </p>
            </article>

            <!-- ARTICLE 6 -->
            <article id="article-6" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                Article 6. Anti-Money Laundering (AML) &amp; Sanctions Screening
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                6.1. <strong>Compliance Screening:</strong> All prospective and existing clients, transactions, and designated beneficiaries are continuously cross-referenced against the consolidated sanctions lists maintained by the United States Office of Foreign Assets Control (OFAC), the United Nations Security Council (UNSC), His Majesty’s Treasury (UK HMT), and the European Union External Action Service.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                6.2. <strong>Reporting Obligations:</strong> Under the Bank Secrecy Act and Proceeds of Crime Act 2002, the Bank is legally required to file Suspicious Activity Reports (SARs) and Currency Transaction Reports (CTRs) with appropriate financial intelligence units without providing prior notice or disclosure to the account holder ("Tipping Off" prohibition).
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                6.3. <strong>Right of Interception:</strong> The Bank reserves the unrestricted right to intercept, block, freeze, or reject any transaction or asset that violates international sanctions, export controls, or anti-bribery statutes.
              </p>
            </article>

            <!-- ARTICLE 7 -->
            <article id="article-7" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                Article 7. Payment Cards, Digital Wallets &amp; Credit Facilities
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                7.1. <strong>Debit &amp; Credit Cards:</strong> Physical and virtual cards issued by {{ systemSettings.siteName() }} remain the property of the Bank and must be surrendered or destroyed upon demand. Cards are subject to daily POS and ATM cash withdrawal limits set forth in your account control dashboard.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                7.2. <strong>Digital &amp; Multi-Currency Wallets:</strong> Multi-currency balances and integrated custodial cryptocurrency wallets are maintained under institutional segregated omnibus accounts. Currency conversions are executed at prevailing institutional spot rates plus transparent clearing spreads.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                7.3. <strong>Lending &amp; Amortization:</strong> Personal, commercial, and bridge loans granted by the Bank require continuous adherence to the stipulated amortization schedule. Default on interest or principal installments entitles the Bank to exercise right of set-off against any depository balances held within the Institution.
              </p>
            </article>

            <!-- ARTICLE 8 -->
            <article id="article-8" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                Article 8. Account Tariffs, Maintenance Levies &amp; Withholding
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                8.1. <strong>Fee Schedule:</strong> Account holders agree to pay all periodic maintenance fees, wire transmittal tariffs, foreign exchange commissions, and custodial charges in accordance with the Bank's Published Fee Schedule.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                8.2. <strong>Right of Direct Debit:</strong> You authorize the Bank to debit any outstanding fees, clearance levies, overdraft amounts, or chargebacks directly from your Available Balance without requiring separate advance authorization.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                8.3. <strong>Tax Reporting &amp; Withholding:</strong> The Bank reports interest income and transactional activity in compliance with the Foreign Account Tax Compliance Act (FATCA) and Common Reporting Standard (CRS). Clients are solely responsible for satisfying their individual tax obligations in their respective jurisdictions.
              </p>
            </article>

            <!-- ARTICLE 9 -->
            <article id="article-9" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                Article 9. Error Resolution, Unauthorized Charges &amp; Limitation of Liability
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                9.1. <strong>Error Reporting Protocol:</strong> You must examine your monthly bank statements and transaction ledger promptly. If you believe an unauthorized transfer or error has occurred, you must notify the Bank within sixty (60) days of the statement dispatch date.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                9.2. <strong>Limitation of Liability:</strong> Except where strictly required by applicable consumer protection legislation, the Bank, its officers, directors, correspondents, and technology providers shall not be liable for indirect, incidental, punitive, or consequential damages resulting from system downtime, telecommunications failures, correspondent delays, or force majeure events.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                9.3. <strong>Force Majeure:</strong> The Bank is relieved from performance obligations during circumstances beyond its reasonable control, including natural disasters, acts of war, civil insurrection, telecommunications backbone failure, or central bank clearinghouse interruptions.
              </p>
            </article>

            <!-- ARTICLE 10 -->
            <article id="article-10" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                Article 10. Account Freeze, Dormancy &amp; Termination
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                10.1. <strong>Administrative Freeze:</strong> The Bank reserves the right to temporarily restrict, suspend, or freeze any account if: (a) conflicting ownership claims are asserted; (b) law enforcement or judicial process is served; (c) unusual or suspicious transaction velocity is detected; or (d) mandatory KYC documentation expires.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                10.2. <strong>Closure by Account Holder:</strong> You may close your account at any time provided all outstanding liabilities, negative balances, and accrued fees are satisfied in full. Residual balances will be disbursed via certified bank draft or domestic wire.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                10.3. <strong>Closure by the Bank:</strong> The Bank may terminate your banking relationship at its discretion upon written notice, or immediately without notice in instances of fraud, fraudulent inducement, or regulatory mandate.
              </p>
            </article>

            <!-- ARTICLE 11 -->
            <article id="article-11" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                Article 11. Governing Law &amp; Mandatory Binding Arbitration
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                11.1. <strong>Governing Law:</strong> This Agreement, and all claims or controversies arising out of or relating to your banking relationship with {{ systemSettings.siteName() }}, shall be governed by and construed in accordance with the laws of England and Wales and international commercial banking jurisprudence.
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                11.2. <strong>Arbitration Agreement:</strong> Any dispute, controversy, or claim arising out of or relating to this contract, including its formation or breach, shall be settled by binding international commercial arbitration administered by the London Court of International Arbitration (LCIA) or International Chamber of Commerce (ICC).
              </p>
              <p class="text-xs text-slate-600 leading-relaxed">
                11.3. <strong>Waiver of Class Action:</strong> To the maximum extent permitted by law, all disputes must be resolved on an individual basis. You explicitly waive any right to initiate, join, or participate as a plaintiff or class member in any class action lawsuit against the Bank.
              </p>
            </article>

            <!-- ARTICLE 12 -->
            <article id="article-12" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                Article 12. Legal Notices &amp; Institutional Service
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                12.1. <strong>Service of Notice:</strong> Official communications, legal notices, and process service must be transmitted in writing via certified courier or registered transmission to:
              </p>
              
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1 font-mono">
                <div class="font-bold text-[#003432]">{{ systemSettings.siteName() }} Legal &amp; Compliance Directorate</div>
                <div>Address: {{ systemSettings.address() }}</div>
                <div>Electronic Service: {{ systemSettings.adminEmail() }}</div>
                <div>General Enquiries: {{ systemSettings.contactEmail() }}</div>
                <div>SWIFT / BIC Code: {{ systemSettings.swiftCode() }}</div>
              </div>

              <p class="text-xs text-slate-500 pt-2">
                By maintaining an account or transacting with {{ systemSettings.siteName() }}, you certify that you have read, comprehended, and agreed to be bound by every term, condition, covenant, and disclosure stated in this Agreement.
              </p>
            </article>

            <!-- PRINT / DOWNLOAD BUTTONS -->
            <div class="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div class="text-xs text-slate-400">
                Document Ref: <span class="font-mono font-medium text-slate-600">OTB-BSA-2026-V4</span>
              </div>
              <div class="flex items-center gap-3">
                <button type="button" 
                        onclick="window.print()" 
                        class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                  <span>Print Document</span>
                </button>
                <a routerLink="/open-account" 
                   class="px-5 py-2 rounded-xl bg-gradient-to-r from-[#003432] to-[#005a56] hover:from-[#002624] hover:to-[#00423f] text-white text-xs font-bold transition shadow-xs">
                  Apply for Account
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  `
})
export class TermsComponent {
  systemSettings = inject(SystemSettingsService);
}
