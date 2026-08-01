import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-presupuesto-formulacion',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black tracking-tight text-primary">Formulación y Carga del Presupuesto Anual</h1>
          <p class="text-sm text-muted-foreground mt-1">Planificación trimestral del techo presupuestario asignado a cada partida.</p>
        </div>
        <button (click)="guardarFormulacion()" class="h-11 px-6 bg-primary text-white border-2 border-primary rounded-xl font-bold flex items-center gap-2 hover:bg-primary/95 transition-all shadow-md">
          <lucide-icon name="check-circle" class="h-5 w-5"></lucide-icon> Aprobar y Cargar Presupuesto 2026
        </button>
      </div>

      <div class="card-elevated p-6 bg-white border-2 border-primary/10 rounded-2xl space-y-4">
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead>
              <tr class="border-b-2 border-slate-200 text-slate-500 uppercase font-extrabold">
                <th class="py-3 px-3">Partida Presupuestaria</th>
                <th class="py-3 px-3">Centro Costo</th>
                <th class="py-3 px-3 text-right">Q1 (USD)</th>
                <th class="py-3 px-3 text-right">Q2 (USD)</th>
                <th class="py-3 px-3 text-right">Q3 (USD)</th>
                <th class="py-3 px-3 text-right">Q4 (USD)</th>
                <th class="py-3 px-3 text-right">Total Asignado Anual</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium">
              <tr *ngFor="let item of formulacion" class="hover:bg-slate-50/60">
                <td class="py-3.5 px-3 font-bold text-slate-800">
                  <div class="font-mono text-primary text-[11px]">{{ item.codigo }}</div>
                  <div>{{ item.nombre }}</div>
                </td>
                <td class="py-3.5 px-3 text-slate-600 font-semibold">{{ item.centro }}</td>
                <td class="py-3.5 px-3 text-right">
                  <input type="number" [(ngModel)]="item.q1" class="w-24 h-9 px-2 text-right rounded border border-slate-300 font-mono font-bold text-xs" />
                </td>
                <td class="py-3.5 px-3 text-right">
                  <input type="number" [(ngModel)]="item.q2" class="w-24 h-9 px-2 text-right rounded border border-slate-300 font-mono font-bold text-xs" />
                </td>
                <td class="py-3.5 px-3 text-right">
                  <input type="number" [(ngModel)]="item.q3" class="w-24 h-9 px-2 text-right rounded border border-slate-300 font-mono font-bold text-xs" />
                </td>
                <td class="py-3.5 px-3 text-right">
                  <input type="number" [(ngModel)]="item.q4" class="w-24 h-9 px-2 text-right rounded border border-slate-300 font-mono font-bold text-xs" />
                </td>
                <td class="py-3.5 px-3 text-right font-black font-mono text-primary text-sm">
                  {{ '$' + (item.q1 + item.q2 + item.q3 + item.q4).toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class PresupuestoFormulacionComponent {
  formulacion = [
    { codigo: "PART-401.01.02", nombre: "Equipos de Computación e Infraestructura", centro: "IT Planta", q1: 62500, q2: 62500, q3: 62500, q4: 62500 },
    { codigo: "PART-401.02.05", nombre: "Licenciamiento de Software y Base de Datos", centro: "IT Corporativo", q1: 45000, q2: 45000, q3: 45000, q4: 45000 },
    { codigo: "PART-402.01.01", nombre: "Materiales y Suministros de Oficina", centro: "Administración", q1: 11250, q2: 11250, q3: 11250, q4: 11250 }
  ];

  guardarFormulacion() {
    alert("¡Presupuesto Anual 2026 cargado y aprobado con éxito!");
  }
}
