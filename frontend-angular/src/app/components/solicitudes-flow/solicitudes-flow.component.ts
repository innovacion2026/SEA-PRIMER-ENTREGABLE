import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface Row {
  codigo: string;
  proveedor: string;
  etapa: string;
  estatus: string;
}

@Component({
  selector: 'app-solicitudes-flow',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="card-elevated p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider">Flujo de Aprobación de Proveedores</h3>
          <p class="text-xs text-muted-foreground mt-0.5">
            Etapas que recorre cada solicitud antes del alta definitiva en SEA.
          </p>
        </div>
        <span class="text-xs text-muted-foreground tabular-nums">
          {{ rows.length }} solicitudes activas
        </span>
      </div>

      <div class="flex flex-col lg:flex-row lg:items-stretch gap-3">
        <ng-container *ngFor="let stage of counts; let idx = index; let isLast = last">
          <div class="flex-1 flex items-stretch gap-3 min-w-0">
            <div
              [class]="'flex-1 min-w-0 rounded-md border-2 p-3 transition-all relative overflow-hidden ' + stage.border + ' ' + (stage.items.length > 0 ? stage.bg : 'bg-background opacity-70')"
            >
              <div class="absolute top-0 left-0 right-0 h-1 bg-black/5">
                <div [class]="'h-full ' + stage.bar" [style.width.%]="((idx + 1) / counts.length) * 100"></div>
              </div>
              
              <div class="flex items-center gap-2 mb-2">
                <div
                  [class]="'h-8 w-8 inline-flex items-center justify-center rounded-md border-2 shrink-0 ' + stage.chip + ' ' + (stage.items.length === 0 ? 'opacity-60' : '')"
                >
                  <lucide-icon [name]="stage.icon" class="h-4 w-4"></lucide-icon>
                </div>
                <div class="min-w-0">
                  <div class="text-[10px] uppercase tracking-wider text-muted-foreground leading-none mb-0.5">
                    Paso {{ idx + 1 }}
                  </div>
                  <div class="text-[11px] font-bold leading-tight text-foreground">
                    {{ stage.label }}
                  </div>
                </div>
                <span
                  [class]="'ml-auto tabular-nums text-xs font-bold rounded-full px-2 py-0.5 border ' + (stage.items.length > 0 ? stage.badge : 'border-border text-muted-foreground bg-muted')"
                >
                  {{ stage.items.length }}
                </span>
              </div>
              
              <ul class="space-y-1">
                <li *ngIf="stage.items.length === 0" class="text-xs text-muted-foreground italic">Sin solicitudes</li>
                <li
                  *ngFor="let r of stage.items | slice:0:3"
                  class="text-xs flex items-center gap-1.5 text-foreground/85"
                  [title]="r.codigo + ' · ' + r.proveedor"
                >
                  <lucide-icon name="check" class="h-3 w-3 shrink-0"></lucide-icon>
                  <span class="truncate">{{ r.proveedor }}</span>
                </li>
                <li *ngIf="stage.items.length > 3" class="text-[11px] text-muted-foreground">
                  +{{ stage.items.length - 3 }} más
                </li>
              </ul>
            </div>
            
            <div *ngIf="!isLast" class="hidden lg:flex items-center text-foreground/40 font-bold">
              →
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `
})
export class SolicitudesFlowComponent {
  private _rows: Row[] = [];

  @Input() set rows(value: Row[]) {
    this._rows = value || [];
    this.updateCounts();
  }

  get rows(): Row[] {
    return this._rows;
  }

  counts: { key: string; label: string; icon: string; border: string; bg: string; chip: string; badge: string; bar: string; items: Row[] }[] = [];

  stages = [
    {
      key: "Registro",
      label: "Registro",
      icon: "list-checks",
      border: "border-slate-400",
      bg: "bg-slate-50",
      chip: "bg-slate-400 text-white border-slate-400",
      badge: "border-slate-400 text-slate-700 bg-white",
      bar: "bg-slate-400",
    },
    {
      key: "Documentación",
      label: "Documentación",
      icon: "file-text",
      border: "border-sky-500",
      bg: "bg-sky-50",
      chip: "bg-sky-500 text-white border-sky-500",
      badge: "border-sky-500 text-sky-700 bg-white",
      bar: "bg-sky-500",
    },
    {
      key: "Validación Legal",
      label: "Validación Legal",
      icon: "shield",
      border: "border-indigo-500",
      bg: "bg-indigo-50",
      chip: "bg-indigo-500 text-white border-indigo-500",
      badge: "border-indigo-500 text-indigo-700 bg-white",
      bar: "bg-indigo-500",
    },
    {
      key: "Aprobación",
      label: "Aprobación",
      icon: "shield-check",
      border: "border-amber-500",
      bg: "bg-amber-50",
      chip: "bg-amber-500 text-white border-amber-500",
      badge: "border-amber-500 text-amber-700 bg-white",
      bar: "bg-amber-505",
    },
    {
      key: "Alta en SEA",
      label: "Alta en SEA",
      icon: "calculator",
      border: "border-emerald-600",
      bg: "bg-emerald-50",
      chip: "bg-emerald-600 text-white border-emerald-600",
      badge: "border-emerald-600 text-emerald-700 bg-white",
      bar: "bg-emerald-600",
    },
  ];

  private updateCounts() {
    this.counts = this.stages.map(s => ({
      ...s,
      items: this._rows.filter(r => r.etapa === s.key)
    }));
  }
}
