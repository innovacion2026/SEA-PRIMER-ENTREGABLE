import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { PortalApiService } from '../../services/portal-api.service';

@Component({
  selector: 'app-pagos-proveedor',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h1 class="text-2xl font-black text-white">Relación de Pagos Liquidados</h1>
        <p class="text-xs text-slate-400 mt-1">Comprobantes de transferencia bancaria y pagos procesados por la tesorería del banco.</p>
      </div>

      <div class="p-6 bg-[#09090b] border border-zinc-800 rounded-2xl">
        <table class="w-full text-xs text-left">
          <thead>
            <tr class="border-b border-zinc-800 text-slate-400 uppercase font-bold text-[10px]">
              <th class="py-3 px-4">Referencia Bancaria</th>
              <th class="py-3 px-4">Fecha Pago</th>
              <th class="py-3 px-4">Banco Origen</th>
              <th class="py-3 px-4">Cuenta Destino</th>
              <th class="py-3 px-4 text-right">Monto Liquidado USD</th>
              <th class="py-3 px-4 text-center">Estatus</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800/60 text-slate-200">
            <tr *ngFor="let p of pagos" class="hover:bg-zinc-900/60 transition-colors">
              <td class="py-4 px-4 font-bold font-mono text-emerald-400">{{ p.referencia }}</td>
              <td class="py-4 px-4">{{ p.fechaPago }}</td>
              <td class="py-4 px-4">{{ p.bancoOrigen }}</td>
              <td class="py-4 px-4 font-semibold text-white">{{ p.bancoDestino }}</td>
              <td class="py-4 px-4 text-right font-bold font-mono text-emerald-400">{{ '$' + p.montoLiquidado.toLocaleString() }}</td>
              <td class="py-4 px-4 text-center">
                <span class="px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {{ p.estatus }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class PagosProveedorComponent implements OnInit {
  pagos: any[] = [];
  constructor(private portalApi: PortalApiService) {}
  ngOnInit() {
    this.portalApi.getPagos().subscribe(res => this.pagos = res || []);
  }
}
