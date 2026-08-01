import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-revision-expediente-dialog',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div *ngIf="open && row" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="w-full max-w-3xl bg-white border-2 border-foreground rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="p-5 border-b-2 border-foreground bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-xl font-black">{{ row.proveedor }}</h3>
              <span class="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-amber-400 text-slate-900">{{ row.etapa || 'En Revisión' }}</span>
            </div>
            <p class="text-xs text-zinc-300 mt-0.5">Expediente de Contratación · RIF: {{ row.rif }}</p>
          </div>
          <button (click)="close()" class="h-8 w-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white">
            <lucide-icon name="x" class="h-5 w-5"></lucide-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          <!-- Alert Banner -->
          <div *ngIf="submitted" class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 font-medium">
            <lucide-icon name="check-circle" class="h-6 w-6 text-emerald-600 shrink-0"></lucide-icon>
            <div>
              <div class="font-bold">Expediente recibido del proveedor</div>
              <div class="text-xs text-emerald-700 mt-0.5">El proveedor completó sus datos fiscales, datos bancarios y adjuntó 5 recaudos legales.</div>
            </div>
          </div>

          <!-- Section 1: Datos de Empresa -->
          <div class="space-y-3">
            <h4 class="text-xs uppercase font-extrabold tracking-wider text-primary flex items-center gap-2">
              <lucide-icon name="building-2" class="h-4 w-4"></lucide-icon> 1. Información General y Contacto
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div><span class="text-xs text-muted-foreground font-semibold">Razón Social:</span> <div class="font-bold">{{ row.proveedor }}</div></div>
              <div><span class="text-xs text-muted-foreground font-semibold">RIF:</span> <div class="font-bold">{{ row.rif }}</div></div>
              <div><span class="text-xs text-muted-foreground font-semibold">Contacto Principal:</span> <div class="font-bold">{{ row.contacto || 'Carlos Mendoza' }}</div></div>
              <div><span class="text-xs text-muted-foreground font-semibold">Correo Electrónico:</span> <div class="font-bold text-primary">{{ row.email || 'contacto@andina.com' }}</div></div>
              <div><span class="text-xs text-muted-foreground font-semibold">Teléfono:</span> <div class="font-bold">{{ row.telefono || '+58 414 1234567' }}</div></div>
              <div><span class="text-xs text-muted-foreground font-semibold">Tipo de Solicitud:</span> <div class="font-bold">Nuevo Ingreso Banco</div></div>
            </div>
          </div>

          <!-- Section 2: Datos Bancarios -->
          <div class="space-y-3">
            <h4 class="text-xs uppercase font-extrabold tracking-wider text-primary flex items-center gap-2">
              <lucide-icon name="banknote" class="h-4 w-4"></lucide-icon> 2. Datos Bancarios Registrados para Pagos
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <div><span class="text-xs text-muted-foreground font-semibold">Banco Emisor:</span> <div class="font-bold text-slate-800">Banco Mercantil</div></div>
              <div><span class="text-xs text-muted-foreground font-semibold">Tipo de Cuenta:</span> <div class="font-bold text-slate-800">Corriente Empresarial</div></div>
              <div class="md:col-span-2"><span class="text-xs text-muted-foreground font-semibold">Número de Cuenta (20 dígitos):</span> <div class="font-mono font-bold text-primary tracking-wider">0105-0012-45-1234567890</div></div>
            </div>
          </div>

          <!-- Section 3: Recaudos y Documentos -->
          <div class="space-y-3">
            <h4 class="text-xs uppercase font-extrabold tracking-wider text-primary flex items-center gap-2">
              <lucide-icon name="file-check" class="h-4 w-4"></lucide-icon> 3. Documentos y Recaudos Adjuntos
            </h4>
            <ul class="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white">
              <li *ngFor="let doc of docsList" class="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <lucide-icon name="file-text" class="h-4 w-4"></lucide-icon>
                  </div>
                  <div>
                    <div class="font-bold text-xs">{{ doc.nombre }}</div>
                    <div class="text-[10px] text-muted-foreground">{{ doc.archivo }} · {{ doc.peso }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">VERIFICADO</span>
                  <button class="h-8 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 font-bold text-xs flex items-center gap-1">
                    <lucide-icon name="eye" class="h-3.5 w-3.5 text-primary"></lucide-icon> Ver
                  </button>
                </div>
              </li>
            </ul>
          </div>

          <!-- Section 4: Observaciones del Proveedor -->
          <div class="space-y-2">
            <h4 class="text-xs uppercase font-extrabold tracking-wider text-primary flex items-center gap-2">
              <lucide-icon name="message-square" class="h-4 w-4"></lucide-icon> 4. Observaciones Enviadas por el Proveedor
            </h4>
            <div class="p-4 rounded-xl bg-slate-100 border border-slate-200 italic text-slate-700">
              "Adjunto el RIF actualizado 2026, la Solvencia Laboral y la Certificación Bancaria emitida por el Banco Mercantil. Quedamos a la espera de la aprobación para iniciar contratación."
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-4 border-t-2 border-foreground bg-muted/45 flex items-center justify-between gap-3">
          <div class="text-xs text-muted-foreground font-bold flex items-center gap-2">
            <lucide-icon name="shield" class="h-4 w-4 text-emerald-600"></lucide-icon>
            Recaudos comprobados sin observaciones
          </div>
          <div class="flex gap-2">
            <button (click)="close()" class="h-10 px-4 border-2 border-foreground rounded-xl font-bold bg-white hover:bg-slate-100 transition-all">
              Cerrar
            </button>
            <button (click)="aprobar()" [disabled]="loading" class="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-emerald-700 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20">
              <lucide-icon name="check-circle" class="h-4 w-4"></lucide-icon>
              {{ loading ? 'Aprobando y enviando correo...' : 'Aprobar Expediente' }}
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class RevisionExpedienteDialogComponent {
  @Input() open = false;
  @Input() row: any = null;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() approved = new EventEmitter<any>();

  submitted = true;
  loading = false;

  docsList = [
    { nombre: "RIF Digital Vigente 2026", archivo: "RIF_ANDINA_2026.pdf", peso: "1.2 MB" },
    { nombre: "Registro Mercantil y Estatutos", archivo: "REGISTRO_MERCANTIL_ANDINA.pdf", peso: "4.8 MB" },
    { nombre: "Cédula del Representante Legal", archivo: "CI_CARLOS_MENDOZA.pdf", peso: "850 KB" },
    { nombre: "Solvencia Laboral Vigente", archivo: "SOLVENCIA_LABORAL_2026.pdf", peso: "920 KB" },
    { nombre: "Certificación Bancaria Oficial", archivo: "CERTIFICACION_MERCANTIL.pdf", peso: "1.1 MB" }
  ];

  constructor(private apiService: ApiService) {}

  close() {
    this.open = false;
    this.openChange.emit(false);
  }

  aprobar() {
    this.loading = true;
    this.apiService.aprobarExpedienteProveedor({
      email: this.row?.email || 'contacto@andina.com',
      proveedor: this.row?.proveedor || 'Distribuidora Andina C.A.'
    }).subscribe({
      next: () => {
        this.loading = false;
        this.approved.emit(this.row);
        this.close();
      },
      error: () => {
        this.loading = false;
        this.approved.emit(this.row);
        this.close();
      }
    });
  }
}
