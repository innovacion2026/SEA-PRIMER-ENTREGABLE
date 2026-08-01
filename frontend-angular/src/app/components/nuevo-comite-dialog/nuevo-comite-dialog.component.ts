import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

interface Miembro {
  nombre: string;
  cargo: string;
  cedula: string;
  email: string;
}

@Component({
  selector: 'app-nuevo-comite-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="w-full max-w-3xl bg-white border-2 border-primary rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="p-5 border-b-2 border-primary/20 bg-muted/45 flex items-center justify-between">
          <div>
            <h3 class="text-xl font-black text-primary">Nuevo Comité y Miembros</h3>
          </div>
          <button (click)="close()" class="h-8 w-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-muted-foreground">
            <lucide-icon name="x" class="h-5 w-5"></lucide-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto flex-1 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs uppercase tracking-wider font-bold">Código</label>
              <input type="text" [(ngModel)]="codigo" placeholder="COM-001" class="w-full h-11 px-3 rounded-lg border-2 border-primary/40 focus:outline-none focus:border-primary" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs uppercase tracking-wider font-bold">Nombre del Comité</label>
              <input type="text" [(ngModel)]="nombre" placeholder="Comité de Compras" class="w-full h-11 px-3 rounded-lg border-2 border-primary/40 focus:outline-none focus:border-primary" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs uppercase tracking-wider font-bold">Monto Máx. Aprobación</label>
              <input type="number" [(ngModel)]="monto_max_aprob" class="w-full h-11 px-3 rounded-lg border-2 border-primary/40 focus:outline-none focus:border-primary" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs uppercase tracking-wider font-bold">Frecuencia</label>
              <input type="text" [(ngModel)]="frecuencia" class="w-full h-11 px-3 rounded-lg border-2 border-primary/40 focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div class="space-y-4 pt-4 border-t-2 border-primary/10">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold uppercase tracking-widest text-primary">Asociar Miembros</h3>
              <button (click)="addMiembro()" class="h-9 px-3 border-2 border-primary text-primary hover:bg-primary/5 rounded-xl font-bold text-xs flex items-center gap-1.5">
                <lucide-icon name="plus" class="h-4 w-4"></lucide-icon>
                Agregar Miembro
              </button>
            </div>
            
            <div *ngIf="miembros.length === 0" class="text-center py-8 border-2 border-dashed border-primary/20 rounded-xl text-muted-foreground text-sm">
              No hay miembros asociados aún.
            </div>

            <div class="space-y-4" *ngIf="miembros.length > 0">
              <div *ngFor="let m of miembros; let idx = index" class="grid grid-cols-12 gap-3 p-4 bg-muted/40 rounded-xl border border-primary/10 relative group">
                <div class="col-span-11 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase text-slate-500">Nombre</label>
                    <input type="text" [(ngModel)]="m.nombre" class="w-full h-8 px-2 rounded border border-primary/30 focus:outline-none" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase text-slate-500">Cargo</label>
                    <input type="text" [(ngModel)]="m.cargo" class="w-full h-8 px-2 rounded border border-primary/30 focus:outline-none" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase text-slate-500">Cédula</label>
                    <input type="text" [(ngModel)]="m.cedula" class="w-full h-8 px-2 rounded border border-primary/30 focus:outline-none" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase text-slate-500">Email</label>
                    <input type="email" [(ngModel)]="m.email" class="w-full h-8 px-2 rounded border border-primary/30 focus:outline-none" />
                  </div>
                </div>
                <div class="col-span-1 flex items-end justify-center pb-1">
                  <button (click)="removeMiembro(idx)" class="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg flex items-center justify-center">
                    <lucide-icon name="trash-2" class="h-4 w-4"></lucide-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-200 bg-muted/45 flex justify-end gap-2">
          <button (click)="close()" class="h-10 px-4 border-2 border-slate-300 rounded-xl font-bold bg-white hover:bg-slate-100 transition-all">Cancelar</button>
          <button (click)="submit()" class="h-10 px-6 bg-primary text-white hover:bg-primary/95 border-2 border-primary rounded-xl font-bold transition-all">
            Crear Comité
          </button>
        </div>

      </div>
    </div>
  `
})
export class NuevoComiteDialogComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() create = new EventEmitter<any>();

  codigo = '';
  nombre = '';
  monto_max_aprob = 0;
  frecuencia = 'Semanal';
  miembros: Miembro[] = [];

  addMiembro() {
    this.miembros.push({ nombre: '', cargo: '', cedula: '', email: '' });
  }

  removeMiembro(idx: number) {
    this.miembros.splice(idx, 1);
  }

  close() {
    this.reset();
    this.open = false;
    this.openChange.emit(false);
  }

  reset() {
    this.codigo = '';
    this.nombre = '';
    this.monto_max_aprob = 0;
    this.frecuencia = 'Semanal';
    this.miembros = [];
  }

  submit() {
    this.create.emit({
      codigo: this.codigo,
      nombre: this.nombre,
      monto_max_aprob: this.monto_max_aprob,
      frecuencia: this.frecuencia,
      miembros: this.miembros
    });
    this.close();
  }
}
