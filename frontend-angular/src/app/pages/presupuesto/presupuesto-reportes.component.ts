import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-presupuesto-reportes',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h1 class="text-3xl font-black tracking-tight text-primary">Consultas, Reportes y Auditoría Drill-Down</h1>
        <p class="text-sm text-muted-foreground mt-1">Análisis de ejecución vs. real e historial de trazabilidad documental. Haga doble clic en cualquier partida para auditar.</p>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="p-5 bg-white border-2 border-slate-200 rounded-2xl">
          <div class="text-[10px] uppercase font-bold text-slate-400">Presupuesto Formulado 2026</div>
          <div class="text-2xl font-black text-slate-800">$475,000.00</div>
        </div>
        <div class="p-5 bg-white border-2 border-primary/20 rounded-2xl">
          <div class="text-[10px] uppercase font-bold text-primary">Ejecución Real Causada</div>
          <div class="text-2xl font-black text-primary">$308,100.00</div>
          <div class="text-xs text-primary font-bold">64.8% Ejecutado</div>
        </div>
        <div class="p-5 bg-white border-2 border-emerald-200 rounded-2xl">
          <div class="text-[10px] uppercase font-bold text-emerald-600">Desviación Favorables (Disponible)</div>
          <div class="text-2xl font-black text-emerald-700">$166,900.00</div>
        </div>
      </div>

      <!-- Execution Table with Drill-Down Double Click -->
      <div class="card-elevated p-6 bg-white border-2 border-primary/10 rounded-2xl space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-extrabold text-sm uppercase tracking-wider text-primary flex items-center gap-2">
              <lucide-icon name="search" class="h-4 w-4"></lucide-icon> Historial de Trazabilidad Documental (Doble Clic para Drill-Down)
            </h3>
            <p class="text-xs text-muted-foreground mt-0.5">Haga doble clic en cualquier partida para auditar la factura, la orden de compra y la solicitud originaria.</p>
          </div>
          <span class="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full border border-primary/20">
            Doble Clic Habilitado 🖱️🖱️
          </span>
        </div>

        <table class="w-full text-xs text-left cursor-pointer">
          <thead>
            <tr class="border-b-2 border-slate-200 text-slate-500 uppercase font-extrabold">
              <th class="py-3 px-3">Partida Presupuestaria</th>
              <th class="py-3 px-3">Centro Costo</th>
              <th class="py-3 px-3 text-right">Presupuesto Formulado</th>
              <th class="py-3 px-3 text-right">Gasto Real Ejecutado</th>
              <th class="py-3 px-3 text-right">Desviación USD</th>
              <th class="py-3 px-3 text-center">% Ejecución</th>
              <th class="py-3 px-3 text-center">Acción Auditoría</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr *ngFor="let item of reportes" (dblclick)="openDrillDownModal(item)" (click)="selectItem(item)" [class]="'hover:bg-primary/5 transition-colors ' + (selectedItem === item ? 'bg-primary/10' : '')">
              <td class="py-3.5 px-3">
                <div class="font-mono text-primary font-bold">{{ item.codigo }}</div>
                <div class="text-slate-800 font-bold">{{ item.nombre }}</div>
              </td>
              <td class="py-3.5 px-3 font-semibold text-slate-600">{{ item.centro }}</td>
              <td class="py-3.5 px-3 text-right font-mono font-bold">{{ '$' + item.formulado.toLocaleString() }}</td>
              <td class="py-3.5 px-3 text-right font-mono font-bold text-slate-800">{{ '$' + item.ejecutado.toLocaleString() }}</td>
              <td class="py-3.5 px-3 text-right font-mono text-emerald-600 font-bold">{{ '$' + (item.formulado - item.ejecutado).toLocaleString() }}</td>
              <td class="py-3.5 px-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <div class="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-primary" [style.width.%]="item.pct"></div>
                  </div>
                  <span class="font-bold text-slate-700">{{ item.pct }}%</span>
                </div>
              </td>
              <td class="py-3.5 px-3 text-center">
                <button (click)="openDrillDownModal(item)" class="h-8 px-3 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 text-xs font-bold transition-all flex items-center gap-1 mx-auto">
                  <lucide-icon name="zoom-in" class="h-3.5 w-3.5"></lucide-icon> Ver Origen
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Drill-Down Audit Modal -->
      <div *ngIf="showDrillDown && currentDrillItem" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div class="w-full max-w-2xl bg-white border-2 border-primary rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          
          <!-- Header -->
          <div class="p-5 border-b-2 border-primary/20 bg-slate-900 text-white flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-400 text-slate-900">Drill-Down Auditoría</span>
                <h3 class="text-lg font-black">{{ currentDrillItem.codigo }}</h3>
              </div>
              <p class="text-xs text-slate-300 mt-0.5">{{ currentDrillItem.nombre }} · {{ currentDrillItem.centro }}</p>
            </div>
            <button (click)="showDrillDown = false" class="h-8 w-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white">
              <lucide-icon name="x" class="h-5 w-5"></lucide-icon>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-6 text-sm">
            <div class="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
              <span class="font-bold">Trazabilidad Documental Completa de Origen a Fin</span>
              <p class="mt-0.5 text-blue-700">Este reporte rastrea la cadena desde la solicitud interna hasta la factura pagada por el banco.</p>
            </div>

            <!-- Trace Chain Flow Steps -->
            <div class="space-y-3">
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold">1</div>
                  <div>
                    <div class="font-bold text-slate-800 text-xs">1. Solicitud Interna de Origen</div>
                    <div class="font-mono text-primary font-bold text-xs">{{ currentDrillItem.drilldown.solicitud }}</div>
                  </div>
                </div>
                <span class="text-xs text-slate-500 font-medium">Solicitante: {{ currentDrillItem.drilldown.solicitante }}</span>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">2</div>
                  <div>
                    <div class="font-bold text-slate-800 text-xs">2. Orden de Compra Emitida</div>
                    <div class="font-mono text-indigo-600 font-bold text-xs">{{ currentDrillItem.drilldown.ordenCompra }}</div>
                  </div>
                </div>
                <span class="text-xs text-slate-500 font-medium">Proveedor: {{ currentDrillItem.drilldown.proveedor }}</span>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">3</div>
                  <div>
                    <div class="font-bold text-slate-800 text-xs">3. Factura del Proveedor Causada</div>
                    <div class="font-mono text-emerald-600 font-bold text-xs">{{ currentDrillItem.drilldown.factura }}</div>
                  </div>
                </div>
                <span class="text-xs font-bold font-mono text-emerald-600 text-sm">{{ '$' + currentDrillItem.drilldown.monto.toLocaleString() }} USD</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 border-t border-slate-200 bg-muted/45 flex justify-end">
            <button (click)="showDrillDown = false" class="h-10 px-6 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">
              Cerrar Auditoría
            </button>
          </div>

        </div>
      </div>

    </div>
  `
})
export class PresupuestoReportesComponent {
  selectedItem: any = null;
  showDrillDown = false;
  currentDrillItem: any = null;

  reportes = [
    {
      codigo: "PART-401.01.02",
      nombre: "Equipos de Computación e Infraestructura",
      centro: "IT Planta",
      formulado: 250000,
      ejecutado: 181000,
      pct: 72.4,
      drilldown: {
        solicitud: "SOL-2026-4182",
        solicitante: "Isaac Lovera (Director IT)",
        ordenCompra: "OC-2026-0891",
        proveedor: "Distribuidora Andina C.A.",
        factura: "FACT-00921",
        monto: 38500
      }
    },
    {
      codigo: "PART-401.02.05",
      nombre: "Licenciamiento de Software y Base de Datos",
      centro: "IT Corporativo",
      formulado: 180000,
      ejecutado: 106100,
      pct: 58.9,
      drilldown: {
        solicitud: "SOL-2026-090",
        solicitante: "María García (Gerente Software)",
        ordenCompra: "OC-2026-0742",
        proveedor: "Tecnología Global S.A.",
        factura: "FACT-00890",
        monto: 41200
      }
    },
    {
      codigo: "PART-402.01.01",
      nombre: "Materiales y Suministros de Oficina",
      centro: "Administración",
      formulado: 45000,
      ejecutado: 21000,
      pct: 46.6,
      drilldown: {
        solicitud: "SOL-2026-091",
        solicitante: "Juan Pérez (Compras)",
        ordenCompra: "OC-2026-0610",
        proveedor: "Insumos Oriente 3000",
        factura: "FACT-00712",
        monto: 3120
      }
    }
  ];

  selectItem(item: any) {
    this.selectedItem = item;
  }

  openDrillDownModal(item: any) {
    this.currentDrillItem = item;
    this.showDrillDown = true;
  }
}
