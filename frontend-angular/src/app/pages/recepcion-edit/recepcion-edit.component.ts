import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../services/api.service';
import { fmtMoney } from '../../data/mock';

@Component({
  selector: 'app-recepcion-edit',
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
              <span [class]="'font-bold uppercase px-3 py-0.5 rounded-full text-xs border ' + stateBadge(hdr.estado)">
                {{ hdr.estado || 'Pendiente' }}
              </span>
            </div>
            <p class="text-sm text-muted-foreground">Recepción de Almacén · OC: {{ hdr.oc_asociada || '—' }}</p>
          </div>
        </div>
        
        <div class="flex gap-2">
          <button *ngIf="hdr.estado === 'Completa'" (click)="approveCxp()" class="h-10 px-4 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold flex items-center gap-1.5 transition-all">
            <lucide-icon name="check" class="h-4 w-4"></lucide-icon> Procesar a CxP
          </button>
          <button (click)="save()" class="h-10 px-4 bg-primary text-white hover:bg-primary/95 border-2 border-primary rounded-xl font-bold flex items-center gap-2 transition-all">
            <lucide-icon name="plus" class="h-4 w-4"></lucide-icon> Guardar Recepción
          </button>
        </div>
      </div>

      <!-- KPI Strip -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="card-elevated p-4 flex items-center gap-3 bg-white border rounded-2xl">
          <lucide-icon name="package-check" class="h-8 w-8 text-primary"></lucide-icon>
          <div>
            <p class="text-xs text-slate-400 font-bold uppercase">Total Pedido</p>
            <p class="text-xl font-black text-primary">{{ totalPedido }}</p>
          </div>
        </div>
        <div class="card-elevated p-4 flex items-center gap-3 bg-white border rounded-2xl">
          <lucide-icon name="check" class="h-8 w-8 text-emerald-600"></lucide-icon>
          <div>
            <p class="text-xs text-slate-400 font-bold uppercase">Total Recibido</p>
            <p class="text-xl font-black text-emerald-600">{{ totalRecibido }}</p>
          </div>
        </div>
        <div class="card-elevated p-4 flex items-center gap-3 bg-white border rounded-2xl">
          <lucide-icon name="file-text" class="h-8 w-8 text-emerald-600"></lucide-icon>
          <div>
            <p class="text-xs text-slate-400 font-bold uppercase">Conformes</p>
            <p class="text-xl font-black text-emerald-600">{{ conformes }} / {{ items.length }}</p>
          </div>
        </div>
        <div class="card-elevated p-4 flex items-center gap-3 bg-white border rounded-2xl">
          <lucide-icon name="shield" class="h-8 w-8 text-rose-600"></lucide-icon>
          <div>
            <p class="text-xs text-slate-400 font-bold uppercase">No Conformes</p>
            <p class="text-xl font-black text-rose-600">{{ noConformes }}</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b-2 border-primary/20 bg-slate-50 p-1 rounded-xl gap-1">
        <button (click)="setTab('encabezado')" [class]="'flex-1 py-2.5 rounded-lg text-xs md:text-sm font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all ' + (activeTab === 'encabezado' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200')">
          <lucide-icon name="building-2" class="h-3.5 w-3.5"></lucide-icon> Datos Generales
        </button>
        <button (click)="setTab('items')" [class]="'flex-1 py-2.5 rounded-lg text-xs md:text-sm font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all ' + (activeTab === 'items' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200')">
          <lucide-icon name="package-check" class="h-3.5 w-3.5"></lucide-icon> Rubros Recibidos
        </button>
      </div>

      <!-- Content panels -->
      <div [ngSwitch]="activeTab">
        
        <!-- Tab 1: Datos Generales -->
        <div *ngSwitchCase="'encabezado'" class="card-elevated p-6 bg-white border rounded-2xl shadow-sm space-y-4">
          <h3 class="font-bold text-sm uppercase text-primary border-b pb-2">Datos de la Recepción</h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5"><label class="text-xs uppercase tracking-wider font-bold">N° Recepción</label><input type="text" [value]="hdr.codigo" disabled class="w-full h-11 px-3 rounded-lg border border-slate-100 bg-slate-50 text-slate-500 font-bold" /></div>
            <div class="space-y-1.5"><label class="text-xs uppercase tracking-wider font-bold">OC Asociada</label><input type="text" [(ngModel)]="hdr.oc_asociada" (ngModelChange)="loadOcData()" class="w-full h-11 px-3 rounded-lg border-2 border-primary/45 focus:outline-none" /></div>
            <div class="space-y-1.5"><label class="text-xs uppercase tracking-wider font-bold">Proveedor</label><input type="text" [(ngModel)]="hdr.proveedor" class="w-full h-11 px-3 rounded-lg border-2 border-primary/45 focus:outline-none" /></div>
            <div class="space-y-1.5"><label class="text-xs uppercase tracking-wider font-bold">Fecha</label><input type="date" [(ngModel)]="hdr.fecha" class="w-full h-11 px-3 rounded-lg border-2 border-primary/45 focus:outline-none" /></div>
          </div>
        </div>

        <!-- Tab 2: Items -->
        <div *ngSwitchCase="'items'" class="card-elevated p-6 bg-white border rounded-2xl shadow-sm space-y-4">
          <h3 class="font-bold text-sm uppercase text-primary border-b pb-2">Registro de Rubros Recibidos</h3>
          
          <div class="grid grid-cols-12 gap-2 items-end bg-primary/5 p-3 rounded-xl border border-primary/20">
            <div class="col-span-5 space-y-1">
              <label class="text-xs font-bold uppercase">Seleccionar Rubro de la OC *</label>
              <select [(ngModel)]="newItem.oc_item_id" (change)="onSelectOcItem()" class="w-full h-10 px-2 rounded-lg border border-slate-200 focus:outline-none bg-white">
                <option value="" disabled>Seleccione un rubro...</option>
                <option *ngFor="let item of ocItems" [value]="item.id">{{ item.descripcion }} ({{ item.cantidad }} {{ item.unidad }})</option>
              </select>
            </div>
            <div class="col-span-2 space-y-1"><label class="text-xs font-bold uppercase">Unidad</label><input type="text" [value]="newItem.unidad" disabled class="w-full h-10 px-2 border rounded-lg bg-slate-50 text-slate-500" /></div>
            <div class="col-span-2 space-y-1"><label class="text-xs font-bold uppercase">Pedido</label><input type="number" [value]="newItem.cantidad_pedida" disabled class="w-full h-10 px-2 border rounded-lg bg-slate-50 text-slate-500" /></div>
            
            <div class="col-span-2 space-y-1"><label class="text-xs font-bold uppercase text-primary">Recibida *</label><input type="number" [(ngModel)]="newItem.cantidad_recibida" class="w-full h-10 px-2 border-2 border-primary/45 rounded-lg focus:outline-none" /></div>
            <div class="col-span-1"><button (click)="handleAddItem()" class="w-full h-10 bg-primary text-white rounded-lg flex items-center justify-center font-bold"><lucide-icon name="plus" class="h-4 w-4"></lucide-icon></button></div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-primary/[0.02] border-b-2 border-slate-200">
                <tr>
                  <th class="p-3 text-left">#</th>
                  <th class="p-3 text-left">Rubro</th>
                  <th class="p-3 text-center">Unidad</th>
                  <th class="p-3 text-right">Pedido</th>
                  <th class="p-3 text-right">Recibido</th>
                  <th class="p-3 text-center">Condición</th>
                  <th class="p-3 text-center w-16"></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let it of items; let idx = index" class="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                  <td class="p-3 text-slate-500 font-medium">{{ idx + 1 }}</td>
                  <td class="p-3 font-semibold text-slate-700">{{ it.descripcion }}</td>
                  <td class="p-3 text-center font-bold text-xs text-slate-500 uppercase">{{ it.unidad }}</td>
                  <td class="p-3 text-right font-semibold">{{ it.cantidad_pedida }}</td>
                  <td class="p-3 text-right font-black text-primary">{{ it.cantidad_recibida }}</td>
                  <td class="p-3 text-center">
                    <span [class]="'px-2 py-0.5 rounded-full text-[10px] font-bold border ' + (it.condicion === 'Conforme' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200')">
                      {{ it.condicion }}
                    </span>
                  </td>
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

      </div>
    </div>
  `
})
export class RecepcionEditComponent implements OnInit {
  id = '';
  hdr: any = null;
  items: any[] = [];
  ocItems: any[] = [];
  activeTab = 'encabezado';

  newItem = {
    descripcion: '', unidad: 'Unidad',
    cantidad_pedida: 0, cantidad_recibida: 0,
    condicion: 'Conforme', observacion_linea: '', oc_item_id: ''
  };

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.loadRecepcion();
  }

  loadRecepcion() {
    this.apiService.fetchRecepcion(this.id).subscribe({
      next: (res: any) => {
        const { items, ...rest } = res;
        this.hdr = rest;
        this.items = items || [];
        this.loadOcData();
      }
    });
  }

  loadOcData() {
    if (this.hdr?.oc_asociada) {
      this.apiService.fetchOrdenCompraByCodigo(this.hdr.oc_asociada).subscribe({
        next: (res: any) => {
          this.ocItems = res?.items || [];
        }
      });
    }
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  get totalPedido(): number {
    return this.items.reduce((sum, i) => sum + Number(i.cantidad_pedida || 0), 0);
  }

  get totalRecibido(): number {
    return this.items.reduce((sum, i) => sum + Number(i.cantidad_recibida || 0), 0);
  }

  get conformes(): number {
    return this.items.filter(i => i.condicion === 'Conforme').length;
  }

  get noConformes(): number {
    return this.items.filter(i => i.condicion !== 'Conforme').length;
  }

  stateBadge(estado: string) {
    if (estado === "Completa") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (estado === "Parcial") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-slate-100 text-slate-500 border-slate-200";
  }

  onSelectOcItem() {
    const it = this.ocItems.find(i => String(i.id) === String(this.newItem.oc_item_id));
    if (it) {
      this.newItem.descripcion = it.descripcion;
      this.newItem.unidad = it.unidad;
      this.newItem.cantidad_pedida = it.cantidad;
      this.newItem.cantidad_recibida = it.cantidad;
    }
  }

  handleAddItem() {
    if (!this.newItem.oc_item_id || !this.newItem.cantidad_recibida) return;

    this.apiService.addRecepcionItem(this.id, this.newItem).subscribe({
      next: (saved: any) => {
        this.items.push(saved);
        this.newItem = {
          descripcion: '', unidad: 'Unidad',
          cantidad_pedida: 0, cantidad_recibida: 0,
          condicion: 'Conforme', observacion_linea: '', oc_item_id: ''
        };
        this.hdr.estado = this.calcEstado();
      }
    });
  }

  handleDeleteItem(itemId: number) {
    this.apiService.deleteRecepcionItem(itemId).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.id !== itemId);
        this.hdr.estado = this.calcEstado();
      }
    });
  }

  calcEstado(): string {
    if (this.items.length === 0) return 'Pendiente';
    if (this.items.some(i => i.condicion !== 'Conforme')) return 'No Conforme';
    if (this.items.some(i => Number(i.cantidad_recibida) !== Number(i.cantidad_pedida))) return 'Parcial';
    return 'Completa';
  }

  goBack() {
    this.router.navigate(['/app/compras/recepciones']);
  }

  approveCxp() {
    this.apiService.aprobarRecepcionCxP(this.id).subscribe(() => {
      this.router.navigate(['/app/tesoreria/cxp']);
    });
  }

  save() {
    this.apiService.updateRecepcion(this.id, this.hdr).subscribe(() => this.goBack());
  }
}
