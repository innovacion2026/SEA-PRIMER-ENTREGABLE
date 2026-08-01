import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

interface Partida {
  codigo: string;
  nombre: string;
  disponible: number;
}

@Component({
  selector: 'app-nueva-solicitud-generica-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="w-full max-w-lg bg-white border-2 border-primary rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        <!-- Header -->
        <div class="p-5 border-b-2 border-primary/20 bg-muted/45 flex items-center justify-between">
          <div>
            <h3 class="text-xl font-black text-primary">
              {{ type === 'compra' ? 'Nueva Solicitud de Compra' : 'Nueva Solicitud de Viáticos' }}
            </h3>
            <p class="text-xs text-muted-foreground mt-0.5">Validación de disponibilidad de partida presupuestaria al crear.</p>
          </div>
          <button (click)="close()" class="h-8 w-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-muted-foreground">
            <lucide-icon name="x" class="h-5 w-5"></lucide-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-4 text-sm">
          
          <!-- Compra fields -->
          <ng-container *ngIf="type === 'compra'">
            <div class="space-y-1.5">
              <label class="text-xs uppercase tracking-wider font-bold">Descripción del Bien o Servicio *</label>
              <textarea [(ngModel)]="descripcion" placeholder="Ej: Servidores de alta disponibilidad..." class="w-full min-h-[70px] p-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Cantidad / Unidad *</label>
                <input type="text" [(ngModel)]="cantidad" placeholder="Ej: 2 unidades" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Monto Estimado USD *</label>
                <input type="number" [(ngModel)]="montoEstimado" (input)="validarPresupuesto()" placeholder="0.00" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary font-mono font-bold" />
              </div>
            </div>

            <!-- Partida Presupuestaria Picker -->
            <div class="space-y-1.5">
              <label class="text-xs uppercase tracking-wider font-bold">Partida Presupuestaria del Banco *</label>
              <select [(ngModel)]="partidaSeleccionada" (change)="validarPresupuesto()" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary bg-white font-medium">
                <option [ngValue]="null" disabled>Seleccionar Partida Presupuestaria...</option>
                <option *ngFor="let p of partidas" [ngValue]="p">
                  {{ p.codigo }} - {{ p.nombre }} (Disponible: {{ '$' + p.disponible.toLocaleString() }})
                </option>
              </select>
            </div>

            <!-- Budget Validation Status Banner -->
            <div *ngIf="partidaSeleccionada" class="mt-2">
              <div *ngIf="presupuestoValido === true" class="p-3 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <lucide-icon name="check-circle" class="h-5 w-5 text-emerald-600 shrink-0"></lucide-icon>
                <div>
                  <span class="font-bold">Disponibilidad Presupuestaria Confirmada:</span>
                  <div>Monto reservado: {{ '$' + (montoEstimado || 0).toLocaleString() }} USD · Saldo restante: {{ '$' + (partidaSeleccionada.disponible - (montoEstimado || 0)).toLocaleString() }} USD</div>
                </div>
              </div>

              <div *ngIf="presupuestoValido === false" class="p-3 rounded-xl bg-red-50 border-2 border-red-400 text-red-800 text-xs flex items-center gap-2 font-medium">
                <lucide-icon name="alert-circle" class="h-5 w-5 text-red-600 shrink-0"></lucide-icon>
                <div>
                  <span class="font-bold uppercase tracking-wider text-red-700">Imputación Rechazada:</span>
                  <div>La partida posee sólo {{ '$' + partidaSeleccionada.disponible.toLocaleString() }} USD. Insuficiente para cubrir {{ '$' + (montoEstimado || 0).toLocaleString() }} USD.</div>
                </div>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs uppercase tracking-wider font-bold">Centro de Costo</label>
              <select [(ngModel)]="centro" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary bg-white">
                <option value="" disabled>Seleccionar...</option>
                <option *ngFor="let c of centros" [value]="c">{{ c }}</option>
              </select>
            </div>
          </ng-container>

          <!-- Viatico fields -->
          <ng-container *ngIf="type === 'viatico'">
            <div class="space-y-1.5">
              <label class="text-xs uppercase tracking-wider font-bold">Motivo del Viaje</label>
              <input type="text" [(ngModel)]="motivo" placeholder="Ej: Reunión con clientes..." class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Destino</label>
                <input type="text" [(ngModel)]="destino" placeholder="Ej: Valencia, ES" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Monto Estimado (USD)</label>
                <input type="number" [(ngModel)]="monto" placeholder="0.00" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary" />
              </div>
            </div>
          </ng-container>

        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-200 bg-muted/45 flex justify-end gap-2">
          <button (click)="close()" class="h-10 px-4 border-2 border-slate-300 rounded-xl font-bold bg-white hover:bg-slate-100 transition-all">Cancelar</button>
          <button (click)="submit()" [disabled]="type === 'compra' && presupuestoValido !== true" class="h-10 px-5 bg-primary text-white hover:bg-primary/95 disabled:opacity-50 border-2 border-primary rounded-xl font-bold transition-all flex items-center gap-2">
            <lucide-icon name="check" class="h-4 w-4"></lucide-icon> Crear Solicitud
          </button>
        </div>

      </div>
    </div>
  `
})
export class NuevaSolicitudGenericaDialogComponent {
  @Input() open = false;
  @Input() type: 'compra' | 'viatico' = 'compra';
  @Output() openChange = new EventEmitter<boolean>();
  @Output() create = new EventEmitter<any>();

  descripcion = '';
  cantidad = '';
  montoEstimado: number | null = 12500;
  centro = 'IT';
  motivo = '';
  destino = '';
  monto = '';

  partidas: Partida[] = [
    { codigo: "PART-401.01.02", nombre: "Equipos de Computación e Infraestructura", disponible: 25000 },
    { codigo: "PART-401.02.05", nombre: "Licenciamiento de Software y Base de Datos", disponible: 18000 },
    { codigo: "PART-402.01.01", nombre: "Materiales y Suministros de Oficina", disponible: 2500 },
    { codigo: "PART-403.05.01", nombre: "Asesoría y Servicios Profesionales", disponible: 0 }
  ];

  partidaSeleccionada: Partida | null = this.partidas[0];
  presupuestoValido: boolean | null = true;

  centros = ["Operaciones", "Administración", "Ventas", "IT", "Marketing"];

  validarPresupuesto() {
    if (!this.partidaSeleccionada || this.montoEstimado === null || this.montoEstimado === undefined) {
      this.presupuestoValido = null;
      return;
    }
    this.presupuestoValido = Number(this.montoEstimado) > 0 && Number(this.montoEstimado) <= this.partidaSeleccionada.disponible;
  }

  close() {
    this.reset();
    this.open = false;
    this.openChange.emit(false);
  }

  reset() {
    this.descripcion = '';
    this.cantidad = '';
    this.montoEstimado = 12500;
    this.centro = 'IT';
    this.motivo = '';
    this.destino = '';
    this.monto = '';
    this.partidaSeleccionada = this.partidas[0];
    this.presupuestoValido = true;
  }

  submit() {
    if (this.type === 'compra' && this.presupuestoValido !== true) return;

    const today = new Date().toISOString().slice(0, 10);
    const code = this.type === 'compra' 
      ? `SOL-2026-${Math.floor(1000 + Math.random() * 9000)}`
      : `VIA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRow = this.type === 'compra' ? {
      codigo: code,
      tipo_orden: "Producto",
      solicitante: "Isaac Lovera",
      departamento: "Administración",
      descripcion: this.descripcion || "Suministro de Equipamiento IT",
      cantidad_unidad: this.cantidad || "1 unidad",
      montoEstimado: this.montoEstimado,
      partida: this.partidaSeleccionada?.codigo,
      centroCosto: this.centro || "General",
      prioridad: "Normal",
      fecha: today,
      estatus: "ENVIADA",
      etapa_negocio: "Solicitud"
    } : {
      codigo: code,
      solicitante: "Isaac Lovera",
      destino: this.destino,
      ida: today,
      regreso: today,
      monto: Number(this.monto) || 0,
      estatus: "Pendiente",
      etapa: "Solicitud"
    };

    this.create.emit(newRow);
    this.close();
  }
}
