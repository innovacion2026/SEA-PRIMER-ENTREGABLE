import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../services/api.service';
import { fmtMoney } from '../../data/mock';

@Component({
  selector: 'app-rendicion-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="w-full max-w-4xl bg-white border-2 border-primary rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="p-5 border-b-2 border-primary/20 bg-muted/45 flex items-center justify-between">
          <div>
            <h3 class="text-xl font-black text-primary flex items-center gap-2">
              <lucide-icon name="file-text" class="text-primary"></lucide-icon>
              Rendición de Gastos: {{ viatico?.codigo }}
            </h3>
            <p class="text-xs text-muted-foreground mt-0.5">Carga tus facturas y soportes para la liquidación final del viático.</p>
          </div>
          <button (click)="close()" class="h-8 w-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-muted-foreground">
            <lucide-icon name="x" class="h-5 w-5"></lucide-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto flex-1">
          
          <!-- Left side: Form -->
          <div class="space-y-4 border-r pr-4">
            <h4 class="font-bold text-sm uppercase text-primary border-b pb-1">Añadir Gasto</h4>
            
            <div class="space-y-3">
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Categoría</label>
                <input type="text" [(ngModel)]="categoria" placeholder="Ej: Hotel, Vuelo..." class="w-full h-10 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary" />
              </div>
              
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Descripción</label>
                <input type="text" [(ngModel)]="descripcion" placeholder="Ej: Cena con cliente..." class="w-full h-10 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary" />
              </div>
              
              <div class="grid grid-cols-2 gap-2">
                <div class="space-y-1.5">
                  <label class="text-xs uppercase tracking-wider font-bold">Monto</label>
                  <input type="number" [(ngModel)]="monto" placeholder="0.00" class="w-full h-10 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs uppercase tracking-wider font-bold">Nro Factura</label>
                  <input type="text" [(ngModel)]="factura_nro" placeholder="OPT-001" class="w-full h-10 px-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-primary" />
                </div>
              </div>
              
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Soporte (PDF/Imagen)</label>
                <div class="flex items-center gap-2">
                  <button type="button" class="w-full border-2 border-dashed border-primary/40 hover:border-primary hover:bg-primary/5 h-20 flex flex-col items-center justify-center gap-1 rounded-xl text-muted-foreground transition-all" (click)="fileInput.click()">
                    <lucide-icon name="plus" class="h-5 w-5 text-primary"></lucide-icon>
                    <span class="text-[10px] truncate max-w-full px-2">{{ selectedFile ? selectedFile.name : "Subir archivo" }}</span>
                  </button>
                  <input #fileInput type="file" class="hidden" (change)="onFileSelected($event)" />
                </div>
              </div>
              
              <button (click)="submitGasto()" [disabled]="loadingAdd" class="w-full h-11 bg-primary hover:bg-primary/95 text-white gap-2 flex items-center justify-center rounded-xl font-bold transition-all disabled:opacity-50">
                <lucide-icon name="plus" class="h-4 w-4"></lucide-icon>
                Registrar Gasto
              </button>
            </div>
          </div>

          <!-- Right side: Table -->
          <div class="md:col-span-2 space-y-4">
            <div class="flex items-center justify-between border-b pb-1">
              <h4 class="font-bold text-sm uppercase text-primary">Gastos Cargados</h4>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                Total: {{ formatMoney(totalRendido) }}
              </span>
            </div>

            <div class="border-2 rounded-xl overflow-hidden bg-slate-50">
              <table class="w-full text-sm">
                <thead class="bg-muted/50 border-b-2 border-slate-200">
                  <tr>
                    <th class="text-left p-3 text-xs uppercase font-bold text-slate-700">Descripción</th>
                    <th class="text-left p-3 text-xs uppercase font-bold text-slate-700">Cat.</th>
                    <th class="text-right p-3 text-xs uppercase font-bold text-slate-700">Monto</th>
                    <th class="text-center p-3 text-xs uppercase font-bold text-slate-700">Soporte</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngIf="loadingGastos">
                    <td colSpan="4" class="text-center py-8 text-muted-foreground">Cargando soporte...</td>
                  </tr>
                  <tr *ngIf="!loadingGastos && gastos.length === 0">
                    <td colSpan="4" class="text-center py-8 text-muted-foreground italic">No hay gastos registrados.</td>
                  </tr>
                  <tr *ngFor="let g of gastos" class="border-b border-slate-100 last:border-0 bg-white">
                    <td class="p-3 font-semibold text-xs">
                      {{ g.descripcion }}
                      <div *ngIf="g.factura_nro" class="text-[9px] text-muted-foreground uppercase">Fac: {{ g.factura_nro }}</div>
                    </td>
                    <td class="p-3 text-[10px] uppercase font-bold text-slate-500">{{ g.categoria }}</td>
                    <td class="p-3 text-right font-bold text-slate-900">{{ formatMoney(g.monto) }}</td>
                    <td class="p-3 text-center">
                      <a *ngIf="g.archivo_nombre" [href]="getArchivoDownloadUrl(g.id)" target="_blank" class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary/40 text-primary hover:bg-primary hover:text-white transition-colors">
                        <lucide-icon name="plus" class="h-3.5 w-3.5"></lucide-icon>
                      </a>
                      <span *ngIf="!g.archivo_nombre" class="text-[10px] text-muted-foreground italic">N/A</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 flex gap-2">
              <lucide-icon name="check" class="h-4 w-4 shrink-0"></lucide-icon>
              <span>
                Presupuesto asignado: {{ formatMoney(viatico?.monto) }}. 
                <strong *ngIf="totalRendido > (viatico?.monto || 0)">
                  Exceso de gastos: {{ formatMoney(totalRendido - viatico.monto) }}
                </strong>
                <strong *ngIf="totalRendido <= (viatico?.monto || 0)">
                  Saldo a favor: {{ formatMoney(viatico.monto - totalRendido) }}
                </strong>
              </span>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-200 bg-muted/45 flex justify-end gap-2">
          <button (click)="close()" class="h-10 px-4 border-2 border-slate-300 rounded-xl font-bold bg-white hover:bg-slate-100 transition-all">Cerrar</button>
          <button (click)="close()" class="h-10 px-6 bg-primary text-white hover:bg-primary/95 border-2 border-primary rounded-xl font-bold transition-all">
            Finalizar Rendición
          </button>
        </div>

      </div>
    </div>
  `
})
export class RendicionDialogComponent implements OnChanges {
  @Input() open = false;
  @Input() viatico: any;
  @Output() openChange = new EventEmitter<boolean>();

  categoria = 'Comida';
  descripcion = '';
  monto = '';
  factura_nro = '';
  selectedFile: File | null = null;

  gastos: any[] = [];
  loadingGastos = false;
  loadingAdd = false;

  constructor(private apiService: ApiService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']?.currentValue === true && this.viatico?.id) {
      this.loadGastos();
    }
  }

  loadGastos() {
    this.loadingGastos = true;
    this.apiService.fetchGastos(this.viatico.id).subscribe({
      next: (res) => {
        this.gastos = res || [];
        this.loadingGastos = false;
      },
      error: () => {
        this.loadingGastos = false;
      }
    });
  }

  get totalRendido(): number {
    return this.gastos.reduce((acc, g) => acc + Number(g.monto || 0), 0);
  }

  formatMoney(val: any) {
    return fmtMoney(Number(val) || 0);
  }

  getArchivoDownloadUrl(gastoId: number): string {
    return this.apiService.getArchivoUrl(gastoId);
  }

  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
    }
  }

  close() {
    this.reset();
    this.open = false;
    this.openChange.emit(false);
  }

  reset() {
    this.categoria = 'Comida';
    this.descripcion = '';
    this.monto = '';
    this.factura_nro = '';
    this.selectedFile = null;
    this.gastos = [];
  }

  submitGasto() {
    if (!this.monto || !this.descripcion) return;

    this.loadingAdd = true;
    const formData = new FormData();
    formData.append('categoria', this.categoria);
    formData.append('descripcion', this.descripcion);
    formData.append('monto', this.monto);
    formData.append('factura_nro', this.factura_nro);
    if (this.selectedFile) {
      formData.append('archivo', this.selectedFile);
    }

    this.apiService.addGasto(this.viatico.id, formData).subscribe({
      next: () => {
        this.loadingAdd = false;
        this.categoria = 'Comida';
        this.descripcion = '';
        this.monto = '';
        this.factura_nro = '';
        this.selectedFile = null;
        this.loadGastos();
      },
      error: () => {
        this.loadingAdd = false;
      }
    });
  }
}
