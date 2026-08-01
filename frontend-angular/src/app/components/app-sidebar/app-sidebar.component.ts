import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { menu, MenuNode } from '../../data/menu';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <aside
      [class]="'sticky top-0 z-40 flex h-screen flex-col bg-[#09090b] text-white border-r border-zinc-800/80 transition-all duration-300 shadow-2xl ' + (collapsed ? 'w-20' : 'w-80')"
    >
      <!-- Logo Header -->
      <div [class]="'flex items-center gap-3 border-b border-zinc-800/80 px-6 h-16 ' + (collapsed ? 'justify-center px-0' : '')">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 duration-500 overflow-hidden shrink-0">
          <lucide-icon name="shield-check" class="h-6 w-6"></lucide-icon>
        </div>
        <div class="leading-tight" *ngIf="!collapsed">
          <div class="text-xl font-black tracking-tighter text-white">SEA</div>
          <div class="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-400 whitespace-nowrap">Sistema Estratégico de Administración</div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
        <div *ngFor="let node of menuNodes">
          <!-- Item without children -->
          <a
            *ngIf="!node.children || node.children.length === 0"
            [routerLink]="node.path"
            [routerLinkActive]="['bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/25']"
            [routerLinkActiveOptions]="{ exact: node.path === '/app' }"
            [class]="'group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 text-sidebar-foreground/60 hover:bg-white/5 hover:text-white ' + (collapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : '')"
            [title]="collapsed ? node.title : ''"
          >
            <lucide-icon
              [name]="node.icon"
              [class]="'h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ' + (isPathActive(node.path) ? 'scale-110 text-white' : 'text-sidebar-foreground/60 group-hover:text-white')"
            ></lucide-icon>
            <span class="truncate" *ngIf="!collapsed">{{ node.title }}</span>
          </a>

          <!-- Item with children -->
          <div *ngIf="node.children && node.children.length > 0" class="space-y-1">
            <button
              (click)="toggleMenu(node)"
              [class]="'group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 text-sidebar-foreground/60 hover:bg-white/5 hover:text-white ' + (isPathActive(node.path) ? 'text-white' : '') + ' ' + (collapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : '')"
              [title]="collapsed ? node.title : ''"
            >
              <lucide-icon
                [name]="node.icon"
                [class]="'h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ' + (isPathActive(node.path) ? 'scale-110 text-white' : 'text-sidebar-foreground/60 group-hover:text-white')"
              ></lucide-icon>
              
              <ng-container *ngIf="!collapsed">
                <span class="flex-1 truncate text-left">{{ node.title }}</span>
                <div [class]="'transition-transform duration-300 ' + (isOpen(node) ? 'rotate-180' : '')">
                  <lucide-icon name="chevron-down" class="h-3.5 w-3.5 opacity-50"></lucide-icon>
                </div>
              </ng-container>
            </button>

            <!-- Submenu Items -->
            <div
              *ngIf="!collapsed && isOpen(node)"
              class="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1 animate-in fade-in slide-in-from-left-2 duration-300"
            >
              <a
                *ngFor="let child of node.children"
                [routerLink]="child.path"
                [routerLinkActive]="['bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/25']"
                [class]="'group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 text-sidebar-foreground/60 hover:bg-white/5 hover:text-white'"
              >
                <lucide-icon
                  [name]="child.icon"
                  [class]="'h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ' + (isPathActive(child.path) ? 'scale-110 text-white' : 'text-sidebar-foreground/60 group-hover:text-white')"
                ></lucide-icon>
                <span class="truncate">{{ child.title }}</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <!-- User Active / Logout -->
      <div [class]="'border-t border-sidebar-border p-4 bg-black/20 ' + (collapsed ? 'p-2' : '')">
        <div class="mb-4 px-3 py-3 rounded-xl bg-white/5 border border-white/5" *ngIf="!collapsed && user">
          <div class="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/30 mb-1">Usuario Activo</div>
          <div class="text-sm font-bold truncate text-white">{{ user.name }}</div>
        </div>
        <button
          (click)="logout()"
          [class]="'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all active:scale-95 ' + (collapsed ? 'justify-center px-2' : '')"
          title="Cerrar sesión"
        >
          <lucide-icon name="log-out" class="h-4 w-4"></lucide-icon>
          <span *ngIf="!collapsed">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  `
})
export class AppSidebarComponent implements OnInit {
  @Input() collapsed = false;
  menuNodes = menu;
  currentPath = '';
  openMenus: { [key: string]: boolean } = {};

  constructor(public authService: AuthService, private router: Router) {
    this.currentPath = this.router.url;
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentPath = event.urlAfterRedirects || event.url;
        this.autoOpenActiveMenu();
      });

    this.autoOpenActiveMenu();
  }

  get user() {
    return this.authService.user;
  }

  isPathActive(path: string): boolean {
    if (path === '/app') {
      return this.currentPath === '/app';
    }
    return this.currentPath === path || this.currentPath.startsWith(path + '/');
  }

  toggleMenu(node: MenuNode) {
    this.openMenus[node.title] = !this.openMenus[node.title];
  }

  isOpen(node: MenuNode): boolean {
    return !!this.openMenus[node.title];
  }

  logout() {
    this.authService.logout();
  }

  private autoOpenActiveMenu() {
    for (const node of this.menuNodes) {
      if (node.children) {
        const hasActiveChild = node.children.some(child => this.isPathActive(child.path));
        if (hasActiveChild) {
          this.openMenus[node.title] = true;
        }
      }
    }
  }
}
