import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { fmtMoney, fmtDate } from '../../data/mock';

@Component({
  selector: 'app-detalle-dialog',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="w-full max-w-2xl bg-white border-2 border-primary rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="p-5 border-b-2 border-primary/20 bg-muted/45 flex items-center justify-between">
          <div>
            <h3 class="text-xl font-black text-primary">Detalle: {{ title }}</h3>
          </div>
          <button (click)="close()" class="h-8 w-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-muted-foreground">
            <lucide-icon name="x" class="h-5 w-5"></lucide-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto flex-1">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div *ngFor="let key of allKeys" class="space-y-1 p-2 rounded-lg bg-muted/30 border border-primary/10">
              <span class="text-[10px] font-bold text-primary uppercase tracking-wider">{{ getLabel(key) }}</span>
              <p class="text-sm font-semibold text-slate-800">{{ renderVal(key, data[key]) }}</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-200 bg-muted/45 flex justify-end">
          <button (click)="close()" class="h-10 px-6 bg-primary text-white border-2 border-primary rounded-xl font-bold transition-all hover:bg-primary/95">
            Cerrar
          </button>
        </div>

      </div>
    </div>
  `
})
export class DetalleDialogComponent implements OnChanges {
  @Input() open = false;
  @Input() title = '';
  @Input() data: any = null;
  @Input() columns: any[] = [];
  @Output() openChange = new EventEmitter<boolean>();

  allKeys: string[] = [];

  ngOnChanges() {
    if (this.data) {
      this.allKeys = Object.keys(this.data).filter(k => !["id", "created_at", "comite_id", "proveedor_id"].includes(k));
    } else {
      this.allKeys = [];
    }
  }

  getLabel(key: string): string {
    const col = this.columns.find(c => c.key === key);
    return col?.label || key.replace(/_/g, ' ').toUpperCase();
  }

  renderVal(key: string, val: any): string {
    const col = this.columns.find(c => c.key === key);
    if (val === undefined || val === null || val === "") return "—";
    if (col?.format === "money") return fmtMoney(Number(val));
    if (col?.format === "date") return fmtDate(String(val));
    return String(val);
  }

  close() {
    this.open = false;
    this.openChange.emit(false);
  }
}
