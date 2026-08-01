import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { PortalApiService } from '../../services/portal-api.service';

@Component({
  selector: 'app-dashboard-proveedor',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Title -->
      <div>
        <h1 class="text-2xl font-black text-white">Resumen General de Operaciones</h1>
        <p class="text-xs text-slate-400 mt-1">Visión consolidada de facturación, cobranza, ordenes de compra y retenciones fiscales con el banco.</p>
      </div>

      <!-- KPI Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="p-5 bg-[#09090b] border border-zinc-800 rounded-2xl space-y-2">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[10px] uppercase font-bold tracking-widest">Facturas por Cobrar</span>
            <lucide-icon name="receipt" class="h-5 w-5 text-amber-400"></lucide-icon>
          </div>
          <div class="text-2xl font-black text-white">$24,500.00</div>
          <div class="text-[11px] text-amber-400 font-semibold">3 facturas registradas en revisión</div>
        </div>

        <div class="p-5 bg-[#09090b] border border-zinc-800 rounded-2xl space-y-2">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[10px] uppercase font-bold tracking-widest">Pagos Recibidos (Mes)</span>
            <lucide-icon name="credit-card" class="h-5 w-5 text-emerald-400"></lucide-icon>
          </div>
          <div class="text-2xl font-black text-white">$48,900.00</div>
          <div class="text-[11px] text-emerald-400 font-semibold">Liquidados a su cuenta bancaria</div>
        </div>

        <div class="p-5 bg-[#09090b] border border-zinc-800 rounded-2xl space-y-2">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[10px] uppercase font-bold tracking-widest">Órdenes de Compra</span>
            <lucide-icon name="file-check" class="h-5 w-5 text-blue-400"></lucide-icon>
          </div>
          <div class="text-2xl font-black text-white">2 Activas</div>
          <div class="text-[11px] text-blue-400 font-semibold">En proceso de entrega en almacén</div>
        </div>

        <div class="p-5 bg-[#09090b] border border-zinc-800 rounded-2xl space-y-2">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[10px] uppercase font-bold tracking-widest">Retenciones IVA/ISLR</span>
            <lucide-icon name="file-text" class="h-5 w-5 text-purple-400"></lucide-icon>
          </div>
          <div class="text-2xl font-black text-white">$3,667.50</div>
          <div class="text-[11px] text-purple-400 font-semibold">Comprobantes listos para descarga</div>
        </div>

      </div>

      <!-- Main Tables Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Facturas Recientes -->
        <div class="p-6 bg-[#09090b] border border-zinc-800 rounded-2xl space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <lucide-icon name="receipt" class="h-4 w-4 text-blue-400"></lucide-icon> Facturas Registradas Recientemente
            </h2>
            <a routerLink="/app/facturas" class="text-xs text-blue-400 hover:underline font-semibold">Ver todas</a>
          </div>
          <div class="space-y-2">
            <div *ngFor="let f of facturas" class="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div class="font-bold text-white">{{ f.numeroFactura }}</div>
                <div class="text-slate-400 text-[10px]">Vence: {{ f.fechaVencimiento }}</div>
              </div>
              <div class="text-right">
                <div class="font-bold text-white font-mono">{{ '$' + f.montoTotal.toLocaleString() }}</div>
                <span class="px-2 py-0.5 rounded text-[9px] font-extrabold bg-blue-950 text-blue-400 border border-blue-800">{{ f.estatus }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Ultimos Pagos -->
        <div class="p-6 bg-[#09090b] border border-zinc-800 rounded-2xl space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <lucide-icon name="credit-card" class="h-4 w-4 text-emerald-400"></lucide-icon> Últimos Pagos Liquidados
            </h2>
            <a routerLink="/app/pagos" class="text-xs text-blue-400 hover:underline font-semibold">Ver todos</a>
          </div>
          <div class="space-y-2">
            <div *ngFor="let p of pagos" class="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div class="font-bold text-white">{{ p.referencia }}</div>
                <div class="text-slate-400 text-[10px]">{{ p.fechaPago }} · {{ p.bancoDestino }}</div>
              </div>
              <div class="text-right">
                <div class="font-bold text-emerald-400 font-mono">{{ '$' + p.montoLiquidado.toLocaleString() }}</div>
                <span class="px-2 py-0.5 rounded text-[9px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800">Procesado</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class DashboardProveedorComponent implements OnInit {
  facturas: any[] = [];
  pagos: any[] = [];

  constructor(private portalApi: PortalApiService) {}

  ngOnInit() {
    this.portalApi.getFacturas().subscribe(res => this.facturas = res || []);
    this.portalApi.getPagos().subscribe(res => this.pagos = res || []);
  }
}
