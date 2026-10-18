import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface TourStep {
  id: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  icon: string;
  directionBadge: string;
  directionArrow: 'left' | 'down' | 'right' | 'up';
  description: string;
  quickTip?: string;
  targetRoute?: string;
  targetButtonText?: string;
  tourTargetId: string;
}

const USER_TOUR_STEPS: TourStep[] = [
  {
    id: 'user_overview',
    stepNumber: 1,
    totalSteps: 5,
    title: 'Your Account Balances',
    icon: '💰',
    directionBadge: 'LOOK AT MAIN SCREEN 👇',
    directionArrow: 'down',
    description: 'This is where you see all your money. Your checking account and savings balances are clearly displayed right here in front of you.',
    quickTip: 'Tip: You can easily copy your account number anytime by clicking "Copy" under your name at the top left.',
    targetRoute: '/e-banking/overview',
    targetButtonText: 'View Balances',
    tourTargetId: 'overview'
  },
  {
    id: 'user_transfers',
    stepNumber: 2,
    totalSteps: 5,
    title: 'Send Money to Anyone',
    icon: '✈️',
    directionBadge: 'LOOK AT LEFT MENU 👈',
    directionArrow: 'left',
    description: 'Need to send money? Look at the left sidebar and click "Transfer Funds & Wires". You can send money to other banks or other members in seconds.',
    quickTip: 'Tip: You can save regular recipients so you do not have to type their details every time.',
    targetRoute: '/e-banking/fund-transfer',
    targetButtonText: 'Go to Send Money',
    tourTargetId: 'transfers'
  },
  {
    id: 'user_deposits',
    stepNumber: 3,
    totalSteps: 5,
    title: 'Add Money to Your Account',
    icon: '📥',
    directionBadge: 'LOOK AT LEFT MENU 👈',
    directionArrow: 'left',
    description: 'Whenever you want to add funds into your account or deposit a check, click "Deposit Funds" on the left menu.',
    quickTip: 'Tip: Once submitted, your deposit is reviewed quickly by the banking desk and credited to your balance.',
    targetRoute: '/e-banking/deposit',
    targetButtonText: 'Go to Deposit Funds',
    tourTargetId: 'deposits'
  },
  {
    id: 'user_cards',
    stepNumber: 4,
    totalSteps: 5,
    title: 'Your Debit & Payment Cards',
    icon: '💳',
    directionBadge: 'LOOK AT LEFT MENU 👈',
    directionArrow: 'left',
    description: 'Look at the left menu and click "Payment Cards". Here you can see your card details, view your CVV, or freeze your card with 1 click if misplaced.',
    quickTip: 'Tip: Freezing your card is instant and can be unfrozen anytime you want.',
    targetRoute: '/e-banking/cards',
    targetButtonText: 'Manage My Cards',
    tourTargetId: 'cards'
  },
  {
    id: 'user_support',
    stepNumber: 5,
    totalSteps: 5,
    title: 'Get Help Anytime',
    icon: '💬',
    directionBadge: 'LOOK AT LEFT MENU OR BOTTOM RIGHT 👈',
    directionArrow: 'left',
    description: 'Have a question? Click "Support & Disputes" on the left to message us, or click the friendly VaultBot bubble at the bottom right to chat with your AI banking assistant.',
    quickTip: 'Tip: You can ask VaultBot anything from "How do I wire money?" to "What is my routing number?".',
    targetRoute: '/e-banking/support',
    targetButtonText: 'Open Support Desk',
    tourTargetId: 'support'
  }
];

const ADMIN_TOUR_STEPS: TourStep[] = [
  {
    id: 'admin_overview',
    stepNumber: 1,
    totalSteps: 5,
    title: 'Bank Overview & Metrics',
    icon: '📊',
    directionBadge: 'LOOK AT MAIN SCREEN 👇',
    directionArrow: 'down',
    description: 'Welcome to your Admin Operations Console! This dashboard gives you a live summary of total customer deposits, active accounts, and today\'s transactions.',
    quickTip: 'Tip: All platform metrics update in real-time as users deposit and transfer money.',
    targetRoute: '/admin/dashboard',
    targetButtonText: 'View Dashboard',
    tourTargetId: 'admin-overview'
  },
  {
    id: 'admin_users',
    stepNumber: 2,
    totalSteps: 5,
    title: 'Manage Customer Accounts',
    icon: '👥',
    directionBadge: 'LOOK AT LEFT MENU 👈',
    directionArrow: 'left',
    description: 'Click "Customer Accounts" on the left menu. Here you can search all registered clients, adjust their balances, approve new signups, or log in as any user to test.',
    quickTip: 'Tip: Clicking "Log In as User" lets you see the exact dashboard view that the customer sees.',
    targetRoute: '/admin/users',
    targetButtonText: 'Open Customer Accounts',
    tourTargetId: 'admin-users'
  },
  {
    id: 'admin_approvals',
    stepNumber: 3,
    totalSteps: 5,
    title: 'Approve Deposits & Loans',
    icon: '✅',
    directionBadge: 'LOOK AT LEFT MENU 👈',
    directionArrow: 'left',
    description: 'Look at "Approval Queues" on the left menu. Click "Deposit Approvals" or "Loan Applications" to review customer submissions and approve or decline with one click.',
    quickTip: 'Tip: When you approve a deposit, the user receives an instant email alert and their balance updates immediately.',
    targetRoute: '/admin/deposits',
    targetButtonText: 'View Deposit Approvals',
    tourTargetId: 'admin-deposits'
  },
  {
    id: 'admin_support',
    stepNumber: 4,
    totalSteps: 5,
    title: 'Customer Support Desk',
    icon: '✉️',
    directionBadge: 'LOOK AT LEFT MENU 👈',
    directionArrow: 'left',
    description: 'Click "Support Desk" on the left to read help requests from customers. You can reply directly to their questions and send custom official bank emails.',
    quickTip: 'Tip: Outgoing emails can use pre-made letterheads like KYC Verification or Wire Clearance.',
    targetRoute: '/admin/support',
    targetButtonText: 'Open Support Desk',
    tourTargetId: 'admin-support'
  },
  {
    id: 'admin_settings',
    stepNumber: 5,
    totalSteps: 5,
    title: 'Change Bank Logo & Name',
    icon: '🎨',
    directionBadge: 'LOOK AT LEFT MENU 👈',
    directionArrow: 'left',
    description: 'Click "Setup & Branding" on the left menu. You can easily change the bank name, upload a custom logo, and update your phone number and address anytime.',
    quickTip: 'Tip: Any branding changes you save update across the public website and mobile portal instantly.',
    targetRoute: '/admin/settings',
    targetButtonText: 'Open Setup & Branding',
    tourTargetId: 'admin-settings'
  }
];

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private router = inject(Router);

  isOpen = signal<boolean>(false);
  currentTourType = signal<'user' | 'admin' | null>(null);
  currentStepIndex = signal<number>(0);
  steps = signal<TourStep[]>([]);

  currentStep = computed(() => {
    const list = this.steps();
    const idx = this.currentStepIndex();
    return list[idx] || null;
  });

  currentTourTargetId = computed(() => {
    return this.currentStep()?.tourTargetId || '';
  });

  isFirstStep = computed(() => {
    return this.currentStepIndex() === 0;
  });

  isLastStep = computed(() => {
    return this.currentStepIndex() === this.steps().length - 1;
  });

  progressPercent = computed(() => {
    if (this.steps().length === 0) return 0;
    return Math.round(((this.currentStepIndex() + 1) / this.steps().length) * 100);
  });

  startUserTour(force: boolean = false): void {
    if (!force && typeof window !== 'undefined' && localStorage.getItem('vault_user_tour_completed') === 'true') {
      return;
    }
    this.currentTourType.set('user');
    this.steps.set(USER_TOUR_STEPS);
    this.currentStepIndex.set(0);
    this.isOpen.set(true);
  }

  startAdminTour(force: boolean = false): void {
    if (!force && typeof window !== 'undefined' && localStorage.getItem('vault_admin_tour_completed') === 'true') {
      return;
    }
    this.currentTourType.set('admin');
    this.steps.set(ADMIN_TOUR_STEPS);
    this.currentStepIndex.set(0);
    this.isOpen.set(true);
  }

  nextStep(): void {
    if (this.isLastStep()) {
      this.completeTour();
    } else {
      this.currentStepIndex.update(i => i + 1);
    }
  }

  prevStep(): void {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.update(i => i - 1);
    }
  }

  goToStep(index: number): void {
    if (index >= 0 && index < this.steps().length) {
      this.currentStepIndex.set(index);
    }
  }

  navigateToCurrentTarget(): void {
    const step = this.currentStep();
    if (step && step.targetRoute) {
      this.router.navigateByUrl(step.targetRoute);
    }
  }

  skipTour(): void {
    this.markCompleted();
    this.isOpen.set(false);
  }

  completeTour(): void {
    this.markCompleted();
    this.isOpen.set(false);
  }

  private markCompleted(): void {
    if (typeof window !== 'undefined') {
      const type = this.currentTourType();
      if (type === 'user') {
        localStorage.setItem('vault_user_tour_completed', 'true');
      } else if (type === 'admin') {
        localStorage.setItem('vault_admin_tour_completed', 'true');
      }
    }
  }

  resetTours(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vault_user_tour_completed');
      localStorage.removeItem('vault_admin_tour_completed');
    }
  }
}
