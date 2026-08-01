import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-nueva-solicitud-generica-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="w-full max-w-md bg-white border-2 border-primary rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        <!-- Header -->
        <div class="p-5 border-b-2 border-primary/20 bg-muted/45 flex items-center justify-between">
          <div>
            <h3 class="text-xl font-black text-primary">
              {{ type === 'compra' ? 'Nueva Solicitud de Compra' : 'Nueva Solicitud de Viáticos' }}
            </h3>
            <p class="text-xs text-muted-foreground mt-0.5">Completa los campos para iniciar el flujo de aprobación.</p>
          </div>
          <button (click)="close()" class="h-8 w-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-muted-foreground">
            <lucide-icon name="x" class="h-5 w-5"></lucide-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-4">
          
          <!-- Compra fields -->
          <ng-container *ngIf="type === 'compra'">
            <div class="space-y-1.5">
              <label class="text-xs uppercase tracking-wider font-bold">Descripción del Bien o Servicio</label>
              <textarea [(ngModel)]="descripcion" placeholder="Ej: Cámara profesional para marketing..." class="w-full min-h-[80px] p-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Cantidad</label>
                <input type="text" [(ngModel)]="cantidad" placeholder="Ej: 1 unidad" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Centro de Costo</label>
                <select [(ngModel)]="centro" class="w-full h-11 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary bg-white">
                  <option value="" disabled>Seleccionar...</option>
                  <option *ngFor="let c of centros" [value]="c">{{ c }}</option>
                </select>
              </div>
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
          <button (click)="submit()" class="h-10 px-4 bg-primary text-white hover:bg-primary/95 border-2 border-primary rounded-xl font-bold transition-all">
            Crear Solicitud
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
  centro = '';
  motivo = '';
  destino = '';
  monto = '';

  centros = ["Operaciones", "Administración", "Ventas", "IT", "Marketing"];

  close() {
    this.reset();
    this.open = false;
    this.openChange.emit(false);
  }

  reset() {
    this.descripcion = '';
    this.cantidad = '';
    this.centro = '';
    this.motivo = '';
    this.destino = '';
    this.monto = '';
  }

  submit() {
    const today = new Date().toISOString().slice(0, 10);
    const code = this.type === 'compra' 
      ? `SOL-2026-${Math.floor(1000 + Math.random() * 9000)}`
      : `VIA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRow = this.type === 'compra' ? {
      codigo: code,
      tipo_orden: "Producto",
      solicitante: "Isaac Lovera",
      departamento: "Administración",
      descripcion: this.descripcion,
      cantidad_unidad: this.cantidad,
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
