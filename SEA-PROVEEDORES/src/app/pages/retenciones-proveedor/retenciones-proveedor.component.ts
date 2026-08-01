import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { PortalApiService } from '../../services/portal-api.service';

@Component({
  selector: 'app-retenciones-proveedor',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h1 class="text-2xl font-black text-white">Comprobantes de Retención Fiscal</h1>
        <p class="text-xs text-slate-400 mt-1">Consulta y descarga de comprobantes de retención IVA (75%) e ISLR emitidos por el banco.</p>
      </div>

      <div class="p-6 bg-[#09090b] border border-zinc-800 rounded-2xl space-y-4">
        <table class="w-full text-xs text-left">
          <thead>
            <tr class="border-b border-zinc-800 text-slate-400 uppercase font-bold text-[10px]">
              <th class="py-3 px-4">N° Comprobante</th>
              <th class="py-3 px-4">Tipo Retención</th>
              <th class="py-3 px-4">Periodo</th>
              <th class="py-3 px-4">Factura Origen</th>
              <th class="py-3 px-4 text-right">Monto Base USD</th>
              <th class="py-3 px-4 text-right">Monto Retenido</th>
              <th class="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800/60 text-slate-200">
            <tr *ngFor="let r of retenciones" class="hover:bg-zinc-900/60 transition-colors">
              <td class="py-4 px-4 font-bold font-mono text-purple-400">{{ r.comprobante }}</td>
              <td class="py-4 px-4 font-semibold text-white">{{ r.tipo }}</td>
              <td class="py-4 px-4 font-mono">{{ r.periodo }}</td>
              <td class="py-4 px-4 text-slate-300">{{ r.facturaOrigen }}</td>
              <td class="py-4 px-4 text-right font-mono">{{ '$' + r.montoBase.toLocaleString() }}</td>
              <td class="py-4 px-4 text-right font-bold font-mono text-purple-400">{{ '$' + r.montoRetenido.toLocaleString() }}</td>
              <td class="py-4 px-4 text-center">
                <button (click)="descargar(r)" class="h-8 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-bold transition-all inline-flex items-center gap-1">
                  <lucide-icon name="download" class="h-3.5 w-3.5"></lucide-icon> Descargar PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class RetencionesProveedorComponent implements OnInit {
  retenciones: any[] = [];
  constructor(private portalApi: PortalApiService) {}
  ngOnInit() {
    this.portalApi.getRetenciones().subscribe(res => this.retenciones = res || []);
  }

  descargar(ret: any) {
    alert(`Descargando Comprobante Oficial PDF: ${ret.comprobante}`);
  }
}
