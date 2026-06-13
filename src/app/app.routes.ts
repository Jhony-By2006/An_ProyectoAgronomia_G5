import { Routes } from '@angular/router';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ProveedorEditComponent } from './pages/proveedor/proveedor-edit/proveedor-edit.component';
import { RecursoComponent } from './pages/recurso/recurso.component';
import { RecursoEditComponent } from './pages/recurso/recurso-edit/recurso-edit.component';
import { ProductoFinalComponent } from './pages/producto-final/producto-final.component';
import { ProductoFinalEditComponent } from './pages/producto-final/producto-final-edit/producto-final-edit.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { PagoComponent } from './pages/pago/pago.component';
import { PagoEditComponent } from './pages/pago/pago-edit/pago-edit.component';
import { MetodoPagoComponent } from './pages/metodopago/metodopago.component';
import { ProductoInicialComponent } from './pages/producto-inicial/producto-inicial.component';
import { ProductoInicialEditComponent } from './pages/producto-inicial/producto-inicial-edit/producto-inicial-edit.component';
import { RecursoAdministracionComponent } from './pages/recurso-administracion/recurso-administracion.component';
import { RecursoAdministracionEditComponent } from './pages/recurso-administracion/recurso-administracion-edit/recurso-administracion-edit.component';
import { TrabajadorComponent } from './pages/trabajador/trabajador.component';
import { TrabajadorEditComponent } from './pages/trabajador/trabajador-edit/trabajador-edit.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { AdministracionComponent } from './pages/administracion/administracion.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'pages',
    component: LayoutComponent,
    children: [
      // ── RUTAS DE PROVEEDOR ──
      {
        path: 'proveedor',
        component: ProveedorComponent,
        children: [
          { path: 'new', component: ProveedorEditComponent },
          { path: 'edit/:id', component: ProveedorEditComponent },
        ],
      },

      // ── RUTAS DE RECURSO ──
      {
        path: 'recurso',
        component: RecursoComponent,
        children: [
          { path: 'new', component: RecursoEditComponent },
          { path: 'edit/:id', component: RecursoEditComponent },
        ],
      },

      // ── RUTAS DE TRABAJADOR ──
      {
        path: 'trabajador',
        component: TrabajadorComponent,
        children: [
          { path: 'new', component: TrabajadorEditComponent },
          { path: 'edit/:id', component: TrabajadorEditComponent },
        ],
      },

      // ── RUTA DE REPORTE ──
      { path: 'reporte', component: ReporteComponent },

      // ── RUTAS DE PRODUCTO FINAL ──
      {
        path: 'producto-final',
        component: ProductoFinalComponent,
        children: [
          { path: 'new', component: ProductoFinalEditComponent },
          { path: 'edit/:id', component: ProductoFinalEditComponent },
        ],
      },

      // ── RUTA DE INVENTARIO ──
      {
        path: 'inventario',
        component: InventarioComponent,
      },

      // ── RUTA DE MÉTODO DE PAGO ──
      {
        path: 'metodo-pago',
        component: MetodoPagoComponent,
      },

      // ── RUTAS DE PAGO ──
      {
        path: 'pago',
        component: PagoComponent,
        children: [
          { path: 'new', component: PagoEditComponent },
          { path: 'edit/:id', component: PagoEditComponent },
        ],
      },

      // ── RUTAS DE PRODUCTO INICIAL ──
      {
        path: 'producto-inicial',
        component: ProductoInicialComponent,
        children: [
          { path: 'new', component: ProductoInicialEditComponent },
          { path: 'edit/:id', component: ProductoInicialEditComponent },
        ],
      },

      // ── RUTAS DE RECURSO ADMINISTRACIÓN ──
      {
        path: 'recurso-administracion',
        component: RecursoAdministracionComponent,
        children: [
          { path: 'new', component: RecursoAdministracionEditComponent },
          { path: 'edit/:id', component: RecursoAdministracionEditComponent },
        ],
      },

      // ── RUTA DE ADMINISTRACIÓN ──
      {
        path: 'administracion',
        component: AdministracionComponent,
      },
    ],
  },
];