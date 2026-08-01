import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../services/api.service';

interface Contacto { id: number; rol: string; nombre: string; identificacion: string; cargo: string; telefono: string; email: string }
interface HistEntry { id: number; fecha: string; usuario: string; comentario: string }
interface DocEntry {
  name: string;
  obligatorio: boolean;
  cargado: boolean;
  validado: boolean;
  archivo?: string;
  fechaCarga?: string;
  fechaVenc?: string;
  origen?: 'Portal Proveedores' | 'Carga Interna';
}

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
        <div *ngSwitchCase="'documentos'" class="space-y-6">
          
          <!-- Sync Banner with Portal Proveedores -->
          <div class="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <lucide-icon name="file-text" class="h-5 w-5"></lucide-icon>
              </div>
              <div>
                <div class="text-sm font-bold text-indigo-950">Expediente Sincronizado con Portal de Proveedores (SEA-PROVEEDORES)</div>
                <div class="text-xs text-indigo-700 mt-0.5">Los archivos PDF subidos por el proveedor se reciben automáticamente para su revisión y validación administrativa.</div>
              </div>
            </div>
            <button (click)="cargarDocumentosPortal()" class="h-9 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shrink-0">
              <lucide-icon name="search" class="h-3.5 w-3.5"></lucide-icon> Sincronizar Bóveda
            </button>
          </div>

          <!-- Main Document Table -->
          <div class="card-elevated p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b pb-4">
              <div>
                <h2 class="text-lg font-bold text-primary">Relación de Documentos y Recaudos Adjuntos</h2>
                <p class="text-xs text-muted-foreground">Revise el archivo PDF cargado por el proveedor y proceda a su validación. <span class="text-destructive font-bold">*</span> indica obligatorio.</p>
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
                    <th class="p-3 text-left text-xs uppercase font-bold text-slate-700">Documento / Tipo</th>
                    <th class="p-3 text-left text-xs uppercase font-bold text-slate-700">Archivo PDF Adjunto</th>
                    <th class="p-3 text-left text-xs uppercase font-bold text-slate-700">Origen Carga</th>
                    <th class="p-3 text-center text-xs uppercase font-bold text-slate-700">Validado</th>
                    <th class="p-3 text-left text-xs uppercase font-bold text-slate-700">Vencimiento</th>
                    <th class="p-3 text-center text-xs font-bold text-slate-700 w-36">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let d of documentos; let idx = index" class="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td class="p-3 font-semibold text-slate-800">
                      <div>{{ d.name }} <span class="text-destructive font-bold" *ngIf="d.obligatorio">*</span></div>
                    </td>
                    <td class="p-3 font-mono text-xs">
                      <div *ngIf="d.cargado && d.archivo" class="flex items-center gap-1.5 text-primary font-bold">
                        <lucide-icon name="file-text" class="h-4 w-4 text-primary shrink-0"></lucide-icon>
                        <span class="underline cursor-pointer" (click)="verPdfModal(d)">{{ d.archivo }}</span>
                      </div>
                      <span *ngIf="!d.cargado" class="text-slate-400 font-sans italic">Sin archivo subido</span>
                    </td>
                    <td class="p-3 text-xs">
                      <span [class]="'px-2 py-0.5 rounded-full text-[10px] font-extrabold border ' + (d.origen === 'Portal Proveedores' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-600 border-slate-200')">
                        {{ d.origen || 'Portal Proveedores' }}
                      </span>
                    </td>
                    <td class="p-3 text-center">
                      <span [class]="'px-2 py-0.5 rounded-full text-[10px] font-bold border ' + (d.validado ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200')">
                        {{ d.validado ? 'Validado' : 'Pendiente' }}
                      </span>
                    </td>
                    <td class="p-3 tabular-nums text-slate-600 font-semibold text-xs">{{ d.fechaVenc || '—' }}</td>
                    <td class="p-3 text-center">
                      <div class="flex items-center justify-center gap-1.5">
                        <button *ngIf="d.cargado" (click)="verPdfModal(d)" class="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1">
                          <lucide-icon name="eye" class="h-3.5 w-3.5 text-primary"></lucide-icon> Ver
                        </button>
                        <button (click)="toggleValidado(idx)" [class]="'h-8 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ' + (d.validado ? 'bg-emerald-100 text-emerald-800' : 'bg-primary text-white hover:bg-primary/90')">
                          <lucide-icon name="check-circle" class="h-3.5 w-3.5"></lucide-icon> {{ d.validado ? 'Aprobado' : 'Validar' }}
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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

      <!-- Viewer Modal for Attached PDF Document -->
      <div *ngIf="selectedDocModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div class="w-full max-w-xl bg-white border-2 border-primary rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div class="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <lucide-icon name="file-text" class="h-5 w-5 text-white"></lucide-icon>
              </div>
              <div>
                <h3 class="text-base font-bold">{{ selectedDocModal.name }}</h3>
                <p class="text-xs text-slate-300 font-mono">{{ selectedDocModal.archivo }}</p>
              </div>
            </div>
            <button (click)="selectedDocModal = null" class="h-8 w-8 text-slate-400 hover:text-white flex items-center justify-center">
              <lucide-icon name="x" class="h-5 w-5"></lucide-icon>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div class="flex justify-between">
                <span class="font-bold text-slate-500">Origen de Carga:</span>
                <span class="font-bold text-indigo-700 font-mono">{{ selectedDocModal.origen || 'Portal Proveedores (SEA-PROVEEDORES)' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-bold text-slate-500">Fecha de Recepción:</span>
                <span class="font-mono">{{ selectedDocModal.fechaCarga || '2026-08-01' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-bold text-slate-500">Estado Validación:</span>
                <span [class]="'font-bold ' + (selectedDocModal.validado ? 'text-emerald-600' : 'text-amber-600')">
                  {{ selectedDocModal.validado ? 'VALIDADO Y APROBADO' : 'PENDIENTE DE VALIDACIÓN' }}
                </span>
              </div>
            </div>

            <!-- Fake PDF Preview Box -->
            <div class="h-44 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center text-white text-center p-4">
              <lucide-icon name="file-text" class="h-12 w-12 text-primary mb-2"></lucide-icon>
              <div class="font-bold text-sm">{{ selectedDocModal.archivo }}</div>
              <div class="text-xs text-slate-400 mt-1">Vista previa del documento legal oficial</div>
            </div>
          </div>

          <div class="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button (click)="selectedDocModal = null" class="h-10 px-4 border border-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200">
              Cerrar
            </button>
            <button (click)="aprobarModalDoc()" class="h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md">
              <lucide-icon name="check-circle" class="h-4 w-4"></lucide-icon> Marcar Documento como Validado
            </button>
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
  selectedDocModal: DocEntry | null = null;

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
    this.documentos = [
      { name: "Documento Constitutivo y Modificaciones Estatutarias", obligatorio: true, cargado: true, validado: true, archivo: "REGISTRO_MERCANTIL_ANDINA.pdf", fechaCarga: "2026-01-15", fechaVenc: "2026-12-31", origen: "Portal Proveedores" },
      { name: "Publicación de Gaceta Mercantil", obligatorio: true, cargado: true, validado: false, archivo: "GACETA_MERCANTIL_ANDINA.pdf", fechaCarga: "2026-02-10", fechaVenc: "2026-12-31", origen: "Portal Proveedores" },
      { name: "Productos y Servicios que Presta", obligatorio: false, cargado: true, validado: false, archivo: "CATALOGO_SERVICIOS.pdf", fechaCarga: "2026-03-01", fechaVenc: "2026-12-31", origen: "Portal Proveedores" },
      { name: "Designación de Junta Directiva", obligatorio: true, cargado: false, validado: true, fechaVenc: undefined, origen: "Portal Proveedores" },
      { name: "Patente de Industria y Comercio", obligatorio: true, cargado: true, validado: false, archivo: "PATENTE_CARACAS_2026.pdf", fechaCarga: "2026-04-05", fechaVenc: "2026-12-31", origen: "Portal Proveedores" },
      { name: "Balance General", obligatorio: false, cargado: true, validado: false, archivo: "BALANCE_GENERAL_AUDITADO.pdf", fechaCarga: "2026-05-12", fechaVenc: "2026-12-31", origen: "Portal Proveedores" },
      { name: "RIF", obligatorio: true, cargado: true, validado: true, archivo: "RIF_ANDINA_2026.pdf", fechaCarga: "2026-01-15", fechaVenc: "2026-12-31", origen: "Portal Proveedores" },
      { name: "Solvencia Laboral Vigente", obligatorio: true, cargado: true, validado: false, archivo: "SOLVENCIA_LABORAL_2026.pdf", fechaCarga: "2026-08-01", fechaVenc: "2026-12-31", origen: "Portal Proveedores" },
      { name: "Certificación Bancaria Oficial", obligatorio: true, cargado: true, validado: true, archivo: "CERTIFICACION_MERCANTIL.pdf", fechaCarga: "2026-01-15", fechaVenc: "2026-07-15", origen: "Portal Proveedores" }
    ];
  }

  cargarDocumentosPortal() {
    alert("¡Bóveda de Documentos sincronizada en tiempo real con SEA-PROVEEDORES!");
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

  toggleValidado(idx: number) {
    this.documentos[idx].validado = !this.documentos[idx].validado;
  }

  verPdfModal(doc: DocEntry) {
    this.selectedDocModal = doc;
  }

  aprobarModalDoc() {
    if (this.selectedDocModal) {
      this.selectedDocModal.validado = true;
      this.selectedDocModal = null;
      alert("¡Documento validado y aprobado exitosamente!");
    }
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
