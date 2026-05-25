import { Routes } from '@angular/router';
import { RecursoComponent } from './pages/recurso/recurso.component';
import { RecursoEditComponent } from './pages/recurso/recurso-edit/recurso-edit.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ProveedorEditComponent } from './pages/proveedor/proveedor-edit/proveedor-edit.component';
import { ProductoInicialComponent } from './pages/producto-inicial/producto-inicial.component';
import { ProductoInicialEditComponent } from './pages/producto-inicial/producto-inicial-edit/producto-inicial-edit.component';
import { RecursoAdministracionComponent } from './pages/recurso-administracion/recurso-administracion.component';
import { RecursoAdministracionEditComponent } from './pages/recurso-administracion/recurso-administracion-edit/recurso-administracion-edit.component';

export const routes: Routes = [
  { 
    path: 'pages/proveedor', 
    component: ProveedorComponent,
    children: [
      { path: 'new', component: ProveedorEditComponent },
      { path: 'edit/:id', component: ProveedorEditComponent },
    ],
  },
  { 
    path: 'pages/recurso', 
    component: RecursoComponent,
    children: [
      { path: 'new', component: RecursoEditComponent },
      { path: 'edit/:id', component: RecursoEditComponent },
    ],
  },
  {
    path: 'pages/producto-inicial',
    component: ProductoInicialComponent,
    children: [

      { path: 'new', component: ProductoInicialEditComponent },
      { path: 'edit/:id', component: ProductoInicialEditComponent }
    ]
  },
  {
    path: 'pages/recurso-administracion',
    component: RecursoAdministracionComponent,
    children: [
      { path: 'new', component: RecursoAdministracionEditComponent },
      { path: 'edit/:id', component: RecursoAdministracionEditComponent }
    ]
  }
];