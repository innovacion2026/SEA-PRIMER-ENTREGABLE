import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

interface Provider {
  name: string;
  price: number;
  time: string;
  quality: number;
  support: string;
  score: number;
  winner: boolean;
}

@Component({
  selector: 'app-presupuesto-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      
      <!-- Top Actions Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button (click)="goBack()" class="h-10 w-10 inline-flex items-center justify-center border-2 border-slate-300 rounded-xl bg-white hover:bg-slate-100 transition-all">
            <lucide-icon name="chevron-down" class="h-4 w-4 rotate-90"></lucide-icon>
          </button>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-black text-slate-800">PRE-2026-022</h1>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Licitación Abierta
              </span>
            </div>
            <p class="text-sm text-slate-400 font-semibold mt-0.5">Análisis de ofertas y selección de proveedor</p>
          </div>
        </div>
        <button (click)="adjudicar()" class="h-10 px-4 bg-primary text-white border-2 border-primary rounded-xl font-bold flex items-center gap-1.5 hover:bg-primary/95 transition-all">
          <lucide-icon name="check" class="h-4 w-4"></lucide-icon> Adjudicar Ganador
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Comparative Matrix Table -->
        <div class="lg:col-span-2 space-y-6">
          <div class="card-elevated overflow-hidden border-2 border-primary/20 bg-white rounded-2xl shadow-sm">
            <div class="bg-primary/5 p-4 border-b-2 border-primary/20">
              <h3 class="font-bold text-primary flex items-center gap-2">
                <lucide-icon name="plus" class="h-4 w-4 text-primary"></lucide-icon>
                Análisis Comparativo de Ofertas (Cuadro Comparativo)
              </h3>
              <p class="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Basado en criterios de selección ponderados</p>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-primary/[0.02] border-b-2 border-slate-200">
                  <tr>
                    <th class="p-4 text-left border-r text-xs uppercase font-bold text-primary/80 w-1/4">Criterio</th>
                    <th *ngFor="let p of providers" [class]="'p-4 text-center border-r border-slate-100 last:border-r-0 font-bold ' + (p.winner ? 'bg-primary/10 text-primary' : '')">
                      {{ p.name }}
                      <div *ngIf="p.winner" class="text-[9px] uppercase text-emerald-600 mt-1 flex items-center justify-center gap-1">
                        <lucide-icon name="check" class="h-3 w-3"></lucide-icon> Opción Recomendada
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td class="p-4 border-r border-slate-100 font-semibold text-xs text-slate-500">Precio (USD)</td>
                    <td *ngFor="let p of providers" class="p-4 text-center border-r border-slate-100 last:border-r-0 font-bold tabular-nums">
                      {{ formatMoney(p.price) }}
                    </td>
                  </tr>
                  <tr class="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td class="p-4 border-r border-slate-100 font-semibold text-xs text-slate-500">Entrega</td>
                    <td *ngFor="let p of providers" class="p-4 text-center border-r border-slate-100 last:border-r-0 italic text-slate-600 font-medium">
                      {{ p.time }}
                    </td>
                  </tr>
                  <tr class="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td class="p-4 border-r border-slate-100 font-semibold text-xs text-slate-500">Puntaje Calidad</td>
                    <td *ngFor="let p of providers" class="p-4 text-center border-r border-slate-100 last:border-r-0">
                      <div class="flex items-center justify-center gap-2">
                        <div class="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                          <div class="h-full bg-primary" [style.width.%]="p.quality"></div>
                        </div>
                        <span class="text-[10px] font-bold text-slate-500">{{ p.quality }}%</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td class="p-4 border-r border-slate-100 font-semibold text-xs text-slate-500">Garantía</td>
                    <td *ngFor="let p of providers" class="p-4 text-center border-r border-slate-100 last:border-r-0 text-xs font-semibold text-slate-600">
                      {{ p.support }}
                    </td>
                  </tr>
                  <tr class="bg-primary/5">
                    <td class="p-4 border-r font-bold text-xs text-primary uppercase">Puntaje Final</td>
                    <td *ngFor="let p of providers" [class]="'p-4 text-center text-lg font-black tabular-nums ' + (p.winner ? 'text-primary' : 'text-slate-400')">
                      {{ p.score.toFixed(1) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <div class="card-elevated p-5 space-y-4 bg-white border rounded-2xl shadow-sm">
            <h3 class="font-bold flex items-center gap-2 border-b pb-2 text-primary">
              <lucide-icon name="shield-check" class="h-4 w-4 text-primary"></lucide-icon> Imputación Presupuestaria
            </h3>
            <div class="space-y-3">
              <div>
                <div class="text-[10px] uppercase font-bold text-slate-400">Centro de Costo</div>
                <div class="text-sm font-bold text-slate-700">Operaciones Planta Caracas</div>
              </div>
              <div>
                <div class="text-[10px] uppercase font-bold text-slate-400">Partida</div>
                <div class="text-sm font-bold text-slate-700">4.02.05 - Mantenimiento de Maquinaria</div>
              </div>
              <div>
                <div class="text-[10px] uppercase font-bold text-slate-400">Disponibilidad Actual</div>
                <div class="text-lg font-black text-emerald-600">{{ formatMoney(120400) }}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class PresupuestoDetalleComponent {
  providers: Provider[] = [
    {
      name: "Distribuidora Andina C.A.",
      price: 38500,
      time: "5 días",
      quality: 95,
      support: "2 años",
      score: 92.4,
      winner: true
    },
    {
      name: "Tecnología Global S.A.",
      price: 41200,
      time: "3 días",
      quality: 88,
      support: "1 año",
      score: 87.1,
      winner: false
    },
    {
      name: "Insumos Oriente 3000",
      price: 37900,
      time: "12 días",
      quality: 75,
      support: "6 meses",
      score: 78.5,
      winner: false
    }
  ];

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/app/compras/presupuestos']);
  }

  adjudicar() {
    this.goBack();
  }

  formatMoney(val: number): string {
    return new Intl.NumberFormat("es-VE", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
  }
}
