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

export const routes: Routes = [
  // ── RUTAS DE PROVEEDOR ──
  {
    path: 'pages/proveedor',
    component: ProveedorComponent,
    children: [
      { path: 'new', component: ProveedorEditComponent },
      { path: 'edit/:id', component: ProveedorEditComponent },
    ],
  },

  // ── RUTAS DE RECURSO ──
  {
    path: 'pages/recurso',
    component: RecursoComponent,
    children: [
      { path: 'new', component: RecursoEditComponent },
      { path: 'edit/:id', component: RecursoEditComponent },
    ],
  },

  // ── RUTAS DE PRODUCTO FINAL ──
  {
    path: 'pages/producto-final',
    component: ProductoFinalComponent,
    children: [
      { path: 'new', component: ProductoFinalEditComponent },
      { path: 'edit/:id', component: ProductoFinalEditComponent },
    ],
  },

  // ── RUTA DE INVENTARIO ──
  {
    path: 'pages/inventario',
    component: InventarioComponent,
  },

  // ── RUTA DE MÉTODO DE PAGO  ──
  {
    path: 'pages/metodo-pago',
    component: MetodoPagoComponent,
  },

  // ── RUTAS DE PAGO ──
  {
    path: 'pages/pago',
    component: PagoComponent,
    children: [
      { path: 'new', component: PagoEditComponent },
      { path: 'edit/:id', component: PagoEditComponent },
    ],
  },
];