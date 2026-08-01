import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

interface NewRow {
  codigo: string;
  proveedor: string;
  rif: string;
  contacto: string;
  telefono: string;
  email: string;
  fecha: string;
  tipo: string;
  etapa: string;
  estatus: string;
}

@Component({
  selector: 'app-nueva-solicitud-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="w-full max-w-3xl bg-white border-2 border-foreground rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="p-5 border-b-2 border-foreground bg-muted/45 flex items-center justify-between">
          <div>
            <h3 class="text-xl font-black text-primary">Nueva Solicitud de Ingreso</h3>
            <p class="text-xs text-muted-foreground mt-0.5">Registra un proveedor y carga su documentación legal.</p>
          </div>
          <button (click)="close()" class="h-8 w-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-muted-foreground">
            <lucide-icon name="x" class="h-5 w-5"></lucide-icon>
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex border-b-2 border-foreground bg-background">
          <button
            (click)="setTab('datos')"
            [class]="'flex-1 border-r-2 border-foreground py-3 text-xs md:text-sm font-extrabold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5 ' + (tab === 'datos' ? 'bg-primary text-white' : 'hover:bg-muted')"
          >
            1. Datos
            <lucide-icon name="check" class="h-3.5 w-3.5" *ngIf="datosOk()"></lucide-icon>
          </button>
          <button
            (click)="setTab('docs')"
            [class]="'flex-1 border-r-2 border-foreground py-3 text-xs md:text-sm font-extrabold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5 ' + (tab === 'docs' ? 'bg-primary text-white' : 'hover:bg-muted')"
          >
            2. Documentos
            <span class="text-xs opacity-80">({{ getDocsCount() }}/{{ docs.length }})</span>
          </button>
          <button
            (click)="setTab('cumpl')"
            [class]="'flex-1 py-3 text-xs md:text-sm font-extrabold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5 ' + (tab === 'cumpl' ? 'bg-primary text-white' : 'hover:bg-muted')"
          >
            3. Cumplimiento
            <lucide-icon name="check" class="h-3.5 w-3.5" *ngIf="cumplOk()"></lucide-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto flex-1">
          
          <!-- Datos Tab -->
          <div *ngIf="tab === 'datos'" class="space-y-4 animate-in fade-in duration-200">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2 space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Razón Social *</label>
                <input type="text" [(ngModel)]="razon" placeholder="Ej. Innovatech C.A." class="w-full h-11 px-3 rounded-lg border-2 border-primary/40 focus:outline-none focus:border-primary" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">RIF *</label>
                <input type="text" [(ngModel)]="rif" placeholder="J-XXXXXXXX-X" class="w-full h-11 px-3 rounded-lg border-2 border-primary/40 focus:outline-none focus:border-primary" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Persona de Contacto *</label>
                <input type="text" [(ngModel)]="contacto" placeholder="Nombre y apellido" class="w-full h-11 px-3 rounded-lg border-2 border-primary/40 focus:outline-none focus:border-primary" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Teléfono</label>
                <input type="text" [(ngModel)]="telefono" placeholder="+58 ..." class="w-full h-11 px-3 rounded-lg border-2 border-primary/40 focus:outline-none focus:border-primary" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs uppercase tracking-wider font-bold">Correo</label>
                <input type="email" [(ngModel)]="email" placeholder="contacto@empresa.com" class="w-full h-11 px-3 rounded-lg border-2 border-primary/40 focus:outline-none focus:border-primary" />
              </div>
            </div>
          </div>

          <!-- Docs Tab -->
          <div *ngIf="tab === 'docs'" class="space-y-4 animate-in fade-in duration-200">
            <div
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave()"
              (drop)="onDrop($event)"
              (click)="triggerFileInput()"
              [class]="'border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ' + (dragOver ? 'border-primary bg-primary/5' : 'border-slate-300 bg-muted/20') + ' ' + (!activeDoc ? 'opacity-60 cursor-not-allowed' : '')"
            >
              <lucide-icon name="plus" class="h-10 w-10 mx-auto text-primary"></lucide-icon>
              <p class="mt-2 text-sm font-semibold">
                {{ activeDoc ? 'Arrastra el PDF para: ' + activeDoc : 'Selecciona primero un documento de la lista' }}
              </p>
              <p class="text-xs text-muted-foreground mt-1">o haz clic para buscar el archivo (PDF)</p>
              <input #fileInput type="file" accept="application/pdf" class="hidden" (change)="handleFileChange($event)" />
            </div>

            <ul class="border-2 border-foreground rounded-lg divide-y divide-slate-200 max-h-60 overflow-y-auto">
              <li
                *ngFor="let d of docs"
                (click)="setActiveDoc(d)"
                [class]="'flex items-center gap-3 px-3 py-2.5 text-sm cursor-pointer transition-colors ' + (activeDoc === d ? 'bg-primary/10' : 'hover:bg-muted/50')"
              >
                <lucide-icon name="file-text" [class]="'h-4 w-4 shrink-0 ' + (files[d] ? 'text-emerald-600' : 'text-muted-foreground')"></lucide-icon>
                <span class="flex-1 truncate">{{ d }}</span>
                <span *ngIf="files[d]" class="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <lucide-icon name="check" class="h-3.5 w-3.5"></lucide-icon>
                  {{ files[d].name }}
                  <button (click)="removeFile(d, $event)" class="ml-1 text-destructive hover:bg-destructive/10 rounded p-0.5">
                    <lucide-icon name="x" class="h-3 w-3"></lucide-icon>
                  </button>
                </span>
                <span *ngIf="!files[d]" class="text-xs text-muted-foreground">Pendiente</span>
              </li>
            </ul>
          </div>

          <!-- Cumplimiento Tab -->
          <div *ngIf="tab === 'cumpl'" class="space-y-4 animate-in fade-in duration-200">
            <div class="border-2 border-foreground rounded-xl p-4 flex items-start gap-4 bg-muted/10">
              <lucide-icon name="shield-check" class="h-6 w-6 text-primary mt-0.5"></lucide-icon>
              <div class="flex-1">
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="font-bold text-sm">Código de Ética del Proveedor</p>
                    <p class="text-xs text-muted-foreground">Acepto cumplir las normas de conducta y anticorrupción definidas por SEA.</p>
                  </div>
                  <input type="checkbox" [(ngModel)]="aceptaEtica" class="h-5 w-5 accent-primary cursor-pointer" />
                </div>
              </div>
            </div>
            <div class="border-2 border-foreground rounded-xl p-4 flex items-start gap-4 bg-muted/10">
              <lucide-icon name="shield-check" class="h-6 w-6 text-primary mt-0.5"></lucide-icon>
              <div class="flex-1">
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="font-bold text-sm">Política de Privacidad y Tratamiento de Datos</p>
                    <p class="text-xs text-muted-foreground">Autorizo el tratamiento de la información para fines de evaluación y registro.</p>
                  </div>
                  <input type="checkbox" [(ngModel)]="aceptaPrivacidad" class="h-5 w-5 accent-primary cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-4 border-t-2 border-foreground bg-muted/45 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="text-xs text-muted-foreground font-bold">
            Datos {{ datosOk() ? '✓' : '—' }} · Documentos {{ getDocsCount() }}/{{ docs.length }} · Cumplimiento {{ cumplOk() ? '✓' : '—' }}
          </div>
          <div class="flex gap-2">
            <button (click)="close()" class="h-10 px-4 border-2 border-foreground rounded-xl font-bold bg-white hover:bg-slate-100 transition-all">Cancelar</button>
            <button (click)="submit()" [disabled]="!canSubmit()" class="h-10 px-4 bg-primary text-white hover:bg-primary/95 border-2 border-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold transition-all">
              Crear Solicitud
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class NuevaSolicitudDialogComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() create = new EventEmitter<NewRow>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  tab = 'datos';
  razon = '';
  rif = '';
  contacto = '';
  telefono = '';
  email = '';
  aceptaEtica = false;
  aceptaPrivacidad = false;
  dragOver = false;

  activeDoc: string | null = null;
  files: Record<string, { name: string }> = {};

  docs = [
    "Documento Constitutivo y Modificaciones Estatutarias",
    "Publicación de Gaceta Mercantil",
    "Productos y Servicios que Presta la Empresa",
    "Designación de Junta Directiva",
    "Patente de Industria y Comercio",
    "Balance General",
    "RIF",
    "Declaración de I.S.L.R.",
    "Cédula del Representante Legal",
    "Referencia Bancaria",
    "Referencia Comercial",
    "Licencia de Actividades Económicas",
    "Estado de Resultados del Último Ejercicio Económico",
    "Carta de Inicio de Actividad Comercial",
  ];

  setTab(t: string) {
    this.tab = t;
  }

  setActiveDoc(doc: string) {
    this.activeDoc = doc;
  }

  datosOk(): boolean {
    return this.razon.trim().length > 1 && this.rif.trim().length > 4 && this.contacto.trim().length > 1;
  }

  cumplOk(): boolean {
    return this.aceptaEtica && this.aceptaPrivacidad;
  }

  getDocsCount(): number {
    return Object.keys(this.files).length;
  }

  canSubmit(): boolean {
    return this.datosOk() && this.cumplOk();
  }

  close() {
    this.reset();
    this.open = false;
    this.openChange.emit(false);
  }

  reset() {
    this.tab = 'datos';
    this.razon = '';
    this.rif = '';
    this.contacto = '';
    this.telefono = '';
    this.email = '';
    this.files = {};
    this.activeDoc = null;
    this.aceptaEtica = false;
    this.aceptaPrivacidad = false;
  }

  triggerFileInput() {
    if (this.activeDoc) {
      this.fileInput.nativeElement.click();
    }
  }

  handleFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0 && this.activeDoc) {
      this.files[this.activeDoc] = { name: fileList[0].name };
    }
  }

  onDragOver(event: any) {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave() {
    this.dragOver = false;
  }

  onDrop(event: any) {
    event.preventDefault();
    this.dragOver = false;
    const fileList: FileList = event.dataTransfer.files;
    if (fileList && fileList.length > 0 && this.activeDoc) {
      this.files[this.activeDoc] = { name: fileList[0].name };
    }
  }

  removeFile(doc: string, event: Event) {
    event.stopPropagation();
    delete this.files[doc];
  }

  submit() {
    if (!this.canSubmit()) return;

    const today = new Date().toISOString().slice(0, 10);
    const code = `SOL-2026-${String(Math.floor(1000 + Math.random() * 8999))}`;

    this.create.emit({
      codigo: code,
      proveedor: this.razon,
      rif: this.rif,
      contacto: this.contacto,
      telefono: this.telefono,
      email: this.email,
      fecha: today,
      tipo: "Nuevo registro",
      etapa: this.getDocsCount() >= this.docs.length ? "Documentación" : "Registro",
      estatus: "Pendiente"
    });

    this.close();
  }
}
