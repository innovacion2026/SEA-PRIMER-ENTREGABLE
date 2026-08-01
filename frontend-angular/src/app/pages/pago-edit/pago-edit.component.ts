import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../services/api.service';
import { fmtMoney } from '../../data/mock';

@Component({
  selector: 'app-pago-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="space-y-6" *ngIf="pago">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button (click)="goBack()" class="h-10 w-10 inline-flex items-center justify-center border-2 border-foreground rounded-xl bg-white hover:bg-slate-100 transition-all">
            <lucide-icon name="chevron-down" class="h-4 w-4 rotate-90"></lucide-icon>
          </button>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-2xl font-bold tracking-tight">Pago #{{ pago.id }}</h1>
              <span class="font-bold uppercase px-3 py-0.5 rounded-full text-xs border bg-emerald-50 text-emerald-700 border-emerald-200">
                Pagado
              </span>
            </div>
            <p class="text-sm text-muted-foreground">Registro de Pago · Tesorería</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Payment Details -->
        <div class="card-elevated p-6 bg-white border rounded-2xl shadow-sm space-y-4">
          <h3 class="font-bold text-sm uppercase text-primary border-b pb-2">Detalle del Pago</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between items-center py-2 border-b border-slate-50">
              <span class="text-slate-500 font-medium">Proveedor</span>
              <span class="font-bold text-slate-800">{{ pago.proveedor || 'N/A' }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-50">
              <span class="text-slate-500 font-medium">N° Factura</span>
              <span class="font-bold text-slate-800">{{ pago.factura || 'N/A' }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-50">
              <span class="text-slate-500 font-medium">Monto Pagado</span>
              <span class="font-black text-lg text-primary">{{ formatMoney(pago.monto) }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-50">
              <span class="text-slate-500 font-medium">Fecha de Pago</span>
              <span class="font-bold text-slate-800">{{ pago.fecha_pago || pago.fecha || 'N/A' }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-50">
              <span class="text-slate-500 font-medium">Método</span>
              <span class="font-bold text-slate-800">{{ pago.metodo || 'Transferencia' }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-50">
              <span class="text-slate-500 font-medium">Banco Origen</span>
              <span class="font-bold text-slate-800">{{ pago.banco_origen || 'N/A' }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-50">
              <span class="text-slate-500 font-medium">Banco Destino</span>
              <span class="font-bold text-slate-800">{{ pago.banco_pago || pago.banco_destino || 'N/A' }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-slate-500 font-medium">Referencia</span>
              <span class="font-bold text-slate-800 font-mono">{{ pago.referencia || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- Confirmation Box -->
        <div class="card-elevated p-6 text-center space-y-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col items-center justify-center">
          <div class="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
            <lucide-icon name="check-circle" class="h-12 w-12 text-emerald-600"></lucide-icon>
          </div>
          <div>
            <h3 class="font-bold text-xl text-emerald-700">Pago Registrado</h3>
            <p class="text-sm text-slate-500 mt-1 leading-relaxed">
              El desembolso ha sido procesado y registrado exitosamente en el sistema.
            </p>
          </div>
          <div class="pt-2">
            <button (click)="goToCxP()" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-700 font-bold text-sm hover:bg-emerald-100 transition-all">
              <lucide-icon name="arrow-left" class="h-4 w-4"></lucide-icon>
              Ver CxP Asociada
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div *ngIf="!pago && !error" class="flex items-center justify-center min-h-64">
      <div class="text-center space-y-3">
        <div class="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-slate-500 text-sm">Cargando pago...</p>
      </div>
    </div>

    <!-- Error state -->
    <div *ngIf="error" class="flex flex-col items-center justify-center min-h-64 space-y-4">
      <lucide-icon name="alert-circle" class="h-12 w-12 text-rose-400"></lucide-icon>
      <p class="text-slate-600">No se pudo cargar el pago. <a routerLink="/app/tesoreria/pagos" class="text-primary font-bold underline">Volver a Pagos</a></p>
    </div>
  `
})
export class PagoEditComponent implements OnInit {
  id = '';
  pago: any = null;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.loadPago();
  }

  loadPago() {
    this.apiService.fetchPago(this.id).subscribe({
      next: (res: any) => {
        this.pago = res;
      },
      error: () => {
        this.error = true;
      }
    });
  }

  formatMoney(val: any) {
    return fmtMoney(Number(val) || 0);
  }

  goBack() {
    this.router.navigate(['/app/tesoreria/pagos']);
  }

  goToCxP() {
    if (this.pago?.cxp_id) {
      this.router.navigate([`/app/tesoreria/cxp/editar/${this.pago.cxp_id}`]);
    } else {
      this.router.navigate(['/app/tesoreria/cxp']);
    }
  }
}
