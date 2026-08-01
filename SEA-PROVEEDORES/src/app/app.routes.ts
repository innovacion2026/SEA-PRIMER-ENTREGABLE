import { Routes } from '@angular/router';
import { LoginPortalComponent } from './pages/login-portal/login-portal.component';
import { RegistroInicialComponent } from './pages/registro-inicial/registro-inicial.component';
import { CambiarPasswordComponent } from './pages/cambiar-password/cambiar-password.component';
import { PortalLayoutComponent } from './components/portal-layout/portal-layout.component';
import { DashboardProveedorComponent } from './pages/dashboard-proveedor/dashboard-proveedor.component';
import { PerfilProveedorComponent } from './pages/perfil-proveedor/perfil-proveedor.component';
import { OrdenesProveedorComponent } from './pages/ordenes-proveedor/ordenes-proveedor.component';
import { FacturasProveedorComponent } from './pages/facturas-proveedor/facturas-proveedor.component';
import { PagosProveedorComponent } from './pages/pagos-proveedor/pagos-proveedor.component';
import { RetencionesProveedorComponent } from './pages/retenciones-proveedor/retenciones-proveedor.component';
import { ContratosProveedorComponent } from './pages/contratos-proveedor/contratos-proveedor.component';
import { DocumentosProveedorComponent } from './pages/documentos-proveedor/documentos-proveedor.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPortalComponent },
  { path: 'registro-inicial', component: RegistroInicialComponent },
  { path: 'cambiar-password', component: CambiarPasswordComponent },
  {
    path: 'app',
    component: PortalLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardProveedorComponent },
      { path: 'perfil', component: PerfilProveedorComponent },
      { path: 'documentos', component: DocumentosProveedorComponent },
      { path: 'ordenes', component: OrdenesProveedorComponent },
      { path: 'contratos', component: ContratosProveedorComponent },
      { path: 'facturas', component: FacturasProveedorComponent },
      { path: 'pagos', component: PagosProveedorComponent },
      { path: 'retenciones', component: RetencionesProveedorComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
