import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SystemSettingsService } from '../../../core/services/system-settings.service';

@Component({
  selector: 'app-privacy',
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
            <span class="font-semibold uppercase tracking-wider">Data Privacy &bull; GDPR &bull; GLBA Compliance</span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Institutional Privacy Policy
          </h1>

          <p class="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            This Privacy Policy details how {{ systemSettings.siteName() }} collects, safeguards, encrypts, and processes personal and financial data in accordance with international data protection frameworks.
          </p>

          <div class="flex flex-wrap justify-center items-center gap-4 text-xs text-teal-300/80 pt-2">
            <span><strong>Effective Date:</strong> October 1, 2026</span>
            <span>&bull;</span>
            <span><strong>Standard:</strong> ISO/IEC 27001 &bull; SOC 2 Type II Certified</span>
          </div>
        </div>
      </section>

      <!-- MAIN CONTENT -->
      <section class="max-w-6xl mx-auto px-5 sm:px-8 py-12 lg:py-16">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- SIDEBAR -->
          <div class="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-100">
                Navigation
              </h3>
              <nav class="space-y-1.5 text-xs font-medium text-slate-600">
                <a href="#priv-1" class="block py-1.5 px-2.5 rounded-lg hover:text-[#003432] hover:bg-slate-100 transition">1. Scope &amp; Legal Framework</a>
                <a href="#priv-2" class="block py-1.5 px-2.5 rounded-lg hover:text-[#003432] hover:bg-slate-100 transition">2. Information We Collect</a>
                <a href="#priv-3" class="block py-1.5 px-2.5 rounded-lg hover:text-[#003432] hover:bg-slate-100 transition">3. How Information Is Utilized</a>
                <a href="#priv-4" class="block py-1.5 px-2.5 rounded-lg hover:text-[#003432] hover:bg-slate-100 transition">4. Information Sharing &amp; Disclosures</a>
                <a href="#priv-5" class="block py-1.5 px-2.5 rounded-lg hover:text-[#003432] hover:bg-slate-100 transition">5. Cryptographic Security Standards</a>
                <a href="#priv-6" class="block py-1.5 px-2.5 rounded-lg hover:text-[#003432] hover:bg-slate-100 transition">6. Data Subject Rights &amp; Access</a>
                <a href="#priv-7" class="block py-1.5 px-2.5 rounded-lg hover:text-[#003432] hover:bg-slate-100 transition">7. Cookie &amp; Telemetry Notice</a>
                <a href="#priv-8" class="block py-1.5 px-2.5 rounded-lg hover:text-[#003432] hover:bg-slate-100 transition">8. DPO Contact &amp; Inquiries</a>
              </nav>

              <div class="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <a routerLink="/terms" class="flex items-center justify-between text-xs font-semibold text-teal-700 hover:text-teal-900 transition">
                  <span>Terms &amp; Conditions &rarr;</span>
                  <span class="text-[10px] bg-teal-50 px-2 py-0.5 rounded text-teal-800">Master Terms</span>
                </a>
              </div>
            </div>
          </div>

          <!-- CONTENT -->
          <div class="lg:col-span-8 space-y-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
            
            <article id="priv-1" class="space-y-3">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                1. Scope &amp; Legal Framework
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                This Privacy Notice applies to all customer data processed by <strong>{{ systemSettings.siteName() }}</strong> across our digital banking application, treasury management systems, client portals, and physical operations. We adhere strictly to the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, the European Union GDPR (Regulation 2016/679), and the Gramm-Leach-Bliley Act (GLBA) Financial Privacy Rule.
              </p>
            </article>

            <article id="priv-2" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                2. Information We Collect
              </h2>
              <div class="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>We collect and process the following categories of information:</p>
                <ul class="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>Identity Information:</strong> Full legal name, date of birth, nationality, government identification document (passport, national ID, or driver’s license), and live biometric facial verification captures.</li>
                  <li><strong>Contact Details:</strong> Residential address, primary telephone number, registered email address, and designated emergency verification protocols.</li>
                  <li><strong>Financial &amp; Tax Data:</strong> Source of wealth declarations, employment details, annual earnings, tax identification numbers (TIN/SSN/UTR), account balances, and transaction ledgers.</li>
                  <li><strong>Technical &amp; Telemetry Data:</strong> IP addresses, browser fingerprint, device hardware identifiers, geolocation, and encrypted audit trail timestamps.</li>
                </ul>
              </div>
            </article>

            <article id="priv-3" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                3. Purpose &amp; Lawful Basis of Processing
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                We process your personal information under several legal grounds: (a) <strong>Contractual Necessity:</strong> To provide core banking services, execute wire transfers, and maintain deposit ledgers; (b) <strong>Legal Obligation:</strong> To fulfill Anti-Money Laundering (AML), Counter-Terrorist Financing (CTF), and tax reporting statutory mandates; (c) <strong>Legitimate Interests:</strong> To detect and prevent fraudulent transactions, protect customer balances, and secure digital infrastructure.
              </p>
            </article>

            <article id="priv-4" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                4. Information Sharing &amp; Third Parties
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                {{ systemSettings.siteName() }} does not sell, rent, or monetize consumer financial data. We share information only with: (a) Correspondent clearing banks and financial messaging networks (e.g. SWIFT, Fedwire, CHAPS) necessary to execute customer payments; (b) Regulatory authorities, central banks, and law enforcement agencies when mandated by court order or statutory requirement; (c) Trusted SOC-2 certified infrastructure and cloud hosting providers under strict contractual data protection agreements.
              </p>
            </article>

            <article id="priv-5" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                5. Cryptographic Security Standards
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                All customer data in transit is protected using TLS 1.3 protocol with AES-256 bit encryption and Perfect Forward Secrecy. Data at rest is encrypted using FIPS 140-2 validated cryptographic modules. Multi-tier authentication credentials and transaction security PINs are hashed using cryptographic salt algorithms (bcrypt) and are mathematically irreversible.
              </p>
            </article>

            <article id="priv-6" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                6. Data Retention &amp; Customer Rights
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                Pursuant to international banking regulations and financial record-keeping laws, transactional records are retained for seven (7) years following account closure. Subject to applicable laws, you possess the right to request access to your personal data, seek rectification of erroneous information, and request data portability.
              </p>
            </article>

            <article id="priv-7" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                7. Cookies &amp; Session Controls
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                Our digital portal utilizes strictly necessary security cookies and local cryptographic storage to authenticate sessions, detect concurrent device logins, and protect accounts against Cross-Site Request Forgery (CSRF). We do not deploy third-party advertising tracking beacons within authenticated banking environments.
              </p>
            </article>

            <article id="priv-8" class="space-y-3 pt-2">
              <h2 class="text-lg font-black text-[#003432] tracking-tight border-b border-slate-100 pb-2">
                8. Data Protection Officer (DPO) Contact
              </h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                For questions regarding this Privacy Policy or to exercise statutory privacy rights, contact our Data Protection Officer at:
              </p>
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono space-y-1">
                <div class="font-bold text-[#003432]">{{ systemSettings.siteName() }} Office of the Data Protection Officer</div>
                <div>Address: {{ systemSettings.address() }}</div>
                <div>Email: {{ systemSettings.adminEmail() }}</div>
                <div>Regulatory Inquiries: {{ systemSettings.contactEmail() }}</div>
              </div>
            </article>

          </div>
        </div>
      </section>

    </div>
  `
})
export class PrivacyComponent {
  systemSettings = inject(SystemSettingsService);
}
