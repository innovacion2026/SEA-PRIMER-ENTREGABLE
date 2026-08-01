import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen w-full bg-[#020617] relative flex items-center justify-center p-4 overflow-hidden">
      <!-- Background blobs -->
      <div class="absolute top-0 -left-4 w-96 h-96 bg-primary/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
      <div class="absolute top-0 -right-4 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob [animation-delay:2000ms]"></div>
      <div class="absolute -bottom-12 left-20 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob [animation-delay:4000ms]"></div>

      <div class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px]"></div>

      <div class="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-3xl animate-in fade-in zoom-in duration-500 shadow-2xl shadow-black/50">
        <div class="flex items-center gap-4 mb-10">
          <div class="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.6)] rotate-3 transition-all hover:rotate-0 hover:scale-110 duration-500 overflow-hidden shrink-0">
            <lucide-icon name="shield-check" class="h-8 w-8"></lucide-icon>
          </div>
          <div>
            <div class="text-3xl font-extrabold tracking-tighter text-white">SEA</div>
            <div class="text-[10px] uppercase tracking-[0.2em] font-semibold text-blue-400/80">
              Sistema Estratégico de Administración
            </div>
          </div>
        </div>

        <div class="space-y-1 mb-8">
          <h1 class="text-3xl font-bold tracking-tight text-white">Bienvenido</h1>
          <p class="text-blue-100/60">
            Ingrese sus credenciales para acceder al sistema.
          </p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="space-y-2">
            <label htmlFor="user" class="text-sm font-semibold ml-1 text-blue-100/80">Usuario</label>
            <div class="relative group">
              <lucide-icon name="user" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-100/40 group-focus-within:text-primary transition-colors"></lucide-icon>
              <input
                id="user"
                name="username"
                type="text"
                [(ngModel)]="username"
                placeholder="nombre.usuario"
                class="w-full pl-10 pr-4 h-12 bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-all rounded-xl"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label htmlFor="pass" class="text-sm font-semibold ml-1 text-blue-100/80">Contraseña</label>
            <div class="relative group">
              <lucide-icon name="lock" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-100/40 group-focus-within:text-primary transition-colors"></lucide-icon>
              <input
                id="pass"
                name="password"
                type="password"
                [(ngModel)]="password"
                placeholder="••••••••"
                class="w-full pl-10 pr-4 h-12 bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-all rounded-xl"
              />
            </div>
          </div>

          <div *ngIf="error" class="text-sm text-red-400 font-medium bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-in slide-in-from-top-2 duration-300">
            {{ error }}
          </div>

          <button
            type="submit"
            class="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-base shadow-lg shadow-primary/30 transition-all active:scale-[0.98] group overflow-hidden relative"
          >
            <span class="relative z-10 flex items-center justify-center gap-2">
              Ingresar
              <lucide-icon name="plus" class="h-5 w-5 transition-transform group-hover:translate-x-1"></lucide-icon>
            </span>
          </button>

          <div class="relative py-2">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/5"></div>
            </div>
            <div class="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span class="bg-[#020617] px-3 text-blue-100/30 font-bold italic">
                Demo Access
              </span>
            </div>
          </div>

          <p class="text-xs text-blue-100/40 text-center font-medium leading-relaxed">
            Utilice cualquier usuario y contraseña para explorar la demostración del sistema.
          </p>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  username = 'admin';
  password = 'admin';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.user) {
      this.router.navigate(['/app']);
    }
  }

  onSubmit() {
    if (this.authService.login(this.username.trim(), this.password)) {
      this.router.navigate(['/app']);
    } else {
      this.error = 'Credenciales inválidas';
    }
  }
}
