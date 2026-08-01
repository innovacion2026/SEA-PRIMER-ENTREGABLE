import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-compras-solicitud-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  template: `
    <div class="space-y-6" *ngIf="form">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button (click)="goBack()" class="h-10 w-10 inline-flex items-center justify-center border-2 border-foreground rounded-xl bg-white hover:bg-slate-100 transition-all">
            <lucide-icon name="chevron-down" class="h-4 w-4 rotate-90"></lucide-icon>
          </button>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-bold tracking-tight">{{ form.codigo }}</h1>
              <span [class]="'font-bold uppercase px-3 py-0.5 rounded-full text-xs border ' + badgeTone(form.estatus)">
                {{ form.estatus }}
              </span>
            </div>
            <p class="text-sm text-muted-foreground mt-0.5">Edición detallada de solicitud de compra</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button *ngIf="form.estatus === 'BORRADOR'" (click)="sendToReview()" class="h-10 px-4 border-2 border-primary text-primary hover:bg-primary/5 rounded-xl font-bold flex items-center gap-1.5 transition-all">
            <lucide-icon name="check" class="h-4 w-4"></lucide-icon> Enviar a Revisión
          </button>
          <button (click)="save()" class="h-10 px-4 bg-primary text-white hover:bg-primary/95 border-2 border-primary rounded-xl font-bold flex items-center gap-1.5 transition-all">
            <lucide-icon name="plus" class="h-4 w-4"></lucide-icon> Guardar Cambios
          </button>
        </div>
      </div>

      <!-- Progress Flow Progress Bar -->
      <div class="card-elevated p-6 bg-slate-50 border rounded-2xl">
        <div class="relative flex justify-between max-w-4xl mx-auto">
          <div *ngFor="let step of flowSteps; let i = index" class="flex flex-col items-center z-10 w-1/5">
            <div [class]="'h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ' + (i < currentStepIdx ? 'bg-emerald-500 border-emerald-500 text-white' : i === currentStepIdx ? 'bg-primary border-primary text-white' : 'bg-white border-slate-300 text-slate-400')">
              <lucide-icon [name]="step.icon" class="h-5 w-5"></lucide-icon>
            </div>
            <span [class]="'text-[10px] font-bold mt-2 uppercase tracking-tighter text-center px-1 ' + (i <= currentStepIdx ? 'text-primary' : 'text-slate-400')">
              {{ step.label }}
            </span>
          </div>
          <div class="absolute top-5 left-[5%] right-[5%] h-0.5 bg-slate-200 -z-0"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
          <div class="card-elevated p-6 space-y-6 bg-white border rounded-2xl shadow-sm">
            <div class="flex items-center gap-2 text-primary font-bold border-b pb-2">
              <lucide-icon name="clipboard-edit" class="h-5 w-5"></lucide-icon>
              Detalles del Requerimiento
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs uppercase tracking-wider font-bold">Tipo de Requerimiento</label>
                  <select [(ngModel)]="form.tipo_orden" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary bg-white">
                    <option value="Producto">Orden de Producto</option>
                    <option value="Servicio">Orden de Servicio</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs uppercase tracking-wider font-bold">Prioridad</label>
                  <select [(ngModel)]="form.prioridad" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary bg-white">
                    <option *ngFor="let p of prioridades" [value]="p">{{ p }}</option>
                  </select>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Descripción detallada</label>
                <textarea [(ngModel)]="form.descripcion" placeholder="Describa qué se necesita exactamente..." class="w-full min-h-[120px] p-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary"></textarea>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Cantidad y Unidad</label>
                <input type="text" [(ngModel)]="form.cantidad_unidad" placeholder="Ej: 10 unidades, 1 servicio global" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary" />
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <div class="card-elevated p-6 space-y-4 bg-white border rounded-2xl shadow-sm">
            <div class="flex items-center gap-2 text-primary font-bold border-b pb-2">
              <lucide-icon name="user" class="h-5 w-5"></lucide-icon>
              Solicitante
            </div>
            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Nombre completo</label>
                <input type="text" [(ngModel)]="form.solicitante" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Departamento</label>
                <select [(ngModel)]="form.departamento" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none bg-white">
                  <option *ngFor="let d of departamentos" [value]="d">{{ d }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="card-elevated p-6 space-y-4 bg-white border rounded-2xl shadow-sm">
            <div class="flex items-center gap-2 text-primary font-bold border-b pb-2">
              <lucide-icon name="calculator" class="h-5 w-5"></lucide-icon>
              Presupuesto
            </div>
            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Centro de Costos</label>
                <select [(ngModel)]="form.centro_costo" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none bg-white">
                  <option *ngFor="let c of centrosCosto" [value]="c">{{ c }}</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Monto Estimado (USD)</label>
                <input type="number" [(ngModel)]="form.monto_estimado" placeholder="0.00" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ComprasSolicitudEditComponent implements OnInit {
  id = '';
  form: any = null;

  prioridades = ["Urgente", "Normal", "Programada"];
  centrosCosto = ["Administración", "Operaciones", "Ventas", "IT", "Logística", "Mantenimiento"];
  departamentos = ["Administración", "Operaciones", "Ventas", "IT", "Legal", "Recursos Humanos"];

  flowSteps = [
    { label: "Solicitud", icon: "edit" },
    { label: "Compras", icon: "search" },
    { label: "Presupuesto", icon: "shield-check" },
    { label: "Orden Compra", icon: "file-signature" },
    { label: "Pago", icon: "banknote" }
  ];

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.loadRequerimiento();
  }

  loadRequerimiento() {
    this.apiService.fetchRequerimiento(this.id).subscribe({
      next: (res: any) => {
        this.form = {
          ...res,
          centro_costo: res.centro_costo || res.centrocosto || ''
        };
      }
    });
  }

  get currentStepIdx(): number {
    if (!this.form?.etapa_negocio) return 0;
    const label = this.form.etapa_negocio.toLowerCase();
    const idx = this.flowSteps.findIndex(s => s.label.toLowerCase() === label);
    return idx === -1 ? 0 : idx;
  }

  badgeTone(s?: string) {
    if (!s) return "bg-slate-100 text-slate-600 border-slate-200";
    const v = s.toLowerCase();
    if (["aprobada", "enviada", "enviado"].includes(v)) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (["borrador", "normal", "programada", "en proceso"].includes(v)) return "bg-amber-50 text-amber-700 border-amber-200";
    if (["rechazada", "urgente"].includes(v)) return "bg-rose-50 text-rose-700 border-rose-200";
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  goBack() {
    this.router.navigate(['/app/compras/requerimientos']);
  }

  sendToReview() {
    this.form.estatus = 'ENVIADA';
    this.save();
  }

  save() {
    this.apiService.updateRequerimiento(this.id, this.form).subscribe(() => this.goBack());
  }
}
