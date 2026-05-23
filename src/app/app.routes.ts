import { Routes } from '@angular/router';
import { RecursoComponent } from './pages/recurso/recurso.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';

export const routes: Routes = [
  { path: 'pages/recurso', component: RecursoComponent },
  { path: 'pages/proveedor', component: ProveedorComponent }
];