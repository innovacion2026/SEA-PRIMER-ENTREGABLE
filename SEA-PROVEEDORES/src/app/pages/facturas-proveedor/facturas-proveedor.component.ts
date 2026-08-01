import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { PortalApiService } from '../../services/portal-api.service';

@Component({
  selector: 'app-facturas-proveedor',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h1 class="text-2xl font-black text-white">Relación de Facturas (Cuentas por Pagar)</h1>
        <p class="text-xs text-slate-400 mt-1">Estatus en tiempo real de sus facturas registradas en la tesorería del banco.</p>
      </div>

      <div class="p-6 bg-[#09090b] border border-zinc-800 rounded-2xl">
        <table class="w-full text-xs text-left">
          <thead>
            <tr class="border-b border-zinc-800 text-slate-400 uppercase font-bold text-[10px]">
              <th class="py-3 px-4">N° Factura</th>
              <th class="py-3 px-4">N° Control</th>
              <th class="py-3 px-4">Fecha Emisión</th>
              <th class="py-3 px-4">Fecha Vencimiento</th>
              <th class="py-3 px-4 text-right">Monto Total USD</th>
              <th class="py-3 px-4 text-right">Monto Retenido</th>
              <th class="py-3 px-4 text-center">Estatus Cobranza</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800/60 text-slate-200">
            <tr *ngFor="let f of facturas" class="hover:bg-zinc-900/60 transition-colors">
              <td class="py-4 px-4 font-bold text-white">{{ f.numeroFactura }}</td>
              <td class="py-4 px-4 font-mono text-slate-400">{{ f.control }}</td>
              <td class="py-4 px-4">{{ f.fechaEmision }}</td>
              <td class="py-4 px-4 font-semibold text-amber-400">{{ f.fechaVencimiento }}</td>
              <td class="py-4 px-4 text-right font-bold font-mono text-white">{{ '$' + f.montoTotal.toLocaleString() }}</td>
              <td class="py-4 px-4 text-right font-mono text-purple-400">{{ '$' + f.montoRetenido.toLocaleString() }}</td>
              <td class="py-4 px-4 text-center">
                <span [class]="'px-3 py-1 rounded-full text-[10px] uppercase font-bold border ' + (f.estatus === 'Pagada' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-amber-950 text-amber-400 border-amber-800')">
                  {{ f.estatus }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class FacturasProveedorComponent implements OnInit {
  facturas: any[] = [];
  constructor(private portalApi: PortalApiService) {}
  ngOnInit() {
    this.portalApi.getFacturas().subscribe(res => this.facturas = res || []);
  }
}
