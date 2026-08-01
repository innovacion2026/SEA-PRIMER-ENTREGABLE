import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { PortalApiService } from '../../services/portal-api.service';

@Component({
  selector: 'app-ordenes-proveedor',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h1 class="text-2xl font-black text-white">Órdenes de Compra Requeridas</h1>
        <p class="text-xs text-slate-400 mt-1">Consulta de contrataciones y órdenes de compra emitidas por el banco a su favor.</p>
      </div>

      <div class="p-6 bg-[#09090b] border border-zinc-800 rounded-2xl">
        <table class="w-full text-xs text-left">
          <thead>
            <tr class="border-b border-zinc-800 text-slate-400 uppercase font-bold text-[10px]">
              <th class="py-3 px-4">Código Orden</th>
              <th class="py-3 px-4">Fecha Emisión</th>
              <th class="py-3 px-4">Concepto / Servicio</th>
              <th class="py-3 px-4 text-right">Monto USD</th>
              <th class="py-3 px-4 text-center">Estatus Entrega</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800/60 text-slate-200">
            <tr *ngFor="let o of ordenes" class="hover:bg-zinc-900/60 transition-colors">
              <td class="py-4 px-4 font-bold text-blue-400 font-mono">{{ o.codigo }}</td>
              <td class="py-4 px-4">{{ o.fecha }}</td>
              <td class="py-4 px-4 font-semibold text-white">{{ o.concepto }}</td>
              <td class="py-4 px-4 text-right font-bold font-mono">{{ '$' + o.monto.toLocaleString() }}</td>
              <td class="py-4 px-4 text-center">
                <span class="px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-blue-950 text-blue-400 border border-blue-800">
                  {{ o.estatus }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class OrdenesProveedorComponent implements OnInit {
  ordenes: any[] = [];
  constructor(private portalApi: PortalApiService) {}
  ngOnInit() {
    this.portalApi.getOrdenes().subscribe(res => this.ordenes = res || []);
  }
}
