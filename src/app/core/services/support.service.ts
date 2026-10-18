import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SupportTicket {
  id: string;
  user_id: string;
  ticket_number: string;
  subject: string;
  department: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'AWAITING_USER' | 'RESOLVED' | 'CLOSED';
  created_at: string;
  updated_at: string;
  latest_message?: string;
  latest_message_time?: string;
  latest_sender_role?: 'USER' | 'ADMIN' | 'BOT';
  message_count?: number;
  unread_admin_replies?: number;
  unread_user_messages?: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_account_number?: string;
  customer_balance?: string;
  customer_currency?: string;
  customer_kyc_status?: string;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_role: 'USER' | 'ADMIN' | 'BOT';
  sender_name: string;
  message: string;
  attachments?: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatbotSuggestedAction {
  label: string;
  link: string;
}

export interface ChatbotResponse {
  reply: string;
  category: string;
  suggestedActions: ChatbotSuggestedAction[];
  canEscalateToHuman: boolean;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private http = inject(HttpClient);

  // --- Customer Endpoints ---
  listUserTickets(): Observable<{ success: boolean; data: SupportTicket[] }> {
    return this.http.get<{ success: boolean; data: SupportTicket[] }>('/api/v1/support/tickets');
  }

  createTicket(payload: {
    subject: string;
    department: string;
    priority: string;
    message: string;
  }): Observable<any> {
    return this.http.post('/api/v1/support/tickets', payload);
  }

  sendSupportEmailToAdmin(payload: {
    subject: string;
    department: string;
    priority: string;
    message: string;
  }): Observable<any> {
    return this.http.post('/api/v1/support/email-admin', payload);
  }

  getTicketDetails(id: string): Observable<{
    success: boolean;
    data: {
      ticket: SupportTicket;
      messages: SupportMessage[];
    };
  }> {
    return this.http.get<{
      success: boolean;
      data: {
        ticket: SupportTicket;
        messages: SupportMessage[];
      };
    }>(`/api/v1/support/tickets/${id}`);
  }

  sendTicketMessage(id: string, message: string): Observable<any> {
    return this.http.post(`/api/v1/support/tickets/${id}/messages`, { message });
  }

  closeTicket(id: string): Observable<any> {
    return this.http.patch(`/api/v1/support/tickets/${id}/close`, {});
  }

  chatbotQuery(query: string): Observable<{ success: boolean; data: ChatbotResponse }> {
    return this.http.post<{ success: boolean; data: ChatbotResponse }>('/api/v1/support/chatbot', { query });
  }

  // --- Admin Endpoints ---
  listAdminTickets(status?: string, search?: string): Observable<{ success: boolean; data: SupportTicket[] }> {
    let params: any = {};
    if (status) params.status = status;
    if (search) params.search = search;
    return this.http.get<{ success: boolean; data: SupportTicket[] }>('/api/v1/admin/support/tickets', { params });
  }

  getAdminTicketDetails(id: string): Observable<{
    success: boolean;
    data: {
      ticket: SupportTicket;
      messages: SupportMessage[];
    };
  }> {
    return this.http.get<{
      success: boolean;
      data: {
        ticket: SupportTicket;
        messages: SupportMessage[];
      };
    }>(`/api/v1/admin/support/tickets/${id}`);
  }

  replyAdminTicket(id: string, message: string, status: string = 'IN_PROGRESS'): Observable<any> {
    return this.http.post(`/api/v1/admin/support/tickets/${id}/reply`, { message, status });
  }

  updateAdminTicketStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`/api/v1/admin/support/tickets/${id}/status`, { status });
  }
}
