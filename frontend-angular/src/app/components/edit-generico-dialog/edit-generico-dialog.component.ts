import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-edit-generico-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="w-full max-w-xl bg-white border-2 border-primary rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="p-5 border-b-2 border-primary/20 bg-muted/45 flex items-center justify-between">
          <div>
            <h3 class="text-xl font-black text-primary">Editar Registro: {{ title }}</h3>
          </div>
          <button (click)="close()" class="h-8 w-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-muted-foreground">
            <lucide-icon name="x" class="h-5 w-5"></lucide-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto flex-1 space-y-4">
          <div *ngFor="let col of editableKeys" class="space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500">{{ col.label }}</label>
            
            <ng-container *ngIf="col.key === 'estatus' || col.key === 'etapa' || col.key === 'tipo'; else standardInput">
              <select [(ngModel)]="data[col.key]" class="w-full h-11 px-3 rounded-lg border-2 border-primary/45 focus:outline-none focus:border-primary bg-white font-medium">
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
                <option value="En revisión">En revisión</option>
                <option value="Pagado">Pagado</option>
                <option value="Rendición">Rendición</option>
                <option value="Reposición">Reposición</option>
                <option value="Apertura">Apertura</option>
              </select>
            </ng-container>
            
            <ng-template #standardInput>
              <input
                [(ngModel)]="data[col.key]"
                [type]="col.format === 'money' ? 'number' : 'text'"
                class="w-full h-11 px-3 rounded-lg border-2 border-primary/45 focus:outline-none focus:border-primary"
              />
            </ng-template>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-200 bg-muted/45 flex justify-end gap-2">
          <button (click)="close()" class="h-10 px-4 border-2 border-slate-300 rounded-xl font-bold bg-white hover:bg-slate-100 transition-all">Cancelar</button>
          <button (click)="save()" class="h-10 px-6 bg-primary text-white border-2 border-primary rounded-xl font-bold transition-all hover:bg-primary/95">
            Guardar Cambios
          </button>
        </div>

      </div>
    </div>
  `
})
export class EditGenericoDialogComponent implements OnChanges {
  @Input() open = false;
  @Input() title = '';
  @Input() initialData: any = null;
  @Input() columns: any[] = [];
  @Output() openChange = new EventEmitter<boolean>();
  @Output() saveChanges = new EventEmitter<any>();

  data: any = {};
  editableKeys: any[] = [];

  ngOnChanges() {
    if (this.initialData) {
      this.data = { ...this.initialData };
    }
    this.editableKeys = this.columns.filter(c => !["id", "created_at"].includes(c.key));
  }

  close() {
    this.open = false;
    this.openChange.emit(false);
  }

  save() {
    this.saveChanges.emit(this.data);
    this.close();
  }
}
