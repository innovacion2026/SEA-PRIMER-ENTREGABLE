import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'app'
  },
  {
    path: 'app',
    loadComponent: () => import('./components/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'proveedores/directorio/editar/:idx',
        loadComponent: () => import('./pages/proveedor-edit/proveedor-edit.component').then(m => m.ProveedorEditComponent)
      },
      {
        path: 'proveedores/solicitudes/editar/:idx',
        loadComponent: () => import('./pages/proveedor-edit/proveedor-edit.component').then(m => m.ProveedorEditComponent)
      },
      {
        path: 'compras/requerimientos/editar/:id',
        loadComponent: () => import('./pages/compras-solicitud-edit/compras-solicitud-edit.component').then(m => m.ComprasSolicitudEditComponent)
      },
      {
        path: 'compras/ordenes/editar/:id',
        loadComponent: () => import('./pages/orden-compra-edit/orden-compra-edit.component').then(m => m.OrdenCompraEditComponent)
      },
      {
        path: 'compras/recepciones/editar/:id',
        loadComponent: () => import('./pages/recepcion-edit/recepcion-edit.component').then(m => m.RecepcionEditComponent)
      },
      {
        path: 'compras/presupuestos/detalle/:id',
        loadComponent: () => import('./pages/presupuesto-detalle/presupuesto-detalle.component').then(m => m.PresupuestoDetalleComponent)
      },
      {
        path: 'tesoreria/cxp/editar/:id',
        loadComponent: () => import('./pages/cxp-edit/cxp-edit.component').then(m => m.CxPEditComponent)
      },
      {
        path: 'tesoreria/pagos/editar/:id',
        loadComponent: () => import('./pages/pago-edit/pago-edit.component').then(m => m.PagoEditComponent)
      },
      {
        path: '**',
        loadComponent: () => import('./pages/module-page/module-page.component').then(m => m.ModulePageComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
