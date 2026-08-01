import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-presupuesto-trazabilidad',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h1 class="text-3xl font-black tracking-tight text-primary">Trazabilidad y Reserva de Fondos</h1>
        <p class="text-sm text-muted-foreground mt-1">Seguimiento automático de los 4 momentos contables del gasto presupuestario en tiempo real.</p>
      </div>

      <!-- 4 Stages Header Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 bg-white border-2 border-slate-200 rounded-2xl space-y-1">
          <span class="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">1. Pre-comprometido</span>
          <div class="text-2xl font-black text-slate-800">$34,500.00</div>
          <div class="text-xs text-slate-500 font-medium">Reserva inicial en solicitudes</div>
        </div>
        <div class="p-5 bg-white border-2 border-orange-200 rounded-2xl space-y-1">
          <span class="text-[10px] uppercase font-extrabold tracking-wider text-orange-600">2. Comprometido</span>
          <div class="text-2xl font-black text-orange-700">$58,200.00</div>
          <div class="text-xs text-orange-600 font-medium">Obligación con Ordenes de Compra</div>
        </div>
        <div class="p-5 bg-white border-2 border-sky-200 rounded-2xl space-y-1">
          <span class="text-[10px] uppercase font-extrabold tracking-wider text-sky-600">3. Causado</span>
          <div class="text-2xl font-black text-sky-700">$84,900.00</div>
          <div class="text-xs text-sky-600 font-medium">Gasto real por Recepción / Factura</div>
        </div>
        <div class="p-5 bg-white border-2 border-emerald-200 rounded-2xl space-y-1">
          <span class="text-[10px] uppercase font-extrabold tracking-wider text-emerald-600">4. Pagado</span>
          <div class="text-2xl font-black text-emerald-700">$165,000.00</div>
          <div class="text-xs text-emerald-600 font-medium">Liquidado por banco a proveedores</div>
        </div>
      </div>

      <!-- Trazabilidad Table -->
      <div class="card-elevated p-6 bg-white border-2 border-primary/10 rounded-2xl space-y-4">
        <h3 class="font-extrabold text-sm uppercase tracking-wider text-primary flex items-center gap-2">
          <lucide-icon name="git-commit" class="h-4 w-4"></lucide-icon> Registro de Trazabilidad Documental de Fondos
        </h3>
        <table class="w-full text-xs text-left">
          <thead>
            <tr class="border-b-2 border-slate-200 text-slate-500 uppercase font-extrabold">
              <th class="py-2.5 px-3">Partida Presupuestaria</th>
              <th class="py-2.5 px-3">Asignación Total</th>
              <th class="py-2.5 px-3">Pre-comprometido</th>
              <th class="py-2.5 px-3">Comprometido</th>
              <th class="py-2.5 px-3">Causado</th>
              <th class="py-2.5 px-3">Pagado</th>
              <th class="py-2.5 px-3 text-right">Saldo Disponible</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr *ngFor="let row of trazabilidad" class="hover:bg-slate-50">
              <td class="py-3.5 px-3">
                <div class="font-mono text-primary font-bold">{{ row.partida }}</div>
                <div class="text-slate-800 font-bold">{{ row.nombre }}</div>
              </td>
              <td class="py-3.5 px-3 font-mono font-bold">{{ '$' + row.asignado.toLocaleString() }}</td>
              <td class="py-3.5 px-3 font-mono text-slate-600">{{ '$' + row.pre.toLocaleString() }}</td>
              <td class="py-3.5 px-3 font-mono text-orange-600">{{ '$' + row.comp.toLocaleString() }}</td>
              <td class="py-3.5 px-3 font-mono text-sky-600">{{ '$' + row.caus.toLocaleString() }}</td>
              <td class="py-3.5 px-3 font-mono text-emerald-600">{{ '$' + row.pag.toLocaleString() }}</td>
              <td class="py-3.5 px-3 text-right font-black font-mono text-emerald-700 text-sm">
                {{ '$' + (row.asignado - (row.pre + row.comp + row.caus + row.pag)).toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class PresupuestoTrazabilidadComponent {
  trazabilidad = [
    { partida: "PART-401.01.02", nombre: "Equipos de Computación e Infraestructura", asignado: 250000, pre: 12500, comp: 38500, caus: 45000, pag: 85000 },
    { partida: "PART-401.02.05", nombre: "Licenciamiento de Software y Base de Datos", asignado: 180000, pre: 9100, comp: 15000, caus: 22000, pag: 60000 },
    { partida: "PART-402.01.01", nombre: "Materiales y Suministros de Oficina", asignado: 45000, pre: 1200, comp: 3200, caus: 5400, pag: 20000 }
  ];
}
