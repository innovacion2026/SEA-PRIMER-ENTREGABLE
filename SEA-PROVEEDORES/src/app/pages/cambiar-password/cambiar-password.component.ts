import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { PortalApiService } from '../../services/portal-api.service';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-[#09090b] border border-zinc-800 rounded-3xl p-8 shadow-2xl shadow-black/80 animate-fade-in space-y-6">
        
        <!-- Header -->
        <div class="flex items-center gap-3">
          <div class="h-12 w-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <lucide-icon name="check-circle" class="h-6 w-6"></lucide-icon>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">¡Expediente Aprobado!</h2>
            <p class="text-xs text-emerald-400 font-semibold">SEA Banco - Portal de Proveedores</p>
          </div>
        </div>

        <p class="text-xs text-slate-300 leading-relaxed">
          La administración bancaria ha verificado satisfactoriamente sus recaudos y datos de contratación. Establezca su contraseña permanente para acceder al sistema.
        </p>

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-300">Nueva Contraseña *</label>
            <div class="relative">
              <lucide-icon name="lock" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"></lucide-icon>
              <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" class="w-full h-11 pl-10 pr-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 focus:outline-none" />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-300">Confirmar Contraseña *</label>
            <div class="relative">
              <lucide-icon name="lock" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"></lucide-icon>
              <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" placeholder="••••••••" class="w-full h-11 pl-10 pr-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 focus:outline-none" />
            </div>
          </div>

          <div *ngIf="error" class="text-xs text-red-400 font-semibold p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            {{ error }}
          </div>

          <button type="submit" [disabled]="loading || !valid()" class="w-full h-12 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2">
            <lucide-icon name="shield-check" class="h-5 w-5"></lucide-icon>
            {{ loading ? 'Estableciendo...' : 'Activar Cuenta e Ingresar' }}
          </button>
        </form>

      </div>
    </div>
  `
})
export class CambiarPasswordComponent implements OnInit {
  token = '';
  password = '';
  confirmPassword = '';
  error = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private portalApi: PortalApiService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  valid(): boolean {
    return this.password.length >= 6 && this.password === this.confirmPassword;
  }

  onSubmit() {
    if (!this.valid()) {
      this.error = 'Las contraseñas deben coincidir y tener al menos 6 caracteres';
      return;
    }

    this.loading = true;
    this.portalApi.activarCuenta(this.token, this.password).subscribe(() => {
      this.loading = false;
      this.router.navigate(['/app/dashboard']);
    });
  }
}
