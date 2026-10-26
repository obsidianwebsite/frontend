import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface SystemSettings {
  id?: string;
  site_name: string;
  site_tagline: string;
  site_logo_url?: string;
  site_favicon_url?: string;
  contact_email: string;
  admin_notification_email: string;
  phone_number: string;
  address: string;
  swift_code: string;
  routing_number: string;
  currency_code: string;
  currency_symbol: string;
  about_summary?: string;
  copyright_text: string;
  support_hours: string;
  is_setup_completed: boolean | number;
  updated_at?: string;
}

const DEFAULT_SETTINGS: SystemSettings = {
  id: 'main_settings',
  site_name: 'Obsidian Trust Bancorp Plc',
  site_tagline: 'Commercial Banking & Institutional Treasury',
  site_logo_url: '',
  site_favicon_url: '',
  contact_email: 'support@obsidiantrustbancorp.com',
  admin_notification_email: 'admin@obsidiantrustbancorp.com',
  phone_number: '+44 20 7946 0912',
  address: '12 Bridlesmith Walk, Nottingham, NG1 2HB, United Kingdom',
  swift_code: 'OTBCGB2L',
  routing_number: '026009593',
  currency_code: 'USD',
  currency_symbol: '$',
  about_summary: 'Obsidian Trust Bancorp Plc is an authorized and regulated British-Atlantic commercial banking and institutional treasury corporation providing private wealth management, corporate escrow, multi-currency clearing, and structured capital facilities.',
  copyright_text: '© 2026 Obsidian Trust Bancorp Plc. Authorized & Regulated Commercial Banking Institution.',
  support_hours: '24/7 Global Treasury Support Desk',
  is_setup_completed: true
};

@Injectable({
  providedIn: 'root'
})
export class SystemSettingsService {
  private http = inject(HttpClient);

  // Core reactive signals
  settings = signal<SystemSettings>(DEFAULT_SETTINGS);
  loading = signal<boolean>(false);

  // Computed convenient accessors
  siteName = computed(() => this.settings().site_name || 'Obsidian Trust Bancorp Plc');
  siteTagline = computed(() => this.settings().site_tagline || 'Commercial Banking & Institutional Treasury');
  siteLogoUrl = computed(() => this.settings().site_logo_url || '');
  contactEmail = computed(() => this.settings().contact_email || 'support@obsidiantrustbancorp.com');
  adminEmail = computed(() => this.settings().admin_notification_email || 'admin@obsidiantrustbancorp.com');
  phoneNumber = computed(() => this.settings().phone_number || '+44 20 7946 0912');
  address = computed(() => this.settings().address || '12 Bridlesmith Walk, Nottingham, NG1 2HB, United Kingdom');
  swiftCode = computed(() => this.settings().swift_code || 'OTBCGB2L');
  routingNumber = computed(() => this.settings().routing_number || '026009593');
  currencySymbol = computed(() => this.settings().currency_symbol || '$');
  currencyCode = computed(() => this.settings().currency_code || 'USD');
  copyrightText = computed(() => this.settings().copyright_text || `© 2026 ${this.siteName()}. All rights reserved.`);

  constructor() {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading.set(true);
    this.http.get<{ success: boolean; data: SystemSettings }>('/api/v1/system/settings').subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.data) {
          this.settings.set({
            ...DEFAULT_SETTINGS,
            ...res.data
          });
          this.applyBrandingToDom();
        }
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  updateSettings(payload: Partial<SystemSettings>): Observable<{ success: boolean; message: string; data: SystemSettings }> {
    return this.http.put<{ success: boolean; message: string; data: SystemSettings }>(
      '/api/v1/admin/system/settings',
      payload
    ).pipe(
      tap((res) => {
        if (res.data) {
          this.settings.set({
            ...this.settings(),
            ...res.data
          });
          this.applyBrandingToDom();
        }
      })
    );
  }

  private applyBrandingToDom(): void {
    try {
      const s = this.settings();
      if (s.site_favicon_url) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = s.site_favicon_url;
      }
    } catch {
      // DOM access guard
    }
  }
}
