import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

interface Provider {
  id: number;
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
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
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
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Licitación / Selección de Proveedores
              </span>
            </div>
            <p class="text-sm text-slate-400 font-semibold mt-0.5">Análisis comparativo de 3 ofertas y selección manual de adjudicación</p>
          </div>
        </div>

        <div class="flex gap-2">
          <button (click)="enviarContrato()" [disabled]="enviandoContrato || contratoEnviado" class="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white border-2 border-indigo-700 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md">
            <lucide-icon name="file-text" class="h-4 w-4"></lucide-icon>
            {{ contratoEnviado ? 'Contrato Enviado al Portal' : 'Enviar Contrato y Términos' }}
          </button>
          <button (click)="adjudicar()" class="h-10 px-4 bg-primary text-white border-2 border-primary rounded-xl font-bold flex items-center gap-1.5 hover:bg-primary/95 transition-all shadow-md">
            <lucide-icon name="check" class="h-4 w-4"></lucide-icon> Adjudicar Ganador
          </button>
        </div>
      </div>

      <!-- Alert Banners -->
      <div *ngIf="contratoEnviado" class="p-4 rounded-xl bg-indigo-50 border-2 border-indigo-200 flex items-center gap-3 text-indigo-900 text-xs font-medium">
        <lucide-icon name="shield-check" class="h-6 w-6 text-indigo-600 shrink-0"></lucide-icon>
        <div>
          <div class="font-bold text-sm">Contrato y Términos & Condiciones enviados a {{ getWinner().name }}</div>
          <div class="text-indigo-700 mt-0.5">El proveedor ha recibido la notificación en el Portal de Proveedores ('SEA-PROVEEDORES') para subir el documento firmado y sellado antes de emitir la Orden de Compra.</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Comparative Matrix Table -->
        <div class="lg:col-span-2 space-y-6">
          <div class="card-elevated overflow-hidden border-2 border-primary/20 bg-white rounded-2xl shadow-sm">
            <div class="bg-primary/5 p-4 border-b-2 border-primary/20 flex items-center justify-between">
              <div>
                <h3 class="font-bold text-primary flex items-center gap-2">
                  <lucide-icon name="scale" class="h-4 w-4 text-primary"></lucide-icon>
                  Análisis Comparativo de Ofertas (3 Proveedores Seleccionados)
                </h3>
                <p class="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Permite modificar datos manualmente y seleccionar al ganador definitivo</p>
              </div>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-primary/[0.02] border-b-2 border-slate-200">
                  <tr>
                    <th class="p-4 text-left border-r text-xs uppercase font-bold text-primary/80 w-1/4">Criterio / Proveedor</th>
                    <th *ngFor="let p of providers" [class]="'p-4 text-center border-r border-slate-100 last:border-r-0 font-bold ' + (p.winner ? 'bg-primary/10 text-primary' : '')">
                      <div class="flex items-center justify-center gap-1">
                        <input type="radio" [name]="'winnerGroup'" [checked]="p.winner" (change)="setWinner(p)" class="h-4 w-4 text-primary cursor-pointer" />
                        <span class="font-bold text-xs">{{ p.name }}</span>
                      </div>
                      <div *ngIf="p.winner" class="text-[9px] uppercase text-emerald-600 mt-1 font-black flex items-center justify-center gap-1">
                        <lucide-icon name="check-circle" class="h-3 w-3"></lucide-icon> GANADOR ADJUDICADO
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-slate-100 hover:bg-slate-50/50">
                    <td class="p-4 border-r border-slate-100 font-semibold text-xs text-slate-500">Precio Oferta (USD)</td>
                    <td *ngFor="let p of providers" class="p-3 text-center border-r border-slate-100 last:border-r-0 font-bold tabular-nums">
                      <input type="number" [(ngModel)]="p.price" (input)="recalcularPuntaje(p)" class="w-24 h-9 px-2 text-center rounded border border-slate-300 font-mono font-bold text-xs focus:outline-none focus:border-primary" />
                    </td>
                  </tr>
                  <tr class="border-b border-slate-100 hover:bg-slate-50/50">
                    <td class="p-4 border-r border-slate-100 font-semibold text-xs text-slate-500">Tiempo de Entrega</td>
                    <td *ngFor="let p of providers" class="p-3 text-center border-r border-slate-100 last:border-r-0">
                      <input type="text" [(ngModel)]="p.time" class="w-24 h-9 px-2 text-center rounded border border-slate-300 text-xs font-semibold focus:outline-none focus:border-primary" />
                    </td>
                  </tr>
                  <tr class="border-b border-slate-100 hover:bg-slate-50/50">
                    <td class="p-4 border-r border-slate-100 font-semibold text-xs text-slate-500">Puntaje Calidad (%)</td>
                    <td *ngFor="let p of providers" class="p-3 text-center border-r border-slate-100 last:border-r-0">
                      <input type="number" [(ngModel)]="p.quality" (input)="recalcularPuntaje(p)" min="0" max="100" class="w-20 h-9 px-2 text-center rounded border border-slate-300 text-xs font-bold focus:outline-none focus:border-primary" />
                    </td>
                  </tr>
                  <tr class="border-b border-slate-100 hover:bg-slate-50/50">
                    <td class="p-4 border-r border-slate-100 font-semibold text-xs text-slate-500">Garantía Ofrecida</td>
                    <td *ngFor="let p of providers" class="p-3 text-center border-r border-slate-100 last:border-r-0">
                      <input type="text" [(ngModel)]="p.support" class="w-24 h-9 px-2 text-center rounded border border-slate-300 text-xs font-semibold focus:outline-none focus:border-primary" />
                    </td>
                  </tr>
                  <tr class="bg-primary/5">
                    <td class="p-4 border-r font-bold text-xs text-primary uppercase">Puntaje Ponderado</td>
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
                <div class="text-[10px] uppercase font-bold text-slate-400">Partida Presupuestaria</div>
                <div class="text-sm font-bold text-slate-700">4.02.05 - Mantenimiento de Maquinaria</div>
              </div>
              <div>
                <div class="text-[10px] uppercase font-bold text-slate-400">Disponibilidad Actual</div>
                <div class="text-lg font-black text-emerald-600">{{ formatMoney(120400) }}</div>
              </div>
            </div>
          </div>

          <div class="card-elevated p-5 space-y-3 bg-slate-900 text-white rounded-2xl shadow-sm">
            <h4 class="font-bold text-xs uppercase text-amber-400 tracking-wider flex items-center gap-2">
              <lucide-icon name="file-signature" class="h-4 w-4"></lucide-icon> Proveedor Seleccionado
            </h4>
            <div class="text-base font-black">{{ getWinner().name }}</div>
            <div class="text-xs text-slate-300 space-y-1">
              <div>Monto Oferta: <span class="font-mono font-bold text-emerald-400">{{ formatMoney(getWinner().price) }}</span></div>
              <div>Garantía: <span class="font-bold">{{ getWinner().support }}</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class PresupuestoDetalleComponent {
  contratoEnviado = false;
  enviandoContrato = false;

  providers: Provider[] = [
    { id: 1, name: "Distribuidora Andina C.A.", price: 38500, time: "5 días", quality: 95, support: "2 años", score: 92.4, winner: true },
    { id: 2, name: "Tecnología Global S.A.", price: 41200, time: "3 días", quality: 88, support: "1 año", score: 87.1, winner: false },
    { id: 3, name: "Insumos Oriente 3000", price: 37900, time: "12 días", quality: 75, support: "6 meses", score: 78.5, winner: false }
  ];

  constructor(private router: Router) {}

  getWinner(): Provider {
    return this.providers.find(p => p.winner) || this.providers[0];
  }

  setWinner(selected: Provider) {
    this.providers.forEach(p => p.winner = (p.id === selected.id));
  }

  recalcularPuntaje(p: Provider) {
    p.score = Number((p.quality * 0.6 + (50000 - p.price) * 0.001).toFixed(1));
  }

  enviarContrato() {
    this.enviandoContrato = true;
    setTimeout(() => {
      this.enviandoContrato = false;
      this.contratoEnviado = true;
    }, 1000);
  }

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
