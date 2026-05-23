import { Routes } from '@angular/router';
import { RecursoComponent } from './pages/recurso/recurso.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ProveedorEditComponent } from './pages/proveedor/proveedor-edit/proveedor-edit.component';

export const routes: Routes = [
 { 
        path: 'pages/proveedor', component: ProveedorComponent,
        children: [
            { path: 'new', component: ProveedorEditComponent },
            { path: 'edit/:id', component: ProveedorEditComponent },
        ],
    },
];