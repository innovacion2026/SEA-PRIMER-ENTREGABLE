import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

// Subcomponents
import { ComprasFlowComponent } from '../../components/compras-flow/compras-flow.component';
import { ViaticosFlowComponent } from '../../components/viaticos-flow/viaticos-flow.component';
import { SolicitudesFlowComponent } from '../../components/solicitudes-flow/solicitudes-flow.component';
import { NuevaSolicitudDialogComponent } from '../../components/nueva-solicitud-dialog/nueva-solicitud-dialog.component';
import { NuevaSolicitudGenericaDialogComponent } from '../../components/nueva-solicitud-generica-dialog/nueva-solicitud-generica-dialog.component';
import { RendicionDialogComponent } from '../../components/rendicion-dialog/rendicion-dialog.component';
import { NuevoComiteDialogComponent } from '../../components/nuevo-comite-dialog/nuevo-comite-dialog.component';
import { DetalleDialogComponent } from '../../components/detalle-dialog/detalle-dialog.component';
import { EditGenericoDialogComponent } from '../../components/edit-generico-dialog/edit-generico-dialog.component';
import { RevisionExpedienteDialogComponent } from '../../components/revision-expediente-dialog/revision-expediente-dialog.component';

// Services & Config
import { ApiService } from '../../services/api.service';
import { datasets, fmtMoney, fmtDate, DataSet } from '../../data/mock';
import { flatten } from '../../data/menu';

const pathMap: Record<string, string> = {
  "/app/proveedores/directorio": "proveedores",
  "/app/proveedores/solicitudes": "solicitudes",
  "/app/proveedores/evaluacion": "evaluacion",
  "/app/proveedores/notificaciones": "notificaciones",
  "/app/proveedores/documentacion": "documentacion",
  "/app/comite/lista": "comite_lista",
  "/app/comite/miembros": "comite_miembros",
  "/app/comite/casos": "comite_casos",
  "/app/compras/requerimientos": "requerimientos",
  "/app/compras/presupuestos": "presupuestos",
  "/app/compras/ordenes": "ordenes",
  "/app/compras/recepciones": "recepciones",
  "/app/tesoreria/cxp": "cxp",
  "/app/tesoreria/retenciones": "retenciones",
  "/app/tesoreria/pagos": "pagos",
  "/app/tesoreria/caja-chica/parametros": "caja_parametros",
  "/app/tesoreria/caja-chica/movimientos": "caja_movimientos",
  "/app/tesoreria/caja-chica/soportes": "caja_soportes",
  "/app/tesoreria/viaticos/parametros": "viaticos_parametros",
  "/app/tesoreria/viaticos/solicitud": "viaticos_solicitud",
  "/app/tesoreria/viaticos/movimientos": "viaticos_movimientos",
  "/app/tesoreria/viaticos/soportes": "viaticos_soportes",
  "/app/configuracion/compania": "compania",
  "/app/configuracion/parametros": "parametros_base",
  "/app/configuracion/lista-valores": "lista_valores",
  "/app/auditoria": "auditoria",
  "/app/seguridad/usuarios": "usuarios",
  "/app/seguridad/roles": "roles",
};

@Component({
  selector: 'app-module-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, LucideAngularModule,
    ComprasFlowComponent, ViaticosFlowComponent, SolicitudesFlowComponent,
    NuevaSolicitudDialogComponent, NuevaSolicitudGenericaDialogComponent,
    RendicionDialogComponent, NuevoComiteDialogComponent,
    DetalleDialogComponent, EditGenericoDialogComponent, RevisionExpedienteDialogComponent
  ],
  template: `
    <div class="space-y-6">
      
      <!-- Top Title and Action Bar -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tighter text-primary">{{ title }}</h1>
          <p *ngIf="description" class="text-sm font-medium text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            {{ description }}
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button class="h-11 px-4 rounded-xl border-2 border-primary/10 bg-white hover:bg-primary/5 text-primary font-bold gap-2 shadow-sm transition-all active:scale-95 flex items-center justify-center">
            <lucide-icon name="bar-chart-3" class="h-4 w-4"></lucide-icon> Generar Reporte
          </button>
          <button class="h-11 px-4 rounded-xl border-2 border-primary/10 bg-white hover:bg-primary/5 text-primary font-bold gap-2 shadow-sm transition-all active:scale-95 flex items-center justify-center">
            <lucide-icon name="file-up" class="h-4 w-4"></lucide-icon> Cargar
          </button>
          <button
            *ngIf="isSolicitudes || isRequerimientos || isViaticos || isComites"
            (click)="handleNewClick()"
            class="h-11 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 px-6 flex items-center justify-center"
          >
            <lucide-icon name="plus" class="h-4 w-4"></lucide-icon> Nuevo
          </button>
        </div>
      </div>

      <!-- Flow Visualizers -->
      <app-solicitudes-flow *ngIf="isSolicitudes" [rows]="rows"></app-solicitudes-flow>
      <app-compras-flow *ngIf="isRequerimientos" [rows]="rows"></app-compras-flow>
      <app-viaticos-flow *ngIf="isViaticos" [rows]="rows"></app-viaticos-flow>

      <!-- Dialogs -->
      <app-nueva-solicitud-dialog
        *ngIf="isSolicitudes"
        [(open)]="openNew"
        (create)="handleCreate($event)"
      ></app-nueva-solicitud-dialog>

      <app-revision-expediente-dialog
        *ngIf="isSolicitudes"
        [(open)]="openRevisionExpediente"
        [row]="selectedExpedienteRow"
        (approved)="handleApprovedExpediente($event)"
      ></app-revision-expediente-dialog>

      <app-nueva-solicitud-generica-dialog
        *ngIf="isRequerimientos || isViaticos"
        [(open)]="openNew"
        [type]="isRequerimientos ? 'compra' : 'viatico'"
        (create)="handleCreate($event)"
      ></app-nueva-solicitud-generica-dialog>

      <app-rendicion-dialog
        *ngIf="isViaticos"
        [(open)]="openRendicion"
        [viatico]="selectedViatico"
      ></app-rendicion-dialog>

      <app-nuevo-comite-dialog
        *ngIf="isComites"
        [(open)]="openNewComite"
        (create)="handleCreate($event)"
      ></app-nuevo-comite-dialog>

      <app-detalle-dialog
        [(open)]="openDetail"
        [title]="title"
        [data]="selectedRow"
        [columns]="columns"
      ></app-detalle-dialog>

      <app-edit-generico-dialog
        [(open)]="openEdit"
        [title]="title"
        [initialData]="selectedRow"
        [columns]="columns"
        (saveChanges)="handleUpdate($event)"
      ></app-edit-generico-dialog>

      <!-- Main Data Table Container -->
      <div class="card-elevated overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm">
        
        <!-- Search and Filter actions -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-4 p-6">
          <div class="relative flex-1 max-w-md group">
            <lucide-icon name="search" class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors"></lucide-icon>
            <input
              type="text"
              [(ngModel)]="q"
              placeholder="Buscar registros..."
              class="w-full pl-11 pr-4 h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary/50 transition-all outline-none"
            />
          </div>
          <div class="flex gap-3 sm:ml-auto">
            <button class="h-10 px-4 rounded-lg border-2 border-slate-100 hover:border-primary/30 hover:bg-primary/5 text-foreground font-bold gap-2 flex items-center justify-center text-xs">
              <lucide-icon name="sliders-horizontal" class="h-4 w-4 text-primary"></lucide-icon> Filtros
            </button>
            <button class="h-10 px-4 rounded-lg border-2 border-slate-100 hover:border-primary/30 hover:bg-primary/5 text-foreground font-bold gap-2 flex items-center justify-center text-xs">
              <lucide-icon name="download" class="h-4 w-4 text-primary"></lucide-icon> Exportar
            </button>
          </div>
        </div>

        <!-- Table View -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-primary/[0.03] border-b-2 border-slate-200">
                <th *ngFor="let c of columns" class="text-left font-bold px-6 py-4 text-[11px] uppercase tracking-[0.15em] text-primary/80 whitespace-nowrap border-r border-slate-100 last:border-r-0">
                  {{ c.label }}
                </th>
                <th class="text-right font-bold px-6 py-4 text-[11px] uppercase tracking-[0.15em] text-primary/80">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="loading">
                <td [attr.colspan]="columns.length + 1" class="text-center py-12 text-muted-foreground">
                  Cargando información...
                </td>
              </tr>
              <tr *ngIf="!loading && getFiltered().length === 0">
                <td [attr.colspan]="columns.length + 1" class="text-center py-12 text-muted-foreground italic">
                  Sin resultados para "{{ q }}"
                </td>
              </tr>
              <tr *ngFor="let row of getFiltered(); let i = index" class="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-all even:bg-slate-50/20">
                <td *ngFor="let c of columns" class="px-6 py-4 align-middle whitespace-nowrap border-r border-slate-100/50 last:border-r-0">
                  <div [class]="'text-sm font-semibold text-slate-700 ' + (c.key === 'codigo' ? 'font-bold text-primary' : '')">
                    <ng-container [ngSwitch]="c.format">
                      <span *ngSwitchCase="'money'" class="tabular-nums font-bold">{{ formatMoney(row[c.key]) }}</span>
                      <span *ngSwitchCase="'date'" class="tabular-nums">{{ formatDate(row[c.key]) }}</span>
                      <span *ngSwitchCase="'badge'" [class]="'font-bold px-2 py-0.5 rounded-full text-[10px] uppercase border ' + badgeTone(row[c.key])">
                        {{ row[c.key] }}
                      </span>
                      <span *ngSwitchDefault>{{ row[c.key] }}</span>
                    </ng-container>
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="inline-flex gap-2">
                    
                    <!-- Action: Approve Supplier Request -->
                    <button
                      *ngIf="isSolicitudes && row.estatus !== 'Aprobado'"
                      (click)="approveRow(row)"
                      class="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-90"
                      title="Aprobar proveedor"
                    >
                      <lucide-icon name="check" class="h-4 w-4"></lucide-icon>
                    </button>

                    <!-- Action: Advance Purchase Request stage -->
                    <button
                      *ngIf="isRequerimientos"
                      (click)="approveRow(row)"
                      class="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-orange-500/30 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white transition-all shadow-sm active:scale-90"
                      [title]="getApprovalTooltip(row)"
                    >
                      <lucide-icon [name]="getApprovalIcon(row)" class="h-4 w-4"></lucide-icon>
                    </button>

                    <!-- Action: Advance Travel Allowance stage -->
                    <button
                      *ngIf="isViaticos"
                      (click)="approveRow(row)"
                      class="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-orange-500/30 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white transition-all shadow-sm active:scale-90"
                      title="Siguiente etapa"
                    >
                      <lucide-icon name="plus" class="h-4 w-4"></lucide-icon>
                    </button>

                    <!-- Action: Charge Travel Allowance Expense support file -->
                    <button
                      *ngIf="isViaticos && row.etapa === 'Rendición'"
                      (click)="openRendicionModal(row)"
                      class="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-primary/30 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
                      title="Cargar Rendición de Gastos"
                    >
                      <lucide-icon name="wallet" class="h-4 w-4"></lucide-icon>
                    </button>

                    <!-- Action: Consult details modal -->
                    <button
                      (click)="consultRow(row)"
                      class="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm active:scale-90"
                      title="Consultar"
                    >
                      <lucide-icon name="eye" class="h-4 w-4"></lucide-icon>
                    </button>

                    <!-- Action: Edit record -->
                    <button
                      (click)="editRow(row)"
                      class="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-90"
                      title="Editar"
                    >
                      <lucide-icon name="edit" class="h-4 w-4"></lucide-icon>
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer status bar -->
        <div class="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span>Mostrando {{ getFiltered().length }} de {{ rows.length }} registros</span>
          <div class="flex items-center gap-2">
            <div class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            Sistema en línea
          </div>
        </div>

      </div>
    </div>
  `
})
export class ModulePageComponent implements OnInit, OnDestroy {
  routerSub!: Subscription;
  pathname = '';
  title = 'Módulo';
  description = '';
  columns: any[] = [];
  rows: any[] = [];
  loading = false;
  q = '';

  // Modals state
  openNew = false;
  openRendicion = false;
  openNewComite = false;
  openDetail = false;
  openEdit = false;

  selectedViatico: any = null;
  selectedRow: any = null;

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.pathname = this.router.url.split('?')[0];
    this.loadModuleMetadata();
    this.loadData();

    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.pathname = event.urlAfterRedirects.split('?')[0];
        this.loadModuleMetadata();
        this.loadData();
      });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  loadModuleMetadata() {
    const meta = flatten().find(m => m.path === this.pathname);
    this.title = meta?.title || 'Módulo';
    this.description = meta?.description || '';
    
    const ds = datasets[this.pathname];
    this.columns = ds?.columns || [];
  }

  loadData() {
    const key = pathMap[this.pathname];
    if (!key) {
      const ds = datasets[this.pathname];
      this.rows = ds?.rows || [];
      return;
    }

    this.loading = true;
    this.apiService.fetchModuleData(key).subscribe({
      next: (res) => {
        this.rows = res || [];
        this.loading = false;
      },
      error: () => {
        const ds = datasets[this.pathname];
        this.rows = ds?.rows || [];
        this.loading = false;
      }
    });
  }

  getFiltered(): any[] {
    if (!this.q) return this.rows;
    const lower = this.q.toLowerCase();
    return this.rows.filter(r => 
      Object.values(r).some(v => String(v).toLowerCase().includes(lower))
    );
  }

  get isSolicitudes(): boolean {
    return this.pathname === "/app/proveedores/solicitudes";
  }

  get isRequerimientos(): boolean {
    return this.pathname === "/app/compras/requerimientos";
  }

  get isViaticos(): boolean {
    return this.pathname === "/app/tesoreria/viaticos/solicitud";
  }

  get isDirectorio(): boolean {
    return this.pathname === "/app/proveedores/directorio";
  }

  get isComites(): boolean {
    return this.pathname === "/app/comite/lista";
  }

  get isOrdenes(): boolean {
    return this.pathname === "/app/compras/ordenes";
  }

  get isRecepciones(): boolean {
    return this.pathname === "/app/compras/recepciones";
  }

  get isCxp(): boolean {
    return this.pathname === "/app/tesoreria/cxp";
  }

  get isPagos(): boolean {
    return this.pathname === "/app/tesoreria/pagos";
  }

  handleNewClick() {
    if (this.isComites) {
      this.openNewComite = true;
    } else {
      this.openNew = true;
    }
  }

  handleCreate(newRow: any) {
    if (this.isRequerimientos) {
      this.apiService.createRequerimiento(newRow).subscribe(() => this.loadData());
    } else if (this.isViaticos) {
      this.apiService.createViatico({ ...newRow, codigo: `VIA-2026-${Math.floor(Math.random() * 1000)}` }).subscribe(() => this.loadData());
    } else if (this.isSolicitudes) {
      this.apiService.createSolicitudProveedor(newRow).subscribe(() => this.loadData());
    } else if (this.isComites) {
      this.apiService.createComite(newRow).subscribe(() => this.loadData());
    }
  }

  handleUpdate(updatedRow: any) {
    const key = pathMap[this.pathname];
    if (!key) return;

    this.apiService.updateModuleData(key, updatedRow.id, updatedRow).subscribe(() => this.loadData());
  }

  approveRow(row: any) {
    if (this.isSolicitudes) {
      const stages = ["Registro", "Documentación", "Validación Legal", "Aprobación", "Alta en SEA"];
      const current = row.etapa || "Registro";
      const nextIdx = stages.indexOf(current) + 1;
      if (nextIdx < stages.length) {
        this.apiService.updateSolicitudProveedor(row.id, { etapa: stages[nextIdx] }).subscribe(() => this.loadData());
      }
    } else if (this.isRequerimientos) {
      const stages = ["Solicitud", "Aprobación", "Compras", "Presupuesto", "Orden Compra", "Recepción", "Pago"];
      const current = row.etapa_negocio || "Solicitud";
      const nextIdx = stages.indexOf(current) + 1;
      if (nextIdx < stages.length) {
        this.apiService.updateEtapaRequerimiento(row.id, stages[nextIdx]).subscribe(() => this.loadData());
      }
    } else if (this.isViaticos) {
      const stages = ["Solicitud", "Aprobación", "Presupuesto", "Pago", "Rendición"];
      const current = row.etapa || "Solicitud";
      const nextIdx = stages.indexOf(current) + 1;
      if (nextIdx < stages.length) {
        this.apiService.updateEtapaViatico(row.id, stages[nextIdx]).subscribe(() => this.loadData());
      }
    }
  }

  getApprovalTooltip(row: any): string {
    switch(row.etapa_negocio) {
      case "Solicitud": return "Aprobar (Director)";
      case "Aprobación": return "Iniciar Compras";
      case "Compras": return "Enviar a Presupuesto";
      case "Presupuesto": return "Generar OC";
      case "Orden Compra": return "Recibir en Almacén";
      case "Recepción": return "Enviar a Pagos";
      default: return "Finalizar";
    }
  }

  getApprovalIcon(row: any): string {
    switch(row.etapa_negocio) {
      case "Solicitud": return "gavel";
      case "Orden Compra": return "package-check";
      case "Recepción": return "banknote";
      default: return "plus";
    }
  }

  openRendicionModal(row: any) {
    this.selectedViatico = row;
    this.openRendicion = true;
  }

  openRevisionExpediente = false;
  selectedExpedienteRow: any = null;

  consultRow(row: any) {
    this.selectedRow = row;
    const id = row.id || 0;
    if (this.isSolicitudes) {
      this.selectedExpedienteRow = row;
      this.openRevisionExpediente = true;
    } else if (this.pathname === "/app/compras/presupuestos") {
      this.router.navigate([`/app/compras/presupuestos/detalle/${id}`]);
    } else {
      this.openDetail = true;
    }
  }

  handleApprovedExpediente(row: any) {
    if (row) {
      row.etapa = "Aprobado";
      row.estatus = "Aprobado";
    }
    this.loadData();
  }

  editRow(row: any) {
    const id = row.id || 0;
    if (this.isDirectorio) this.router.navigate([`/app/proveedores/directorio/editar/${id}`]);
    else if (this.isSolicitudes) this.router.navigate([`/app/proveedores/solicitudes/editar/${id}`]);
    else if (this.isRequerimientos) this.router.navigate([`/app/compras/requerimientos/editar/${id}`]);
    else if (this.isOrdenes) this.router.navigate([`/app/compras/ordenes/editar/${id}`]);
    else if (this.isRecepciones) this.router.navigate([`/app/compras/recepciones/editar/${id}`]);
    else if (this.isCxp) this.router.navigate([`/app/tesoreria/cxp/editar/${id}`]);
    else if (this.isPagos) this.router.navigate([`/app/tesoreria/pagos/editar/${id}`]);
    else {
      this.selectedRow = row;
      this.openEdit = true;
    }
  }

  formatMoney(val: any) {
    return fmtMoney(Number(val) || 0);
  }

  formatDate(val: any) {
    return fmtDate(String(val) || '');
  }

  badgeTone(v: string | null): string {
    if (!v) return "bg-slate-100 text-slate-600 border-slate-200";
    const s = v.toLowerCase();
    if (["activo", "aprobado", "aprobada", "vigente", "procesado", "completa", "enviado", "enviada", "pagado", "recibida"].includes(s)) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (["pendiente", "en revisión", "en proceso", "borrador", "en tránsito", "diferido", "por vencer", "parcial", "normal", "programada"].includes(s)) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    if (["inactivo", "rechazado", "rechazada", "vencido", "vencida", "urgente"].includes(s)) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (["a", "emitida"].includes(s)) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    return "bg-slate-100 text-slate-600 border-slate-200";
  }
}
