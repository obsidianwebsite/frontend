import { Injectable, inject, signal } from '@angular/core';
import { SystemSettingsService } from './system-settings.service';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: any;
    $crisp?: any;
    CRISP_WEBSITE_ID?: string;
    tidioChatApi?: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LiveChatService {
  private systemSettings = inject(SystemSettingsService);

  isScriptLoaded = signal<boolean>(false);
  activeProvider = signal<string>('TAWK_TO');

  /**
   * Initializes third-party livechat inside the authenticated user dashboard.
   */
  initDashboardLiveChat(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const enabled = this.systemSettings.livechatEnabled();
    if (!enabled) return;

    const provider = this.systemSettings.livechatProvider();
    const widgetId = this.systemSettings.livechatWidgetId();
    const customScript = this.systemSettings.livechatCustomScript();

    this.activeProvider.set(provider);

    // Prevent duplicate script injection
    if (document.getElementById('otb-thirdparty-livechat')) {
      this.isScriptLoaded.set(true);
      return;
    }

    try {
      if (provider === 'TAWK_TO' && widgetId) {
        // Tawk.to direct integration
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();
        const s = document.createElement('script');
        s.id = 'otb-thirdparty-livechat';
        s.async = true;
        // Format: propertyId/widgetId or direct embed URL
        const cleanId = widgetId.trim();
        s.src = cleanId.startsWith('http') ? cleanId : `https://embed.tawk.to/${cleanId}`;
        s.charset = 'UTF-8';
        s.setAttribute('crossorigin', '*');
        s.onload = () => this.isScriptLoaded.set(true);
        document.body.appendChild(s);
      } else if (provider === 'CRISP' && widgetId) {
        // Crisp direct integration
        window.$crisp = [];
        window.CRISP_WEBSITE_ID = widgetId.trim();
        const s = document.createElement('script');
        s.id = 'otb-thirdparty-livechat';
        s.src = 'https://client.crisp.chat/l.js';
        s.async = true;
        s.onload = () => this.isScriptLoaded.set(true);
        document.head.appendChild(s);
      } else if (provider === 'TIDIO' && widgetId) {
        // Tidio direct integration
        const s = document.createElement('script');
        s.id = 'otb-thirdparty-livechat';
        s.src = `//code.tidio.co/${widgetId.trim()}.js`;
        s.async = true;
        s.onload = () => this.isScriptLoaded.set(true);
        document.body.appendChild(s);
      } else if (provider === 'CUSTOM' && customScript) {
        // Custom third-party script embed
        const container = document.createElement('div');
        container.id = 'otb-thirdparty-livechat';
        container.innerHTML = customScript;
        const scriptTags = container.getElementsByTagName('script');
        for (let i = 0; i < scriptTags.length; i++) {
          const original = scriptTags[i];
          const execScript = document.createElement('script');
          if (original.src) {
            execScript.src = original.src;
            execScript.async = true;
          } else {
            execScript.textContent = original.textContent;
          }
          document.body.appendChild(execScript);
        }
        this.isScriptLoaded.set(true);
      }
    } catch (err) {
      console.warn('LiveChat initialization note:', err);
    }
  }

  /**
   * Programmatically open or maximize the active third-party livechat widget
   */
  openLiveChat(): boolean {
    try {
      if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
        window.Tawk_API.maximize();
        return true;
      }
      if (window.$crisp && typeof window.$crisp.push === 'function') {
        window.$crisp.push(['do', 'chat:open']);
        return true;
      }
      if (window.tidioChatApi && typeof window.tidioChatApi.open === 'function') {
        window.tidioChatApi.open();
        return true;
      }
    } catch {
      // Fallback
    }
    return false;
  }
}
