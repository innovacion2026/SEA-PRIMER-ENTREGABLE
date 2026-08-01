import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-portal-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-[#020617] text-slate-100 flex flex-col">
      
      <!-- Top Bar -->
      <header class="sticky top-0 z-40 h-16 bg-[#09090b] border-b border-zinc-800 flex items-center justify-between px-4 sm:px-8 shadow-md">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
            <lucide-icon name="shield-check" class="h-6 w-6 text-white"></lucide-icon>
          </div>
          <div>
            <div class="text-lg font-black tracking-tight text-white uppercase">SEA PROVEEDORES</div>
            <div class="text-[9px] font-bold uppercase tracking-widest text-blue-400 hidden sm:block">
              Portal Autogestionable Banco
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="hidden md:flex flex-col text-right leading-tight">
            <span class="text-sm font-bold text-white">Distribuidora Andina C.A.</span>
            <span class="text-[10px] font-mono text-slate-400 font-bold">RIF: J-30123456-7 · PROVEEDOR ACTIVO</span>
          </div>
          <button (click)="logout()" class="h-9 px-3 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors" title="Cerrar sesión">
            <lucide-icon name="log-out" class="h-4 w-4 text-red-400"></lucide-icon>
            <span class="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      <div class="flex flex-1">
        <!-- Sidebar -->
        <aside class="w-64 bg-[#09090b] border-r border-zinc-800 p-4 space-y-1 hidden md:block">
          <div class="text-[10px] uppercase font-bold tracking-widest text-slate-500 px-3 mb-2">Consultas Principales</div>
          
          <a routerLink="/app/dashboard" routerLinkActive="bg-blue-600 text-white font-bold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-zinc-800 transition-colors">
            <lucide-icon name="layout-dashboard" class="h-4 w-4"></lucide-icon>
            Resumen General
          </a>

          <a routerLink="/app/perfil" routerLinkActive="bg-blue-600 text-white font-bold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-zinc-800 transition-colors">
            <lucide-icon name="building-2" class="h-4 w-4"></lucide-icon>
            Mi Perfil & Cuentas
          </a>

          <a routerLink="/app/documentos" routerLinkActive="bg-blue-600 text-white font-bold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-zinc-800 transition-colors">
            <lucide-icon name="file-text" class="h-4 w-4 text-blue-400"></lucide-icon>
            Documentos & Recaudos
          </a>

          <a routerLink="/app/ordenes" routerLinkActive="bg-blue-600 text-white font-bold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-zinc-800 transition-colors">
            <lucide-icon name="file-check" class="h-4 w-4"></lucide-icon>
            Órdenes de Compra
          </a>

          <a routerLink="/app/contratos" routerLinkActive="bg-blue-600 text-white font-bold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-zinc-800 transition-colors">
            <lucide-icon name="shield-check" class="h-4 w-4 text-emerald-400"></lucide-icon>
            Contratos & Términos
          </a>

          <a routerLink="/app/facturas" routerLinkActive="bg-blue-600 text-white font-bold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-zinc-800 transition-colors">
            <lucide-icon name="receipt" class="h-4 w-4"></lucide-icon>
            Relación de Facturas (CXP)
          </a>

          <a routerLink="/app/pagos" routerLinkActive="bg-blue-600 text-white font-bold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-zinc-800 transition-colors">
            <lucide-icon name="credit-card" class="h-4 w-4"></lucide-icon>
            Relación de Pagos
          </a>

          <a routerLink="/app/retenciones" routerLinkActive="bg-blue-600 text-white font-bold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-zinc-800 transition-colors">
            <lucide-icon name="file-text" class="h-4 w-4"></lucide-icon>
            Comprobantes Retención
          </a>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <router-outlet></router-outlet>
        </main>
      </div>

    </div>
  `
})
export class PortalLayoutComponent {
  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/login']);
  }
}
