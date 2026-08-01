import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { PortalApiService } from '../../services/portal-api.service';

interface DocumentoLegal {
  id: number;
  nombre: string;
  categoria: string;
  archivo: string;
  peso: string;
  fechaCarga: string;
  fechaVencimiento: string;
  estatus: 'VERIFICADO' | 'EN REVISIÓN' | 'POR RENOVAR';
}

@Component({
  selector: 'app-documentos-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Top Title and Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black text-white">Bóveda de Documentación y Recaudos Legales</h1>
          <p class="text-xs text-slate-400 mt-1">Expediente digital compartido con la administración bancaria de SEA (Solicitudes y Directorio).</p>
        </div>
        <button (click)="openSubirModal = true" class="h-11 px-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto">
          <lucide-icon name="plus" class="h-5 w-5"></lucide-icon> Cargar Nuevo Recaudo PDF
        </button>
      </div>

      <!-- Verification Summary Banner -->
      <div class="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800 flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-3">
          <div class="h-11 w-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <lucide-icon name="shield-check" class="h-6 w-6"></lucide-icon>
          </div>
          <div>
            <div class="text-sm font-bold text-white">Expediente Legal Verificado por SEA Banco</div>
            <div class="text-xs text-emerald-400 font-semibold mt-0.5">5 de 5 recaudos obligatorios validados por cumplimiento y auditoría.</div>
          </div>
        </div>
        <div class="text-xs text-slate-400 font-mono font-bold">
          Última actualización sincronizada: <span class="text-white">Hoy 17:40 hrs</span>
        </div>
      </div>

      <!-- Main Documents Table -->
      <div class="p-6 bg-[#09090b] border border-zinc-800 rounded-2xl space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <lucide-icon name="file-text" class="h-4 w-4 text-blue-400"></lucide-icon> Recaudos Compartidos en la Plataforma
          </h2>
          <span class="text-xs text-slate-400 font-mono font-semibold">{{ documentos.length }} documentos guardados</span>
        </div>

        <table class="w-full text-xs text-left">
          <thead>
            <tr class="border-b border-zinc-800 text-slate-400 uppercase font-bold text-[10px]">
              <th class="py-3 px-4">Documento / Categoria</th>
              <th class="py-3 px-4">Nombre Archivo PDF</th>
              <th class="py-3 px-4">Fecha Carga</th>
              <th class="py-3 px-4">Vencimiento</th>
              <th class="py-3 px-4 text-center">Estatus Validación</th>
              <th class="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800/60 text-slate-200">
            <tr *ngFor="let d of documentos" class="hover:bg-zinc-900/60 transition-colors">
              <td class="py-4 px-4 font-bold text-white">
                <div>{{ d.nombre }}</div>
                <div class="text-[10px] text-blue-400 uppercase font-bold tracking-wider mt-0.5">{{ d.categoria }}</div>
              </td>
              <td class="py-4 px-4 font-mono text-slate-300">
                <div class="flex items-center gap-1.5">
                  <lucide-icon name="file-text" class="h-3.5 w-3.5 text-slate-400 shrink-0"></lucide-icon>
                  <span>{{ d.archivo }}</span>
                </div>
                <div class="text-[10px] text-slate-500 font-sans">{{ d.peso }}</div>
              </td>
              <td class="py-4 px-4 text-slate-400 font-mono">{{ d.fechaCarga }}</td>
              <td class="py-4 px-4 text-slate-400 font-mono">{{ d.fechaVencimiento }}</td>
              <td class="py-4 px-4 text-center">
                <span [class]="'px-2.5 py-1 rounded-full text-[9px] uppercase font-extrabold border ' + getEstatusClass(d.estatus)">
                  {{ d.estatus }}
                </span>
              </td>
              <td class="py-4 px-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button (click)="verDocumento(d)" class="h-8 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-slate-200 inline-flex items-center gap-1 transition-colors" title="Visualizar documento">
                    <lucide-icon name="eye" class="h-3.5 w-3.5 text-blue-400"></lucide-icon> Ver
                  </button>
                  <label class="h-8 px-2.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-400 border border-blue-800 text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors" title="Actualizar documento">
                    <lucide-icon name="download" class="h-3.5 w-3.5 rotate-180"></lucide-icon> Actualizar
                    <input type="file" accept="application/pdf" class="hidden" (change)="actualizarArchivo($event, d)" />
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Upload New Document Modal -->
      <div *ngIf="openSubirModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div class="w-full max-w-md bg-[#09090b] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          
          <div class="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <lucide-icon name="file-text" class="h-5 w-5"></lucide-icon>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Cargar Nuevo Recaudo PDF</h3>
                <p class="text-xs text-slate-400">Se enviará a SEA Administración para validación</p>
              </div>
            </div>
            <button (click)="openSubirModal = false" class="h-8 w-8 text-slate-400 hover:text-white flex items-center justify-center">
              <lucide-icon name="x" class="h-5 w-5"></lucide-icon>
            </button>
          </div>

          <div class="space-y-4 text-xs">
            <div class="space-y-1.5">
              <label class="font-bold text-slate-300">Tipo / Nombre del Documento *</label>
              <input type="text" [(ngModel)]="nuevoNombre" placeholder="Ej: Certificado ISO 9001, Registro de Marca..." class="w-full h-11 px-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 focus:outline-none" />
            </div>

            <div class="space-y-1.5">
              <label class="font-bold text-slate-300">Categoría *</label>
              <select [(ngModel)]="nuevaCategoria" class="w-full h-11 px-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 focus:outline-none">
                <option value="Legal & Fiscal">Legal & Fiscal</option>
                <option value="Laboral & SS">Laboral & Seguridad Social</option>
                <option value="Bancario">Bancario & Financiero</option>
                <option value="Técnico & Calidad">Técnico & Calidad</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="font-bold text-slate-300">Seleccionar Archivo PDF *</label>
              <div class="p-4 bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-2xl text-center cursor-pointer hover:border-blue-500 transition-colors">
                <lucide-icon name="file-text" class="h-8 w-8 text-blue-400 mx-auto mb-2"></lucide-icon>
                <div class="text-white font-bold">{{ nuevoArchivoNombre || 'Haga clic para elegir archivo PDF' }}</div>
                <div class="text-[10px] text-slate-500 mt-0.5">Formatos permitidos: .PDF (Máx 10 MB)</div>
                <input type="file" accept="application/pdf" class="hidden" (change)="onFileChange($event)" />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button (click)="openSubirModal = false" class="h-11 px-5 border border-zinc-700 text-slate-300 hover:bg-zinc-800 font-bold rounded-xl">Cancelar</button>
            <button (click)="guardarNuevoDocumento()" [disabled]="!nuevoNombre || !nuevoArchivoNombre" class="h-11 px-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30">
              Cargar Recaudo
            </button>
          </div>

        </div>
      </div>

    </div>
  `
})
export class DocumentosProveedorComponent {
  openSubirModal = false;
  nuevoNombre = '';
  nuevaCategoria = 'Legal & Fiscal';
  nuevoArchivoNombre = '';
  nuevoPeso = '1.5 MB';

  documentos: DocumentoLegal[] = [
    { id: 1, nombre: "RIF Digital Vigente 2026", categoria: "Legal & Fiscal", archivo: "RIF_ANDINA_2026.pdf", peso: "1.2 MB", fechaCarga: "2026-01-15", fechaVencimiento: "2026-12-31", estatus: "VERIFICADO" },
    { id: 2, nombre: "Registro Mercantil y Estatutos", categoria: "Legal & Fiscal", archivo: "REGISTRO_MERCANTIL_ANDINA.pdf", peso: "4.8 MB", fechaCarga: "2026-01-15", fechaVencimiento: "Indefinido", estatus: "VERIFICADO" },
    { id: 3, nombre: "Cédula del Representante Legal", categoria: "Legal & Fiscal", archivo: "CI_CARLOS_MENDOZA.pdf", peso: "850 KB", fechaCarga: "2026-01-15", fechaVencimiento: "2028-09-10", estatus: "VERIFICADO" },
    { id: 4, nombre: "Solvencia Laboral Vigente", categoria: "Laboral & SS", archivo: "SOLVENCIA_LABORAL_2026.pdf", peso: "920 KB", fechaCarga: "2026-02-01", fechaVencimiento: "2026-08-01", estatus: "POR RENOVAR" },
    { id: 5, nombre: "Certificación Bancaria Oficial", categoria: "Bancario", archivo: "CERTIFICACION_MERCANTIL.pdf", peso: "1.1 MB", fechaCarga: "2026-01-15", fechaVencimiento: "2026-07-15", estatus: "VERIFICADO" }
  ];

  getEstatusClass(estatus: string): string {
    switch (estatus) {
      case 'VERIFICADO': return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'POR RENOVAR': return 'bg-amber-950 text-amber-400 border-amber-800';
      default: return 'bg-blue-950 text-blue-400 border-blue-800';
    }
  }

  verDocumento(d: DocumentoLegal) {
    alert(`Visualizando documento PDF: ${d.archivo}`);
  }

  actualizarArchivo(event: any, d: DocumentoLegal) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      d.archivo = files[0].name;
      d.estatus = 'EN REVISIÓN';
      d.fechaCarga = new Date().toISOString().slice(0, 10);
      alert(`Documento "${files[0].name}" actualizado con éxito. Pasó a verificación por la administración.`);
    }
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.nuevoArchivoNombre = files[0].name;
      this.nuevoPeso = `${(files[0].size / (1024 * 1024)).toFixed(1)} MB`;
    }
  }

  guardarNuevoDocumento() {
    if (!this.nuevoNombre || !this.nuevoArchivoNombre) return;

    const newDoc: DocumentoLegal = {
      id: Date.now(),
      nombre: this.nuevoNombre,
      categoria: this.nuevaCategoria,
      archivo: this.nuevoArchivoNombre,
      peso: this.nuevoPeso,
      fechaCarga: new Date().toISOString().slice(0, 10),
      fechaVencimiento: "2027-01-01",
      estatus: 'EN REVISIÓN'
    };

    this.documentos.unshift(newDoc);
    this.openSubirModal = false;
    this.nuevoNombre = '';
    this.nuevoArchivoNombre = '';
    alert("¡Nuevo recaudo cargado con éxito! Ha sido registrado en el expediente para la administración bancaria.");
  }
}
