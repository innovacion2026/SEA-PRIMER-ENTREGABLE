import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { 
  Building2, FileText, CheckCircle, Clock, Lock, User, Banknote, 
  FileCheck, LogOut, Bell, CreditCard, Receipt, ShieldCheck, 
  TrendingUp, Wallet, Eye, Download, Plus, X, ChevronRight, LayoutDashboard,
  Shield, Check, MessageSquare, AlertCircle
} from 'lucide-angular';

const icons = {
  Building2, FileText, CheckCircle, Clock, Lock, User, Banknote, 
  FileCheck, LogOut, Bell, CreditCard, Receipt, ShieldCheck, 
  TrendingUp, Wallet, Eye, Download, Plus, X, ChevronRight, LayoutDashboard,
  Shield, Check, MessageSquare, AlertCircle
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider(icons)
    }
  ]
};
