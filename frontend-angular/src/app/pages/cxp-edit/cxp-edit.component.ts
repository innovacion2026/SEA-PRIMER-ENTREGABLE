import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../services/api.service';
import { fmtMoney } from '../../data/mock';

@Component({
  selector: 'app-cxp-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  template: `
    <div class="space-y-6" *ngIf="cxp">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button (click)="goBack()" class="h-10 w-10 inline-flex items-center justify-center border-2 border-foreground rounded-xl bg-white hover:bg-slate-100 transition-all">
            <lucide-icon name="chevron-down" class="h-4 w-4 rotate-90"></lucide-icon>
          </button>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-2xl font-bold tracking-tight">{{ cxp.factura }}</h1>
              <span [class]="'font-bold uppercase px-3 py-0.5 rounded-full text-xs border ' + stateBadge(cxp.estatus)">
                {{ cxp.estatus || 'Pendiente' }}
              </span>
            </div>
            <p class="text-sm text-muted-foreground">Cuenta por Pagar · OC: {{ cxp.oc_codigo || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Left details panel -->
        <div class="md:col-span-2 space-y-4">
          <div class="card-elevated p-6 bg-white border rounded-2xl shadow-sm space-y-4">
            <h3 class="font-bold text-sm uppercase text-primary border-b pb-2">Información del Proveedor y Factura</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5"><label class="text-xs uppercase tracking-wider font-bold">N° Factura</label><input type="text" [(ngModel)]="cxp.factura" [disabled]="!isEditable" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none" /></div>
              <div class="space-y-1.5"><label class="text-xs uppercase tracking-wider font-bold">Proveedor</label><input type="text" [(ngModel)]="cxp.proveedor" [disabled]="!isEditable" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none" /></div>
              <div class="space-y-1.5"><label class="text-xs uppercase tracking-wider font-bold">Fecha Vencimiento</label><input type="date" [(ngModel)]="cxp.vencimiento" [disabled]="!isEditable" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none" /></div>
              <div class="space-y-1.5"><label class="text-xs uppercase tracking-wider font-bold">Banco Destino</label><input type="text" [(ngModel)]="cxp.banco_pago" [disabled]="!isEditable" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none" /></div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-sm">
              <div><p class="text-xs text-slate-400 font-bold uppercase">Subtotal</p><p class="font-bold text-slate-700">{{ formatMoney(cxp.subtotal) }}</p></div>
              <div><p class="text-xs text-slate-400 font-bold uppercase">IVA</p><p class="font-bold text-blue-600">+{{ formatMoney(cxp.monto_iva) }}</p></div>
              <div><p class="text-xs text-slate-400 font-bold uppercase">Total a Pagar</p><p class="text-lg font-black text-primary">{{ formatMoney(cxp.monto_neto) }}</p></div>
            </div>
          </div>
        </div>

        <!-- Right action panel -->
        <div class="space-y-4">
          
          <!-- Apply payment box -->
          <div class="card-elevated border-primary/20 bg-primary/5 p-5 space-y-4 rounded-2xl border" *ngIf="isEditable">
            <p class="font-bold text-primary flex items-center gap-2">
              <lucide-icon name="banknote" class="h-5 w-5"></lucide-icon>
              Aplicar Pago
            </p>
            <div class="space-y-3">
              <div class="space-y-1.5">
                <label class="text-xs uppercase font-bold text-slate-500">Banco Origen</label>
                <input type="text" [(ngModel)]="pagoData.banco_origen" placeholder="Ej: Banesco" class="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs uppercase font-bold text-slate-500">Cuenta Origen</label>
                <input type="text" [(ngModel)]="pagoData.cuenta_origen" placeholder="Últimos 4 dígitos..." class="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs uppercase font-bold text-slate-500">Referencia / Comprobante</label>
                <input type="text" [(ngModel)]="pagoData.referencia" class="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none" />
              </div>
              <button (click)="pagar()" class="w-full h-11 bg-primary text-white hover:bg-primary/95 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                Registrar Pago
              </button>
            </div>
          </div>

          <!-- Already Paid status -->
          <div class="card-elevated p-6 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-2xl" *ngIf="cxp.estatus === 'Pagada'">
            <lucide-icon name="check" class="h-12 w-12 text-emerald-600 mx-auto"></lucide-icon>
            <h3 class="font-bold text-lg text-emerald-700">Factura Pagada</h3>
            <p class="text-xs text-slate-500 leading-relaxed">Esta cuenta por pagar ya ha sido procesada y el desembolso fue registrado exitosamente.</p>
          </div>

        </div>
      </div>
    </div>
  `
})
export class CxPEditComponent implements OnInit {
  id = '';
  cxp: any = null;
  items: any[] = [];
  
  pagoData = {
    banco_origen: '',
    cuenta_origen: '',
    referencia: '',
    metodo: 'Transferencia',
    fecha: new Date().toISOString().slice(0, 10)
  };

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.loadCxp();
  }

  loadCxp() {
    this.apiService.fetchCxp(this.id).subscribe({
      next: (res: any) => {
        const { items, ...rest } = res;
        this.cxp = rest;
        this.items = items || [];
      }
    });
  }

  get isEditable(): boolean {
    return this.cxp?.estatus !== 'Pagada' && this.cxp?.estatus !== 'Devuelta';
  }

  stateBadge(st: string) {
    if (st === 'Pagada') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (st === 'Devuelta') return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }

  formatMoney(val: any) {
    return fmtMoney(Number(val) || 0);
  }

  goBack() {
    this.router.navigate(['/app/tesoreria/cxp']);
  }

  pagar() {
    this.apiService.pagarCxp(this.id, this.pagoData).subscribe({
      next: (res: any) => {
        this.router.navigate([`/app/tesoreria/pagos/editar/${res.id}`]);
      }
    });
  }
}
