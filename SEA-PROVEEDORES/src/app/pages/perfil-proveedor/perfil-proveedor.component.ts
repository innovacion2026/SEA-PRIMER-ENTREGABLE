import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-perfil-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h1 class="text-2xl font-black text-white">Perfil del Proveedor & Cuentas Bancarias</h1>
        <p class="text-xs text-slate-400 mt-1">Información fiscal registrada en el expediente bancario y cuentas configuradas para pagos.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Info Fiscal Card -->
        <div class="p-6 bg-[#09090b] border border-zinc-800 rounded-2xl space-y-4 lg:col-span-2">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <lucide-icon name="building-2" class="h-4 w-4 text-blue-400"></lucide-icon> Datos Fiscales Registrados
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
              <span class="text-slate-400 block text-[10px] uppercase font-bold">Razón Social</span>
              <span class="text-white font-bold text-sm">Distribuidora Andina C.A.</span>
            </div>
            <div class="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
              <span class="text-slate-400 block text-[10px] uppercase font-bold">RIF</span>
              <span class="text-blue-400 font-bold font-mono text-sm">J-30123456-7</span>
            </div>
            <div class="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
              <span class="text-slate-400 block text-[10px] uppercase font-bold">Representante Legal</span>
              <span class="text-white font-bold">Carlos Mendoza</span>
            </div>
            <div class="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
              <span class="text-slate-400 block text-[10px] uppercase font-bold">Correo de Notificaciones</span>
              <span class="text-white font-bold">contacto@andina.com</span>
            </div>
            <div class="p-3 bg-zinc-900 rounded-xl border border-zinc-800 sm:col-span-2">
              <span class="text-slate-400 block text-[10px] uppercase font-bold">Dirección Fiscal</span>
              <span class="text-white font-medium">Av. Francisco de Miranda, Edificio Centro Empresarial, Piso 4, Caracas</span>
            </div>
          </div>
        </div>

        <!-- Estatus Homologacion Card -->
        <div class="p-6 bg-[#09090b] border border-zinc-800 rounded-2xl space-y-4">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <lucide-icon name="shield-check" class="h-4 w-4 text-emerald-400"></lucide-icon> Estatus de Homologación
          </h2>
          <div class="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs space-y-2">
            <div class="font-bold text-emerald-400 flex items-center gap-2">
              <lucide-icon name="check-circle" class="h-5 w-5"></lucide-icon> PROVEEDOR APROBADO Y ACTIVO
            </div>
            <p class="text-slate-300 text-[11px] leading-relaxed">
              Su expediente cumple con los requerimientos de la administración y auditoría bancaria.
            </p>
          </div>
        </div>

        <!-- Cuentas Bancarias Habilitadas -->
        <div class="p-6 bg-[#09090b] border border-zinc-800 rounded-2xl space-y-4 lg:col-span-3">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <lucide-icon name="banknote" class="h-4 w-4 text-emerald-400"></lucide-icon> Cuentas Bancarias Habilitadas para Liquidación de Pagos
          </h2>
          <div class="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div class="space-y-1">
              <div class="text-sm font-bold text-white">Banco Mercantil</div>
              <div class="text-xs text-slate-400">Tipo: Corriente Empresarial · Titular: Distribuidora Andina C.A.</div>
              <div class="text-sm font-mono text-blue-400 font-bold tracking-wider">0105-0012-45-1234567890</div>
            </div>
            <span class="px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
              CUENTA PRINCIPAL VERIFICADA
            </span>
          </div>
        </div>

      </div>
    </div>
  `
})
export class PerfilProveedorComponent {}
