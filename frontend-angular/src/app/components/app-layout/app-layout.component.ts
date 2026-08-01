import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AppSidebarComponent } from '../app-sidebar/app-sidebar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, AppSidebarComponent],
  template: `
    <div class="flex min-h-screen w-full bg-background selection:bg-primary/10">
      <!-- Collapsible Sidebar -->
      <app-sidebar [collapsed]="collapsed"></app-sidebar>

      <div class="flex min-h-screen flex-1 flex-col">
        <!-- Sticky Header -->
        <header class="sticky top-0 z-30 h-16 bg-[#09090b] text-white border-b border-zinc-800/80 flex items-center px-4 md:px-8 shadow-md">
          <button
            (click)="toggleCollapsed()"
            class="mr-4 inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-white/10 transition-all active:scale-95 text-white/80 hover:text-white"
            aria-label="Colapsar menú"
          >
            <lucide-icon name="menu" class="h-5 w-5"></lucide-icon>
          </button>

          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <lucide-icon name="building-2" class="h-6 w-6 text-white"></lucide-icon>
            </div>
            <div class="leading-tight">
              <div class="text-lg font-extrabold tracking-tight text-white uppercase">Consultores 2026</div>
              <div class="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hidden sm:block">
                Sistema Estratégico de Administración
              </div>
            </div>
          </div>

          <div class="ml-auto flex items-center gap-4 md:gap-8">
            <div class="hidden lg:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 text-xs font-semibold text-zinc-300 border border-white/10">
              <lucide-icon name="calendar-days" class="h-3.5 w-3.5 text-primary"></lucide-icon>
              <span class="capitalize">{{ today }}</span>
            </div>
            
            <div class="flex items-center gap-3 pl-4 border-l border-zinc-800" *ngIf="user">
              <div class="text-right leading-tight hidden sm:block">
                <div class="text-sm font-bold text-white">{{ user.name }}</div>
                <div class="text-[10px] font-bold uppercase text-primary tracking-widest">{{ user.role }}</div>
              </div>
              <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover text-white font-bold flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform cursor-pointer">
                {{ user.name.charAt(0) }}
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="flex-1 p-4 md:p-8 lg:p-10 max-w-[1800px] w-full mx-auto page-fade-in">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AppLayoutComponent implements OnInit {
  collapsed = false;
  today = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.today = new Intl.DateTimeFormat('es-VE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date());
  }

  get user() {
    return this.authService.user;
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }
}
