import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../services/api.service';
import { fmtMoney } from '../../data/mock';

@Component({
  selector: 'app-orden-compra-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  template: `
    <div class="space-y-6" *ngIf="hdr">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button (click)="goBack()" class="h-10 w-10 inline-flex items-center justify-center border-2 border-foreground rounded-xl bg-white hover:bg-slate-100 transition-all">
            <lucide-icon name="chevron-down" class="h-4 w-4 rotate-90"></lucide-icon>
          </button>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-2xl font-bold tracking-tight">{{ hdr.codigo }}</h1>
              <span class="font-bold uppercase px-3 py-0.5 rounded-full text-xs border bg-slate-100 text-slate-700 border-slate-200">{{ hdr.estatus }}</span>
              <span class="font-mono text-xs border border-slate-200 rounded px-1.5 py-0.5">{{ hdr.moneda }}</span>
            </div>
            <p class="text-sm text-muted-foreground">Orden de Compra · {{ hdr.fecha_emision }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <select [(ngModel)]="hdr.estatus" class="w-36 h-10 px-2 rounded-xl border-2 border-slate-200 focus:outline-none bg-white font-bold text-slate-700">
            <option *ngFor="let s of estatusOC" [value]="s">{{ s }}</option>
          </select>
          <button (click)="save()" class="h-10 px-4 bg-primary text-white hover:bg-primary/95 border-2 border-primary rounded-xl font-bold flex items-center gap-2 transition-all">
            <lucide-icon name="plus" class="h-4 w-4"></lucide-icon> Guardar OC
          </button>
        </div>
      </div>

      <!-- Tab selectors -->
      <div class="flex border-b-2 border-primary/20 bg-slate-50 p-1 rounded-xl gap-1">
        <button (click)="setTab('encabezado')" [class]="'flex-1 py-2.5 rounded-lg text-xs md:text-sm font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all ' + (activeTab === 'encabezado' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200')">
          <lucide-icon name="building-2" class="h-3.5 w-3.5"></lucide-icon> Encabezado
        </button>
        <button (click)="setTab('items')" [class]="'flex-1 py-2.5 rounded-lg text-xs md:text-sm font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all ' + (activeTab === 'items' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200')">
          <lucide-icon name="file-text" class="h-3.5 w-3.5"></lucide-icon> Líneas de Detalle
        </button>
        <button (click)="setTab('condiciones')" [class]="'flex-1 py-2.5 rounded-lg text-xs md:text-sm font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all ' + (activeTab === 'condiciones' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200')">
          <lucide-icon name="wallet" class="h-3.5 w-3.5"></lucide-icon> Condiciones
        </button>
        <button (click)="setTab('impuestos')" [class]="'flex-1 py-2.5 rounded-lg text-xs md:text-sm font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all ' + (activeTab === 'impuestos' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200')">
          <lucide-icon name="calculator" class="h-3.5 w-3.5"></lucide-icon> Impuestos
        </button>
      </div>

      <!-- Tab Switch Panel -->
      <div [ngSwitch]="activeTab">
        
        <!-- Tab 1: Encabezado -->
        <div *ngSwitchCase="'encabezado'" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="card-elevated p-5 space-y-4 bg-white border rounded-2xl shadow-sm">
            <h3 class="font-bold text-sm uppercase text-primary border-b pb-2">Datos de la Orden</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5"><label class="text-xs uppercase tracking-wider font-bold">N° OC</label><input type="text" [value]="hdr.codigo" disabled class="w-full h-11 px-3 rounded-lg border-2 border-slate-100 bg-slate-50 text-slate-500 font-bold" /></div>
              <div class="space-y-1.5"><label class="text-xs uppercase tracking-wider font-bold">Fecha Emisión</label><input type="date" [(ngModel)]="hdr.fecha_emision" class="w-full h-11 px-3 rounded-lg border-2 border-primary/45 focus:outline-none" /></div>
              <div class="space-y-1.5"><label class="text-xs uppercase tracking-wider font-bold">Vigencia</label><input type="date" [(ngModel)]="hdr.vigencia" class="w-full h-11 px-3 rounded-lg border-2 border-primary/45 focus:outline-none" /></div>
              <div class="space-y-1.5"><label class="text-xs uppercase tracking-wider font-bold">Centro de Costo</label><input type="text" [(ngModel)]="hdr.centro_costo" class="w-full h-11 px-3 rounded-lg border-2 border-primary/45 focus:outline-none" /></div>
              <div class="space-y-1.5"><label class="text-xs uppercase tracking-wider font-bold">Partida</label><input type="text" [(ngModel)]="hdr.partida" class="w-full h-11 px-3 rounded-lg border-2 border-primary/45 focus:outline-none" /></div>
            </div>
          </div>
          
          <div class="card-elevated p-5 space-y-4 bg-white border rounded-2xl shadow-sm">
            <h3 class="font-bold text-sm uppercase text-primary border-b pb-2">Datos del Proveedor</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5 col-span-2"><label class="text-xs uppercase tracking-wider font-bold">Razón Social *</label><input type="text" [(ngModel)]="hdr.proveedor" class="w-full h-11 px-3 rounded-lg border-2 border-primary/45 focus:outline-none" /></div>
              <div class="space-y-1.5"><label class="text-xs uppercase tracking-wider font-bold">RIF</label><input type="text" [(ngModel)]="hdr.proveedor_rif" class="w-full h-11 px-3 rounded-lg border-2 border-primary/45 focus:outline-none" /></div>
              <div class="space-y-1.5"><label class="text-xs uppercase tracking-wider font-bold">Teléfono</label><input type="text" [(ngModel)]="hdr.proveedor_telefono" class="w-full h-11 px-3 rounded-lg border-2 border-primary/45 focus:outline-none" /></div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Items -->
        <div *ngSwitchCase="'items'" class="card-elevated p-5 space-y-4 bg-white border rounded-2xl shadow-sm">
          <h3 class="font-bold text-sm uppercase text-primary border-b pb-2">Líneas de la OC</h3>
          <div class="grid grid-cols-12 gap-2 items-end bg-primary/5 p-3 rounded-xl border border-primary/20">
            <div class="col-span-5 space-y-1"><label class="text-xs font-bold uppercase">Descripción *</label><input type="text" [(ngModel)]="newItem.descripcion" placeholder="Descripción del bien o servicio" class="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none" /></div>
            <div class="col-span-2 space-y-1"><label class="text-xs font-bold uppercase">Unidad</label>
              <select [(ngModel)]="newItem.unidad" class="w-full h-10 px-2 rounded-lg border border-slate-200 focus:outline-none bg-white">
                <option *ngFor="let u of unidades" [value]="u">{{ u }}</option>
              </select>
            </div>
            <div class="col-span-2 space-y-1"><label class="text-xs font-bold uppercase">Cant.</label><input type="number" [(ngModel)]="newItem.cantidad" class="w-full h-10 px-2 rounded-lg border border-slate-200 focus:outline-none" /></div>
            <div class="col-span-2 space-y-1"><label class="text-xs font-bold uppercase">Precio Unit.</label><input type="number" [(ngModel)]="newItem.precio_unitario" class="w-full h-10 px-2 rounded-lg border border-slate-200 focus:outline-none" /></div>
            <div class="col-span-1"><button (click)="handleAddItem()" class="w-full h-10 bg-primary text-white rounded-lg flex items-center justify-center font-bold"><lucide-icon name="plus" class="h-4 w-4"></lucide-icon></button></div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-primary/[0.02] border-b-2 border-slate-200">
                <tr>
                  <th class="p-3 text-left">#</th>
                  <th class="p-3 text-left">Descripción</th>
                  <th class="p-3 text-center">Unidad</th>
                  <th class="p-3 text-right">Cant.</th>
                  <th class="p-3 text-right">Precio Unit.</th>
                  <th class="p-3 text-right">Total</th>
                  <th class="p-3 text-center w-16"></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let it of items; let idx = index" class="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                  <td class="p-3 text-slate-500 font-medium">{{ idx + 1 }}</td>
                  <td class="p-3 font-semibold text-slate-700">{{ it.descripcion }}</td>
                  <td class="p-3 text-center font-bold text-xs text-slate-500 uppercase">{{ it.unidad }}</td>
                  <td class="p-3 text-right font-semibold">{{ it.cantidad }}</td>
                  <td class="p-3 text-right font-semibold">{{ formatMoney(it.precio_unitario) }}</td>
                  <td class="p-3 text-right font-black text-primary">{{ formatMoney(it.cantidad * it.precio_unitario) }}</td>
                  <td class="p-3 text-center">
                    <button (click)="handleDeleteItem(it.id)" class="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg flex items-center justify-center mx-auto">
                      <lucide-icon name="trash-2" class="h-4 w-4"></lucide-icon>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 3: Condiciones -->
        <div *ngSwitchCase="'condiciones'" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="card-elevated p-5 space-y-4 bg-white border rounded-2xl shadow-sm">
            <h3 class="font-bold text-sm uppercase text-primary border-b pb-2">Condiciones de Pago</h3>
            <div class="space-y-3">
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Condición de Pago</label>
                <select [(ngModel)]="hdr.condicion_pago" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none bg-white">
                  <option *ngFor="let c of condicionesPago" [value]="c">{{ c }}</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Moneda</label>
                <select [(ngModel)]="hdr.moneda" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none bg-white">
                  <option value="USD">USD</option>
                  <option value="VES">VES</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 4: Impuestos -->
        <div *ngSwitchCase="'impuestos'" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="card-elevated p-5 space-y-4 bg-white border rounded-2xl shadow-sm">
            <h3 class="font-bold text-sm uppercase text-primary border-b pb-2">Configuración Fiscal</h3>
            <div class="space-y-4">
              <div class="p-3 border rounded-xl bg-slate-50 flex items-center justify-between">
                <span class="font-bold text-sm">Exento de IVA</span>
                <input type="checkbox" [(ngModel)]="hdr.iva_exento" class="h-5 w-5 accent-primary cursor-pointer" />
              </div>
            </div>
          </div>
          
          <div class="card-elevated p-5 space-y-4 bg-white border rounded-2xl shadow-sm">
            <h3 class="font-bold text-sm uppercase text-primary border-b pb-2">Resumen Financiero</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between py-2 border-b">
                <span class="text-slate-500 font-semibold">Subtotal</span>
                <span class="font-bold font-mono">{{ formatMoney(subtotal) }}</span>
              </div>
              <div class="flex justify-between py-2 border-b">
                <span class="text-slate-500 font-semibold">IVA (16%)</span>
                <span class="font-bold font-mono text-blue-600">{{ formatMoney(ivaMonto) }}</span>
              </div>
              <div class="flex justify-between py-3 rounded-xl bg-primary/10 border px-3">
                <span class="font-black text-primary">TOTAL NETO A PAGAR</span>
                <span class="font-black text-primary font-mono text-lg">{{ formatMoney(totalNeto) }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class OrdenCompraEditComponent implements OnInit {
  id = '';
  hdr: any = null;
  items: any[] = [];
  activeTab = 'encabezado';

  newItem = { descripcion: '', unidad: 'Unidad', cantidad: '', precio_unitario: '' };

  condicionesPago = ["Contado", "Crédito 15 días", "Crédito 30 días", "Crédito 45 días", "Crédito 60 días", "Crédito 90 días", "Anticipado 50%"];
  unidades = ["Unidad", "Servicio", "Caja", "Metro", "Litro", "Kilo", "Global", "Hora", "Día", "Mes"];
  estatusOC = ["Borrador", "Emitida", "Aprobada", "Recibida", "Cerrada", "Anulada"];

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.loadOrdenCompra();
  }

  loadOrdenCompra() {
    this.apiService.fetchOrdenCompra(this.id).subscribe({
      next: (res: any) => {
        const { items, ...rest } = res;
        this.hdr = {
          ...rest,
          iva_porcentaje: rest.iva_porcentaje ?? 16,
          iva_exento: rest.iva_exento ?? false,
          condicion_pago: rest.condicion_pago ?? 'Contado',
          moneda: rest.moneda ?? 'USD'
        };
        this.items = items || [];
      }
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  get subtotal(): number {
    return this.items.reduce((sum, it) => sum + (Number(it.cantidad || 0) * Number(it.precio_unitario || 0)), 0);
  }

  get ivaMonto(): number {
    if (this.hdr?.iva_exento) return 0;
    return this.subtotal * (Number(this.hdr?.iva_porcentaje || 16) / 100);
  }

  get totalNeto(): number {
    return this.subtotal + this.ivaMonto;
  }

  formatMoney(val: any) {
    return fmtMoney(Number(val) || 0);
  }

  handleAddItem() {
    if (!this.newItem.descripcion || !this.newItem.cantidad || !this.newItem.precio_unitario) return;

    this.apiService.addOrdenCompraItem(this.id, this.newItem).subscribe({
      next: (saved: any) => {
        this.items.push(saved);
        this.newItem = { descripcion: '', unidad: 'Unidad', cantidad: '', precio_unitario: '' };
      }
    });
  }

  handleDeleteItem(itemId: number) {
    this.apiService.deleteOrdenCompraItem(itemId).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.id !== itemId);
      }
    });
  }

  goBack() {
    this.router.navigate(['/app/compras/ordenes']);
  }

  save() {
    const payload = {
      ...this.hdr,
      subtotal: this.subtotal,
      monto_iva: this.ivaMonto,
      monto_total: this.totalNeto,
      monto: this.totalNeto
    };
    this.apiService.updateOrdenCompra(this.id, payload).subscribe(() => this.goBack());
  }
}
