import { Routes } from '@angular/router';
import { authGuard, adminGuard, pinStageGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public Marketing Portal Routes
  {
    path: '',
    loadComponent: () => import('./features/public/layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/public/pages/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'checking',
        loadComponent: () => import('./features/public/pages/checking.component').then(m => m.CheckingComponent)
      },
      {
        path: 'savings',
        loadComponent: () => import('./features/public/pages/savings.component').then(m => m.SavingsComponent)
      },
      {
        path: 'cards',
        loadComponent: () => import('./features/public/pages/cards-public.component').then(m => m.PublicCardsComponent)
      },
      {
        path: 'loans',
        loadComponent: () => import('./features/public/pages/loans.component').then(m => m.LoansComponent)
      },
      {
        path: 'security',
        loadComponent: () => import('./features/public/pages/security.component').then(m => m.SecurityComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./features/public/pages/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./features/public/pages/services.component').then(m => m.ServicesComponent)
      },
      {
        path: 'calculator',
        loadComponent: () => import('./features/public/pages/calculator.component').then(m => m.LoanCalculatorComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/public/pages/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'terms',
        loadComponent: () => import('./features/public/pages/terms.component').then(m => m.TermsComponent)
      },
      {
        path: 'privacy',
        loadComponent: () => import('./features/public/pages/privacy.component').then(m => m.PrivacyComponent)
      }
    ]
  },

  // Authentication Flows
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'pin',
    canActivate: [pinStageGuard],
    loadComponent: () => import('./features/auth/pages/pin.component').then(m => m.PinComponent)
  },
  {
    path: 'open-account',
    loadComponent: () => import('./features/auth/pages/open-account.component').then(m => m.OpenAccountComponent)
  },

  // Authenticated E-Banking Dashboard (Protected by AuthGuard)
  {
    path: 'e-banking',
    canActivate: [authGuard],
    loadComponent: () => import('./features/e-banking/layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        loadComponent: () => import('./features/e-banking/pages/overview/overview.component').then(m => m.OverviewComponent)
      },
      {
        path: 'deposit',
        loadComponent: () => import('./features/e-banking/pages/deposit/deposit.component').then(m => m.DepositComponent)
      },
      {
        path: 'fund-transfer',
        loadComponent: () => import('./features/e-banking/pages/fund-transfer/fund-transfer.component').then(m => m.FundTransferComponent)
      },
      {
        path: 'wallets',
        loadComponent: () => import('./features/e-banking/pages/wallets/wallets.component').then(m => m.WalletsComponent)
      },
      {
        path: 'statement',
        loadComponent: () => import('./features/e-banking/pages/statement/statement.component').then(m => m.StatementComponent)
      },
      {
        path: 'beneficiaries',
        loadComponent: () => import('./features/e-banking/pages/beneficiaries/beneficiaries.component').then(m => m.BeneficiariesComponent)
      },
      {
        path: 'cards',
        loadComponent: () => import('./features/e-banking/pages/cards/cards.component').then(m => m.CardsComponent)
      },
      {
        path: 'loans',
        loadComponent: () => import('./features/e-banking/pages/loans/loans.component').then(m => m.LoansComponent)
      },
      {
        path: 'withdrawals',
        loadComponent: () => import('./features/e-banking/pages/withdrawals/withdrawals.component').then(m => m.WithdrawalsComponent)
      },
      {
        path: 'investments',
        loadComponent: () => import('./features/e-banking/pages/investments/investments.component').then(m => m.InvestmentsComponent)
      },
      {
        path: 'copy-trading',
        loadComponent: () => import('./features/e-banking/pages/copy-trading/copy-trading.component').then(m => m.CopyTradingComponent)
      },
      {
        path: 'grants',
        loadComponent: () => import('./features/e-banking/pages/grants/grants.component').then(m => m.GrantsComponent)
      },
      {
        path: 'tax-refund',
        loadComponent: () => import('./features/e-banking/pages/tax-refund/tax-refund.component').then(m => m.TaxRefundComponent)
      },
      {
        path: 'academy',
        loadComponent: () => import('./features/e-banking/pages/academy/academy.component').then(m => m.AcademyComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/e-banking/pages/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'support',
        loadComponent: () => import('./features/e-banking/pages/support/support.component').then(m => m.SupportComponent)
      }
    ]
  },

  // Master Admin Control Center (Protected by AdminGuard)
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/pages/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'deposits',
        loadComponent: () => import('./features/admin/pages/admin-deposits.component').then(m => m.AdminDepositsComponent)
      },
      {
        path: 'withdrawals',
        loadComponent: () => import('./features/admin/pages/admin-withdrawals.component').then(m => m.AdminWithdrawalsComponent)
      },
      {
        path: 'loans',
        loadComponent: () => import('./features/admin/pages/admin-loans.component').then(m => m.AdminLoansComponent)
      },
      {
        path: 'grants',
        loadComponent: () => import('./features/admin/pages/admin-grants.component').then(m => m.AdminGrantsComponent)
      },
      {
        path: 'tax',
        loadComponent: () => import('./features/admin/pages/admin-tax.component').then(m => m.AdminTaxComponent)
      },
      {
        path: 'investments',
        loadComponent: () => import('./features/admin/pages/admin-investments.component').then(m => m.AdminInvestmentsComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/pages/admin-users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'rates',
        loadComponent: () => import('./features/admin/pages/admin-rates.component').then(m => m.AdminRatesComponent)
      },
      {
        path: 'support',
        loadComponent: () => import('./features/admin/pages/admin-support.component').then(m => m.AdminSupportComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/pages/admin-settings.component').then(m => m.AdminSettingsComponent)
      }
    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: ''
  }
];
