import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-contratos-proveedor',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h1 class="text-2xl font-black text-white">Contratos y Términos & Condiciones</h1>
        <p class="text-xs text-slate-400 mt-1">Revisión de acuerdos comerciales y carga de contratos firmados y sellados por la empresa.</p>
      </div>

      <div class="p-6 bg-[#09090b] border border-zinc-800 rounded-2xl space-y-4">
        <div *ngFor="let c of contratos" class="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-950 text-indigo-400 border border-indigo-800">
                  {{ c.codigo }}
                </span>
                <h3 class="text-sm font-bold text-white">{{ c.titulo }}</h3>
              </div>
              <p class="text-xs text-slate-400 mt-1">Emisión: {{ c.fecha }} · Monto Adjudicado: <span class="text-emerald-400 font-mono font-bold">{{ '$' + c.monto.toLocaleString() }} USD</span></p>
            </div>
            <span [class]="'px-3 py-1 rounded-full text-[10px] uppercase font-bold border self-start sm:self-auto ' + (c.firmado ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-amber-950 text-amber-400 border-amber-800')">
              {{ c.firmado ? 'CONTRATO ENTREGADO' : 'PENDIENTE FIRMA Y SELLO' }}
            </span>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div class="text-slate-300">
              Documento base: <span class="font-bold text-white">{{ c.archivoBase }}</span>
            </div>
            <div class="flex items-center gap-3">
              <button (click)="descargarContrato(c)" class="h-9 px-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors">
                <lucide-icon name="download" class="h-4 w-4 text-blue-400"></lucide-icon> Descargar Borrador PDF
              </button>

              <label *ngIf="!c.firmado" class="h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-600/30">
                <lucide-icon name="plus" class="h-4 w-4"></lucide-icon> Subir Contrato Firmado (PDF)
                <input type="file" accept="application/pdf" class="hidden" (change)="subirFirmado($event, c)" />
              </label>

              <span *ngIf="c.firmado" class="font-bold text-emerald-400 flex items-center gap-1">
                <lucide-icon name="check-circle" class="h-4 w-4"></lucide-icon> {{ c.archivoFirmado }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContratosProveedorComponent {
  contratos = [
    {
      codigo: "PRE-2026-022",
      titulo: "Contrato Marco de Suministro de Equipos de Computación",
      fecha: "2026-05-15",
      monto: 38500,
      archivoBase: "CONTRATO_MARCO_COMPUTACION_2026.pdf",
      firmado: false,
      archivoFirmado: ""
    }
  ];

  descargarContrato(c: any) {
    alert(`Descargando borrador oficial: ${c.archivoBase}`);
  }

  subirFirmado(event: any, c: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      c.archivoFirmado = files[0].name;
      c.firmado = true;
      alert(`Contrato firmado "${files[0].name}" subido con éxito al portal del banco.`);
    }
  }
}
