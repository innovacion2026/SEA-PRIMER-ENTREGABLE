import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../services/api.service';

interface Contacto { id: number; rol: string; nombre: string; identificacion: string; cargo: string; telefono: string; email: string }
interface HistEntry { id: number; fecha: string; usuario: string; comentario: string }
interface DocEntry { name: string; obligatorio: boolean; cargado: boolean; validado: boolean; fechaCarga?: string; fechaVenc?: string }

@Component({
  selector: 'app-proveedor-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  template: `
    <div class="space-y-6" *ngIf="data">
      
      <!-- Top header bar -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div class="flex items-center gap-3">
          <button (click)="goBack()" class="h-10 w-10 inline-flex items-center justify-center border-2 border-foreground rounded-xl bg-white hover:bg-slate-100 transition-all">
            <lucide-icon name="chevron-down" class="h-4 w-4 rotate-90"></lucide-icon>
          </button>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Editar Proveedor</h1>
            <p class="text-lg font-bold text-primary mt-0.5">
              {{ data.nombre }} <span class="text-sm font-normal text-muted-foreground ml-2">· {{ data.rif }}</span>
            </p>
          </div>
        </div>
        <div class="flex gap-2">
          <button (click)="goBack()" class="h-10 px-4 border-2 border-foreground bg-white hover:bg-slate-100 rounded-xl font-bold transition-all">Cancelar</button>
          <button (click)="save()" class="h-10 px-4 bg-primary text-white hover:bg-primary/95 border-2 border-primary rounded-xl font-bold flex items-center gap-2 transition-all">
            <lucide-icon name="plus" class="h-4 w-4"></lucide-icon> Guardar
          </button>
        </div>
      </div>

      <!-- Tab bar -->
      <div class="flex border-b-2 border-primary/20 bg-slate-50 p-1 rounded-xl gap-1">
        <button
          (click)="setTab('generales')"
          [class]="'flex-1 py-2.5 rounded-lg text-xs md:text-sm font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all ' + (activeTab === 'generales' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200')"
        >
          <lucide-icon name="building-2" class="h-3.5 w-3.5"></lucide-icon> Datos Generales
        </button>
        <button
          (click)="setTab('contactos')"
          [class]="'flex-1 py-2.5 rounded-lg text-xs md:text-sm font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all ' + (activeTab === 'contactos' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200')"
        >
          <lucide-icon name="users" class="h-3.5 w-3.5"></lucide-icon> Contactos
        </button>
        <button
          (click)="setTab('documentos')"
          [class]="'flex-1 py-2.5 rounded-lg text-xs md:text-sm font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all ' + (activeTab === 'documentos' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200')"
        >
          <lucide-icon name="file-text" class="h-3.5 w-3.5"></lucide-icon> Documentos
        </button>
        <button
          *ngIf="!isSolicitud"
          (click)="setTab('desempeno')"
          [class]="'flex-1 py-2.5 rounded-lg text-xs md:text-sm font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all ' + (activeTab === 'desempeno' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200')"
        >
          <lucide-icon name="bar-chart-3" class="h-3.5 w-3.5"></lucide-icon> Desempeño
        </button>
        <button
          *ngIf="!isSolicitud"
          (click)="setTab('historial')"
          [class]="'flex-1 py-2.5 rounded-lg text-xs md:text-sm font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all ' + (activeTab === 'historial' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200')"
        >
          <lucide-icon name="scroll-text" class="h-3.5 w-3.5"></lucide-icon> Historial
        </button>
      </div>

      <!-- Tab content panels -->
      <div [ngSwitch]="activeTab">
        
        <!-- Tab: Datos Generales -->
        <div *ngSwitchCase="'generales'" class="space-y-6">
          <div class="card-elevated p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-primary border-b pb-2">Identificación de la Empresa</h3>
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">RIF *</label>
                <input type="text" [(ngModel)]="data.rif" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Nombre Comercial *</label>
                <input type="text" [(ngModel)]="data.nombre" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Estatus</label>
                <select [(ngModel)]="data.estatus" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary bg-white">
                  <option *ngFor="let s of estatusOptions" [value]="s">{{ s }}</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Categoría</label>
                <select [(ngModel)]="data.categoria" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary bg-white">
                  <option *ngFor="let a of actividades" [value]="a">{{ a }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Contactos -->
        <div *ngSwitchCase="'contactos'" class="card-elevated p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-primary">Personas Contacto del Proveedor</h2>
              <p class="text-xs text-muted-foreground">Roles, identificación, cargo, teléfono y correo.</p>
            </div>
            <button (click)="addContacto()" class="h-9 px-3 bg-primary text-white hover:bg-primary/95 rounded-xl font-bold text-xs flex items-center gap-1.5">
              <lucide-icon name="plus" class="h-4 w-4"></lucide-icon> Agregar Contacto
            </button>
          </div>

          <div class="overflow-x-auto border-2 border-slate-100 rounded-xl">
            <table class="w-full text-sm">
              <thead class="bg-primary/[0.02] border-b-2 border-slate-200">
                <tr>
                  <th class="p-3 text-left text-xs uppercase font-bold text-slate-700">Rol</th>
                  <th class="p-3 text-left text-xs uppercase font-bold text-slate-700">Nombre</th>
                  <th class="p-3 text-left text-xs uppercase font-bold text-slate-700">Cargo</th>
                  <th class="p-3 text-left text-xs uppercase font-bold text-slate-700">Teléfono</th>
                  <th class="p-3 text-left text-xs uppercase font-bold text-slate-700">Email</th>
                  <th class="p-3 text-center text-xs font-bold text-slate-700 w-16"></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of contactos; let idx = index" class="border-b border-slate-100 last:border-0 even:bg-slate-50/30">
                  <td class="p-2">
                    <select [(ngModel)]="c.rol" class="h-9 px-2 rounded border border-slate-200 focus:outline-none bg-white">
                      <option *ngFor="let r of roles" [value]="r">{{ r }}</option>
                    </select>
                  </td>
                  <td class="p-2"><input type="text" [(ngModel)]="c.nombre" class="w-full h-9 px-2 rounded border border-slate-200 focus:outline-none" /></td>
                  <td class="p-2"><input type="text" [(ngModel)]="c.cargo" class="w-full h-9 px-2 rounded border border-slate-200 focus:outline-none" /></td>
                  <td class="p-2"><input type="text" [(ngModel)]="c.telefono" class="w-full h-9 px-2 rounded border border-slate-200 focus:outline-none" /></td>
                  <td class="p-2"><input type="email" [(ngModel)]="c.email" class="w-full h-9 px-2 rounded border border-slate-200 focus:outline-none" /></td>
                  <td class="p-2 text-center">
                    <button (click)="removeContacto(idx)" class="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg flex items-center justify-center mx-auto">
                      <lucide-icon name="trash-2" class="h-4 w-4"></lucide-icon>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab: Documentos -->
        <div *ngSwitchCase="'documentos'" class="card-elevated p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b pb-4">
            <div>
              <h2 class="text-lg font-bold text-primary">Relación de Documentos</h2>
              <p class="text-xs text-muted-foreground">Estado de carga y validación. <span class="text-destructive font-bold">*</span> indica obligatorio.</p>
            </div>
            <div class="min-w-[220px]">
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="font-bold">Completado</span>
                <span class="font-bold">{{ pctDocs }}%</span>
              </div>
              <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-primary rounded-full transition-all duration-500" [style.width.%]="pctDocs"></div>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto border-2 border-slate-100 rounded-xl">
            <table class="w-full text-sm">
              <thead class="bg-primary/[0.02] border-b-2 border-slate-200">
                <tr>
                  <th class="p-3 text-left text-xs uppercase font-bold text-slate-700">Documento</th>
                  <th class="p-3 text-left text-xs uppercase font-bold text-slate-700">Cargado</th>
                  <th class="p-3 text-left text-xs uppercase font-bold text-slate-700">Validado</th>
                  <th class="p-3 text-left text-xs uppercase font-bold text-slate-700">Vencimiento</th>
                  <th class="p-3 text-center text-xs font-bold text-slate-700 w-28"></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let d of documentos; let idx = index" class="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                  <td class="p-3 font-semibold text-slate-700">
                    {{ d.name }} <span class="text-destructive font-bold" *ngIf="d.obligatorio">*</span>
                  </td>
                  <td class="p-3">
                    <span [class]="'px-2 py-0.5 rounded-full text-[10px] font-bold border ' + (d.cargado ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200')">
                      {{ d.cargado ? 'Sí' : 'No' }}
                    </span>
                  </td>
                  <td class="p-3">
                    <span [class]="'px-2 py-0.5 rounded-full text-[10px] font-bold border ' + (d.validado ? 'bg-primary/10 text-primary border-primary/20' : 'bg-amber-50 text-amber-700 border-amber-200')">
                      {{ d.validado ? 'Validado' : 'Pendiente' }}
                    </span>
                  </td>
                  <td class="p-3 tabular-nums text-slate-600 font-semibold">{{ d.fechaVenc || '—' }}</td>
                  <td class="p-3 text-center">
                    <div class="flex justify-end gap-1">
                      <button (click)="toggleCargado(idx)" class="h-8 w-8 text-primary hover:bg-primary/10 rounded-lg flex items-center justify-center">
                        <lucide-icon name="plus" class="h-4 w-4"></lucide-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab: Desempeno -->
        <div *ngSwitchCase="'desempeno'" class="space-y-6">
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="card-elevated p-4 border-2 border-primary/20 bg-white rounded-xl">
              <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Cumplimiento de Entregas</div>
              <div class="text-3xl font-black mt-1 text-emerald-600">92%</div>
              <div class="text-xs text-muted-foreground mt-1">Fecha Recepción vs Fecha Prometida</div>
            </div>
            <div class="card-elevated p-4 border-2 border-primary/20 bg-white rounded-xl">
              <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Índice de Calidad</div>
              <div class="text-3xl font-black mt-1 text-emerald-600">88%</div>
              <div class="text-xs text-muted-foreground mt-1">Cantidad sin defectos / Solicitada</div>
            </div>
            <div class="card-elevated p-4 border-2 border-primary/20 bg-white rounded-xl">
              <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tiempo de Espera</div>
              <div class="text-3xl font-black mt-1 text-amber-600 font-bold">76%</div>
              <div class="text-xs text-muted-foreground mt-1">Eficiencia respecto al SLA</div>
            </div>
          </div>
        </div>

        <!-- Tab: Historial -->
        <div *ngSwitchCase="'historial'" class="card-elevated p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h2 class="text-lg font-bold text-primary">Historial de Comentarios</h2>
            <p class="text-xs text-muted-foreground">Registro cronológico con fecha, comentario y usuario responsable.</p>
          </div>
          <div class="space-y-3">
            <textarea [(ngModel)]="nuevoComentario" placeholder="Escriba una observación o acción tomada..." class="w-full min-h-[80px] p-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary"></textarea>
            <div class="flex justify-end">
              <button (click)="addHistorial()" class="h-10 px-4 bg-primary text-white hover:bg-primary/95 rounded-xl font-bold flex items-center gap-1.5 transition-all">
                <lucide-icon name="plus" class="h-4 w-4"></lucide-icon> Agregar al historial
              </button>
            </div>
          </div>
          <div class="border-t pt-4 space-y-3">
            <div *ngFor="let h of historial" class="border rounded-xl p-3 bg-slate-50">
              <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span class="font-bold text-slate-700">{{ h.usuario }}</span>
                <span>{{ h.fecha }}</span>
              </div>
              <p class="text-sm font-medium text-slate-800">{{ h.comentario }}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class ProveedorEditComponent implements OnInit {
  id = '';
  isSolicitud = false;
  activeTab = 'generales';
  data: any = null;

  actividades = ["Arrendamiento y Afines", "Gestión Humana", "Infraestructura", "Hoteles y Viajes", "Mantenimiento Integral", "Tecnología", "Seguridad", "Servicios Básicos", "Transporte"];
  estatusOptions = ["En revisión", "Activo", "Inactivo", "Suspendido"];
  roles = ["Ejecutivo de Cuenta", "Gerente de Cuentas", "Soporte Técnico", "Representante Legal", "Despacho / Almacén", "Cobranza", "Coordinador de Logística", "Facturación", "Tesorería"];

  contactos: Contacto[] = [
    { id: 1, rol: "Ejecutivo de Cuenta", nombre: "María Pérez", identificacion: "V-12.345.678", cargo: "Account Executive", telefono: "+58 212-555-0101", email: "mperez@proveedor.com" },
    { id: 2, rol: "Representante Legal", nombre: "Juan Rodríguez", identificacion: "V-9.876.543", cargo: "Apoderado Legal", telefono: "+58 414-555-0188", email: "legal@proveedor.com" }
  ];

  historial: HistEntry[] = [
    { id: 1, fecha: "2026-04-20 10:32", usuario: "admin@sea.com", comentario: "Actualización de datos bancarios verificada con el proveedor." }
  ];
  nuevoComentario = '';

  documentos: DocEntry[] = [];
  
  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('idx') || '';
    this.isSolicitud = this.router.url.includes('/solicitudes/');

    this.initDocumentos();
    this.loadProveedor();
  }

  initDocumentos() {
    const docs = [
      "Documento Constitutivo y Modificaciones Estatutarias",
      "Publicación de Gaceta Mercantil",
      "Productos y Servicios que Presta",
      "Designación de Junta Directiva",
      "Patente de Industria y Comercio",
      "Balance General",
      "RIF",
      "Declaración de I.S.L.R.",
      "Cédula del Representante Legal",
      "Referencia Bancaria",
      "Referencia Comercial",
      "Licencia de Actividades Económicas",
      "Estado de Resultados Último Ejercicio",
      "Carta de Inicio de Actividad Comercial",
    ];

    this.documentos = docs.map((d, k) => ({
      name: d,
      obligatorio: k % 3 !== 2,
      cargado: k % 4 !== 3,
      validado: k % 3 === 0,
      fechaVenc: k % 4 !== 3 ? "2026-12-31" : undefined
    }));
  }

  loadProveedor() {
    const req = this.isSolicitud 
      ? this.apiService.fetchSolicitudProveedor(this.id)
      : this.apiService.fetchProveedor(this.id);

    req.subscribe({
      next: (res: any) => {
        this.data = {
          ...res,
          nombre: res.nombre || res.proveedor,
          estatus: res.estatus || (this.isSolicitud ? "En revisión" : "Activo")
        };
      }
    });
  }

  get pctDocs(): number {
    const count = this.documentos.filter(d => d.cargado).length;
    return this.documentos.length ? Math.round((count / this.documentos.length) * 100) : 0;
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  goBack() {
    this.router.navigate([this.isSolicitud ? '/app/proveedores/solicitudes' : '/app/proveedores/directorio']);
  }

  addContacto() {
    this.contactos.push({
      id: Date.now(),
      rol: 'Ejecutivo de Cuenta',
      nombre: '',
      identificacion: '',
      cargo: '',
      telefono: '',
      email: ''
    });
  }

  removeContacto(idx: number) {
    this.contactos.splice(idx, 1);
  }

  toggleCargado(idx: number) {
    this.documentos[idx].cargado = !this.documentos[idx].cargado;
  }

  addHistorial() {
    if (!this.nuevoComentario.trim()) return;
    this.historial.unshift({
      id: Date.now(),
      fecha: new Date().toISOString().slice(0, 16).replace('T', ' '),
      usuario: 'admin@sea.com',
      comentario: this.nuevoComentario
    });
    this.nuevoComentario = '';
  }

  save() {
    const req = this.isSolicitud
      ? this.apiService.updateSolicitudProveedor(this.id, this.data)
      : this.apiService.updateProveedor(this.id, this.data);

    req.subscribe(() => this.goBack());
  }
}
