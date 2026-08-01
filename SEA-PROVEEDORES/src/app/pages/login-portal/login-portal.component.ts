import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { PortalApiService } from '../../services/portal-api.service';

@Component({
  selector: 'app-login-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-[#09090b] border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80 animate-fade-in space-y-6">
        
        <div class="flex items-center gap-3 mb-2">
          <div class="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40 shrink-0">
            <lucide-icon name="shield-check" class="h-8 w-8 text-white"></lucide-icon>
          </div>
          <div>
            <div class="text-2xl font-black text-white">SEA</div>
            <div class="text-[10px] uppercase font-bold tracking-widest text-blue-400">Portal de Proveedores Bancario</div>
          </div>
        </div>

        <div class="space-y-1">
          <h1 class="text-2xl font-bold text-white">Acceso al Portal</h1>
          <p class="text-xs text-slate-400 leading-relaxed">
            Consulte sus Órdenes de Compra, Facturas, Pagos y Comprobantes de Retención IVA/ISLR.
          </p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-300">Correo / RIF *</label>
            <div class="relative">
              <lucide-icon name="user" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"></lucide-icon>
              <input type="text" [(ngModel)]="username" name="username" placeholder="contacto@andina.com" class="w-full h-12 pl-10 pr-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 focus:outline-none" />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-300">Contraseña *</label>
            <div class="relative">
              <lucide-icon name="lock" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"></lucide-icon>
              <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" class="w-full h-12 pl-10 pr-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 focus:outline-none" />
            </div>
          </div>

          <button type="submit" [disabled]="loading" class="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2">
            <lucide-icon name="log-out" class="h-5 w-5 rotate-180"></lucide-icon>
            {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-slate-400 text-center">
          Demostración: Ingrese cualquier usuario para explorar las consultas de proveedor.
        </div>

      </div>
    </div>
  `
})
export class LoginPortalComponent {
  username = 'contacto@andina.com';
  password = 'password123';
  loading = false;

  constructor(private portalApi: PortalApiService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.portalApi.login(this.username, this.password).subscribe(() => {
      this.loading = false;
      this.router.navigate(['/app/dashboard']);
    });
  }
}
