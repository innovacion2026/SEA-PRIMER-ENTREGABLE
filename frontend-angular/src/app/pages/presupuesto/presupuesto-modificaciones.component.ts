import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-presupuesto-modificaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black tracking-tight text-primary">Modificaciones Presupuestarias</h1>
          <p class="text-sm text-muted-foreground mt-1">Traspasos, créditos adicionales y reducciones presupuestarias autorizadas.</p>
        </div>
        <button (click)="openNueva = true" class="h-11 px-6 bg-primary text-white border-2 border-primary rounded-xl font-bold flex items-center gap-2 hover:bg-primary/95 transition-all shadow-md">
          <lucide-icon name="plus" class="h-5 w-5"></lucide-icon> Solicitar Modificación
        </button>
      </div>

      <!-- Modificaciones Table -->
      <div class="card-elevated p-6 bg-white border-2 border-primary/10 rounded-2xl space-y-4">
        <table class="w-full text-xs text-left">
          <thead>
            <tr class="border-b-2 border-slate-200 text-slate-500 uppercase font-extrabold">
              <th class="py-3 px-3">Código Solicitud</th>
              <th class="py-3 px-3">Tipo Modificación</th>
              <th class="py-3 px-3">Partida Origen</th>
              <th class="py-3 px-3">Partida Destino</th>
              <th class="py-3 px-3 text-right">Monto (USD)</th>
              <th class="py-3 px-3 text-center">Estatus Workflow</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr *ngFor="let m of modificaciones" class="hover:bg-slate-50">
              <td class="py-3.5 px-3 font-mono font-bold text-primary">{{ m.codigo }}</td>
              <td class="py-3.5 px-3">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {{ m.tipo }}
                </span>
              </td>
              <td class="py-3.5 px-3 text-slate-600 font-mono">{{ m.origen }}</td>
              <td class="py-3.5 px-3 text-slate-600 font-mono">{{ m.destino }}</td>
              <td class="py-3.5 px-3 text-right font-black font-mono text-slate-800 text-sm">{{ '$' + m.monto.toLocaleString() }}</td>
              <td class="py-3.5 px-3 text-center">
                <span [class]="'px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ' + (m.estatus === 'Aprobada' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200')">
                  {{ m.estatus }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class PresupuestoModificacionesComponent {
  openNueva = false;
  modificaciones = [
    { codigo: "MOD-2026-0012", tipo: "Traspaso Presupuestario", origen: "PART-402.01.01 (Oficina)", destino: "PART-401.01.02 (IT)", monto: 15000, estatus: "Aprobada" },
    { codigo: "MOD-2026-0015", tipo: "Crédito Adicional", origen: "Fondo de Reserva Nacional", destino: "PART-401.02.05 (Software)", monto: 35000, estatus: "Pendiente Finanzas" }
  ];
}
