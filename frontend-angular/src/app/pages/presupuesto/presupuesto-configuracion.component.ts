import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-presupuesto-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h1 class="text-3xl font-black tracking-tight text-primary">Configuración Presupuestaria</h1>
        <p class="text-sm text-muted-foreground mt-1">Límites estrictos de gasto, ejercicio fiscal, maestro de partidas, centros de costo y tolerancias de bloqueo.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Ejercicio Fiscal Banner -->
        <div class="card-elevated p-5 bg-white border-2 border-primary/20 rounded-2xl lg:col-span-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <lucide-icon name="calendar-check" class="h-6 w-6"></lucide-icon>
            </div>
            <div>
              <div class="text-sm font-bold text-slate-800">Ejercicio Fiscal Presupuestario 2026</div>
              <div class="text-xs text-muted-foreground">Estado: <span class="font-extrabold text-emerald-600">ABIERTO Y OPERATIVO</span> · Periodo: Ene 2026 - Dic 2026</div>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="h-10 px-4 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700">Cierre Temporal Q2</button>
            <button class="h-10 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold">Cierre Definitivo Ejercicio</button>
          </div>
        </div>

        <!-- Tolerancias y Bloqueos Card -->
        <div class="card-elevated p-6 bg-white border-2 border-primary/10 rounded-2xl space-y-4">
          <h3 class="font-extrabold text-sm uppercase tracking-wider text-primary flex items-center gap-2">
            <lucide-icon name="shield-alert" class="h-4 w-4"></lucide-icon> Tolerancias y Bloqueos
          </h3>
          <div class="space-y-3 text-xs">
            <div>
              <label class="font-bold text-slate-700 block mb-1">Acción ante Sobregiro Presupuestario</label>
              <select [(ngModel)]="accionSobregiro" class="w-full h-10 px-3 border-2 border-slate-200 rounded-xl bg-white font-semibold">
                <option value="bloqueo">Bloqueo Estricto (Prohibir Solicitud)</option>
                <option value="advertencia">Advertencia y Aprobación Especial</option>
              </select>
            </div>
            <div>
              <label class="font-bold text-slate-700 block mb-1">Tolerancia Máxima Permitida (%)</label>
              <input type="number" [(ngModel)]="toleranciaPct" class="w-full h-10 px-3 border-2 border-slate-200 rounded-xl font-bold font-mono" />
            </div>
          </div>
        </div>

        <!-- Maestro de Partidas Table -->
        <div class="card-elevated p-6 bg-white border-2 border-primary/10 rounded-2xl space-y-4 lg:col-span-2">
          <h3 class="font-extrabold text-sm uppercase tracking-wider text-primary flex items-center gap-2">
            <lucide-icon name="list-tree" class="h-4 w-4"></lucide-icon> Maestro de Partidas Presupuestarias
          </h3>
          <table class="w-full text-xs text-left">
            <thead>
              <tr class="border-b-2 border-slate-200 text-slate-400 uppercase font-bold">
                <th class="py-2.5 px-3">Código</th>
                <th class="py-2.5 px-3">Denominación Partida</th>
                <th class="py-2.5 px-3">Centro Costo</th>
                <th class="py-2.5 px-3 text-right">Límite Anual USD</th>
                <th class="py-2.5 px-3 text-center">Estatus</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium">
              <tr *ngFor="let p of partidas">
                <td class="py-3 px-3 font-mono font-bold text-primary">{{ p.codigo }}</td>
                <td class="py-3 px-3 font-semibold text-slate-800">{{ p.nombre }}</td>
                <td class="py-3 px-3">{{ p.centro }}</td>
                <td class="py-3 px-3 text-right font-bold font-mono">{{ '$' + p.limite.toLocaleString() }}</td>
                <td class="py-3 px-3 text-center">
                  <span class="px-2 py-0.5 rounded text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">ACTIVA</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  `
})
export class PresupuestoConfiguracionComponent {
  accionSobregiro = 'bloqueo';
  toleranciaPct = 0;

  partidas = [
    { codigo: "PART-401.01.02", nombre: "Equipos de Computación e Infraestructura", centro: "IT Planta", limite: 250000 },
    { codigo: "PART-401.02.05", nombre: "Licenciamiento de Software y Base de Datos", centro: "IT Corporativo", limite: 180000 },
    { codigo: "PART-402.01.01", nombre: "Materiales y Suministros de Oficina", centro: "Administración", limite: 45000 },
    { codigo: "PART-403.05.01", nombre: "Asesoría y Servicios Profesionales", centro: "Legal & Cumplimiento", limite: 90000 }
  ];
}
