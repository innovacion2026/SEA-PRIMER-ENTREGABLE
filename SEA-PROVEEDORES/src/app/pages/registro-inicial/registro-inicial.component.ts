import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { PortalApiService } from '../../services/portal-api.service';

@Component({
  selector: 'app-registro-inicial',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      
      <!-- Top Brand Header -->
      <div class="w-full max-w-4xl flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="h-11 w-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <lucide-icon name="shield-check" class="h-6 w-6 text-white"></lucide-icon>
          </div>
          <div>
            <div class="text-xl font-black tracking-tight text-white">SEA PROVEEDORES</div>
            <div class="text-[10px] uppercase font-bold tracking-widest text-blue-400">Portal de Contratación Bancaria</div>
          </div>
        </div>
        <div class="text-xs text-slate-400 font-medium hidden sm:block">
          Token de Seguridad: <span class="font-mono text-blue-400 font-bold">{{ token }}</span>
        </div>
      </div>

      <!-- Main Card -->
      <div class="w-full max-w-4xl bg-[#09090b] border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/80 animate-fade-in">
        
        <!-- Welcome Banner -->
        <div class="mb-8 p-4 rounded-2xl bg-blue-950/40 border border-blue-800/50 flex items-start gap-4">
          <div class="h-10 w-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
            <lucide-icon name="building-2" class="h-5 w-5"></lucide-icon>
          </div>
          <div>
            <h2 class="text-lg font-bold text-white">Expediente de Registro de Proveedor</h2>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">
              Complete los datos fiscales, su cuenta bancaria de 20 dígitos para recepción de pagos, adjunte los documentos requeridos e incluya sus observaciones para la evaluación por la administración del Banco.
            </p>
          </div>
        </div>

        <!-- Progress Steps -->
        <div class="grid grid-cols-4 gap-2 mb-8 border-b border-zinc-800 pb-6 text-center">
          <div [class]="'p-3 rounded-xl border transition-all ' + (step === 1 ? 'bg-blue-600 text-white border-blue-500 font-bold' : 'bg-zinc-900 border-zinc-800 text-slate-400')">
            <div class="text-[10px] uppercase tracking-widest opacity-80">Paso 1</div>
            <div class="text-xs sm:text-sm font-semibold truncate mt-0.5">1. Empresa</div>
          </div>
          <div [class]="'p-3 rounded-xl border transition-all ' + (step === 2 ? 'bg-blue-600 text-white border-blue-500 font-bold' : 'bg-zinc-900 border-zinc-800 text-slate-400')">
            <div class="text-[10px] uppercase tracking-widest opacity-80">Paso 2</div>
            <div class="text-xs sm:text-sm font-semibold truncate mt-0.5">2. Banco</div>
          </div>
          <div [class]="'p-3 rounded-xl border transition-all ' + (step === 3 ? 'bg-blue-600 text-white border-blue-500 font-bold' : 'bg-zinc-900 border-zinc-800 text-slate-400')">
            <div class="text-[10px] uppercase tracking-widest opacity-80">Paso 3</div>
            <div class="text-xs sm:text-sm font-semibold truncate mt-0.5">3. Recaudos</div>
          </div>
          <div [class]="'p-3 rounded-xl border transition-all ' + (step === 4 ? 'bg-blue-600 text-white border-blue-500 font-bold' : 'bg-zinc-900 border-zinc-800 text-slate-400')">
            <div class="text-[10px] uppercase tracking-widest opacity-80">Paso 4</div>
            <div class="text-xs sm:text-sm font-semibold truncate mt-0.5">4. Enviar</div>
          </div>
        </div>

        <!-- Success Message Screen -->
        <div *ngIf="enviado" class="py-12 text-center space-y-4 animate-fade-in">
          <div class="h-16 w-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
            <lucide-icon name="check-circle" class="h-8 w-8"></lucide-icon>
          </div>
          <h3 class="text-2xl font-black text-white">¡Expediente Enviado con Éxito!</h3>
          <p class="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Su información, datos bancarios y recaudos adjuntos han sido enviados a la Administración Bancaria para su revisión.
          </p>
          <p class="text-xs text-blue-400 font-semibold pt-2">
            Una vez verificado su expediente, recibirá un correo electrónico con su enlace de bienvenida para establecer su contraseña e ingresar al sistema.
          </p>
        </div>

        <!-- Form Step 1: Datos de la Empresa -->
        <div *ngIf="!enviado && step === 1" class="space-y-6 animate-fade-in">
          <h3 class="text-sm font-bold uppercase tracking-wider text-blue-400">Paso 1: Datos Fiscales de la Empresa</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5 md:col-span-2">
              <label class="text-xs font-bold text-slate-300">Razón Social *</label>
              <input type="text" [(ngModel)]="razonSocial" class="w-full h-11 px-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 focus:outline-none" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-300">RIF *</label>
              <input type="text" [(ngModel)]="rif" class="w-full h-11 px-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 focus:outline-none" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-300">Persona de Contacto *</label>
              <input type="text" [(ngModel)]="contacto" class="w-full h-11 px-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 focus:outline-none" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-300">Correo Electrónico *</label>
              <input type="email" [(ngModel)]="email" class="w-full h-11 px-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 focus:outline-none" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-300">Teléfono *</label>
              <input type="text" [(ngModel)]="telefono" class="w-full h-11 px-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 focus:outline-none" />
            </div>
            <div class="space-y-1.5 md:col-span-2">
              <label class="text-xs font-bold text-slate-300">Dirección Fiscal *</label>
              <input type="text" [(ngModel)]="direccion" placeholder="Av. Principal, Edificio Central..." class="w-full h-11 px-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <div class="flex justify-end pt-4 border-t border-zinc-800">
            <button (click)="step = 2" [disabled]="!step1Valid()" class="h-11 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-2 transition-all">
              Siguiente: Datos Bancarios <lucide-icon name="chevron-right" class="h-4 w-4"></lucide-icon>
            </button>
          </div>
        </div>

        <!-- Form Step 2: Datos Bancarios -->
        <div *ngIf="!enviado && step === 2" class="space-y-6 animate-fade-in">
          <h3 class="text-sm font-bold uppercase tracking-wider text-blue-400">Paso 2: Datos Bancarios para Recepción de Pagos</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-300">Banco Receptor *</label>
              <select [(ngModel)]="banco" class="w-full h-11 px-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 focus:outline-none">
                <option value="Banco Mercantil">Banco Mercantil</option>
                <option value="Banco Banesco">Banco Banesco</option>
                <option value="Banco de Venezuela">Banco de Venezuela</option>
                <option value="Banco Provincial">Banco Provincial</option>
                <option value="Banco Nacional de Crédito">Banco Nacional de Crédito</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-300">Tipo de Cuenta *</label>
              <select [(ngModel)]="tipoCuenta" class="w-full h-11 px-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 focus:outline-none">
                <option value="Corriente Empresarial">Corriente Empresarial</option>
                <option value="Ahorros">Ahorros</option>
              </select>
            </div>
            <div class="space-y-1.5 md:col-span-2">
              <label class="text-xs font-bold text-slate-300">Número de Cuenta Bancaria (20 dígitos IBAN/Cuenta) *</label>
              <input type="text" [(ngModel)]="numeroCuenta" maxlength="20" placeholder="01050012451234567890" class="w-full h-11 px-4 bg-zinc-900 border border-zinc-700 rounded-xl font-mono text-blue-400 font-bold tracking-wider focus:border-blue-500 focus:outline-none" />
            </div>
            <div class="space-y-1.5 md:col-span-2">
              <label class="text-xs font-bold text-slate-300">Titular de la Cuenta *</label>
              <input type="text" [(ngModel)]="titularCuenta" class="w-full h-11 px-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <div class="flex justify-between pt-4 border-t border-zinc-800">
            <button (click)="step = 1" class="h-11 px-6 border border-zinc-700 text-slate-300 hover:bg-zinc-800 font-bold rounded-xl">Anterior</button>
            <button (click)="step = 3" [disabled]="!step2Valid()" class="h-11 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-2">
              Siguiente: Carga de Recaudos <lucide-icon name="chevron-right" class="h-4 w-4"></lucide-icon>
            </button>
          </div>
        </div>

        <!-- Form Step 3: Carga de Recaudos -->
        <div *ngIf="!enviado && step === 3" class="space-y-6 animate-fade-in">
          <h3 class="text-sm font-bold uppercase tracking-wider text-blue-400">Paso 3: Carga de Recaudos Obligatorios</h3>
          
          <ul class="divide-y divide-zinc-800 border border-zinc-800 rounded-2xl bg-zinc-900/50">
            <li *ngFor="let doc of docTypes" class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div class="font-bold text-sm text-white flex items-center gap-2">
                  <lucide-icon name="file-text" class="h-4 w-4 text-blue-400"></lucide-icon>
                  {{ doc.nombre }}
                </div>
                <div class="text-xs text-slate-400 mt-0.5">{{ doc.descripcion }}</div>
              </div>
              <div class="flex items-center gap-3">
                <span *ngIf="uploadedDocs[doc.key]" class="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <lucide-icon name="check" class="h-4 w-4"></lucide-icon> {{ uploadedDocs[doc.key] }}
                </span>
                <label class="h-9 px-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded-xl text-xs font-bold text-white cursor-pointer flex items-center gap-1.5 transition-colors">
                  <lucide-icon name="plus" class="h-3.5 w-3.5"></lucide-icon> Subir PDF
                  <input type="file" accept="application/pdf" class="hidden" (change)="onFileSelect($event, doc.key)" />
                </label>
              </div>
            </li>
          </ul>

          <div class="flex justify-between pt-4 border-t border-zinc-800">
            <button (click)="step = 2" class="h-11 px-6 border border-zinc-700 text-slate-300 hover:bg-zinc-800 font-bold rounded-xl">Anterior</button>
            <button (click)="step = 4" class="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-2">
              Siguiente: Observaciones <lucide-icon name="chevron-right" class="h-4 w-4"></lucide-icon>
            </button>
          </div>
        </div>

        <!-- Form Step 4: Observaciones y Envío -->
        <div *ngIf="!enviado && step === 4" class="space-y-6 animate-fade-in">
          <h3 class="text-sm font-bold uppercase tracking-wider text-blue-400">Paso 4: Observaciones Adicionales y Envío</h3>
          
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-300">Incluir Observaciones para la Evaluación Bancaria</label>
            <textarea [(ngModel)]="observaciones" rows="4" placeholder="Escriba aquí cualquier aclaratoria referente a los recaudos adjuntos..." class="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white focus:border-blue-500 focus:outline-none"></textarea>
          </div>

          <div class="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-slate-400 space-y-1">
            <div class="font-bold text-slate-200">Resumen del Expediente:</div>
            <div>• Razón Social: <span class="text-white font-semibold">{{ razonSocial }}</span> ({{ rif }})</div>
            <div>• Cuenta Bancaria: <span class="text-white font-mono">{{ numeroCuenta }}</span></div>
            <div>• Recaudos adjuntos: <span class="text-emerald-400 font-semibold">{{ getDocsCount() }} documentos</span></div>
          </div>

          <div class="flex justify-between pt-4 border-t border-zinc-800">
            <button (click)="step = 3" class="h-11 px-6 border border-zinc-700 text-slate-300 hover:bg-zinc-800 font-bold rounded-xl">Anterior</button>
            <button (click)="enviarExpediente()" [disabled]="loading" class="h-11 px-8 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all">
              <lucide-icon name="check-circle" class="h-5 w-5"></lucide-icon>
              {{ loading ? 'Enviando...' : 'Enviar Respuesta a Administración' }}
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class RegistroInicialComponent implements OnInit {
  token = 'REG-2026-X891';
  step = 1;
  loading = false;
  enviado = false;

  razonSocial = 'Distribuidora Andina C.A.';
  rif = 'J-30123456-7';
  contacto = 'Carlos Mendoza';
  email = 'contacto@andina.com';
  telefono = '+58 414 1234567';
  direccion = 'Av. Francisco de Miranda, Edificio Centro Empresarial, Piso 4, Caracas';

  banco = 'Banco Mercantil';
  tipoCuenta = 'Corriente Empresarial';
  numeroCuenta = '01050012451234567890';
  titularCuenta = 'Distribuidora Andina C.A.';

  observaciones = 'Adjuntamos RIF vigente 2026, la Solvencia Laboral y el Certificado Bancario emitido por Banco Mercantil.';

  docTypes = [
    { key: 'rif', nombre: 'RIF Digital Vigente', descripcion: 'Comprobante de Registro de Información Fiscal' },
    { key: 'registro', nombre: 'Registro Mercantil', descripcion: 'Documento Constitutivo y Modificaciones Estatutarias' },
    { key: 'ci', nombre: 'Cédula Representante Legal', descripcion: 'Cédula de Identidad legible' },
    { key: 'solvencia', nombre: 'Solvencia Laboral', descripcion: 'Certificado de Solvencia Laboral expedido por el MPPPST' },
    { key: 'banco', nombre: 'Certificación Bancaria', descripcion: 'Constancia oficial de cuenta bancaria emitida por el banco' }
  ];

  uploadedDocs: Record<string, string> = {
    rif: 'RIF_ANDINA_2026.pdf',
    registro: 'REGISTRO_MERCANTIL.pdf',
    ci: 'CI_REPRESENTANTE.pdf',
    solvencia: 'SOLVENCIA_LABORAL.pdf',
    banco: 'CERTIFICADO_MERCANTIL.pdf'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private portalApi: PortalApiService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
        this.portalApi.validarTokenRegistro(this.token).subscribe(res => {
          if (res?.data) {
            this.razonSocial = res.data.proveedor || this.razonSocial;
            this.rif = res.data.rif || this.rif;
            this.email = res.data.email || this.email;
            this.contacto = res.data.contacto || this.contacto;
          }
        });
      }
    });
  }

  step1Valid(): boolean {
    return this.razonSocial.trim().length > 2 && this.rif.trim().length > 4 && this.contacto.trim().length > 2;
  }

  step2Valid(): boolean {
    return this.numeroCuenta.trim().length === 20 && this.titularCuenta.trim().length > 2;
  }

  getDocsCount(): number {
    return Object.keys(this.uploadedDocs).length;
  }

  onFileSelect(event: any, key: string) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.uploadedDocs[key] = files[0].name;
    }
  }

  enviarExpediente() {
    this.loading = true;
    const exp = {
      token: this.token,
      razonSocial: this.razonSocial,
      rif: this.rif,
      contacto: this.contacto,
      email: this.email,
      telefono: this.telefono,
      direccion: this.direccion,
      banco: this.banco,
      tipoCuenta: this.tipoCuenta,
      numeroCuenta: this.numeroCuenta,
      titularCuenta: this.titularCuenta,
      documentos: this.uploadedDocs,
      observaciones: this.observaciones
    };

    this.portalApi.enviarExpediente(exp).subscribe({
      next: () => {
        this.loading = false;
        this.enviado = true;
      },
      error: () => {
        this.loading = false;
        this.enviado = true;
      }
    });
  }
}
