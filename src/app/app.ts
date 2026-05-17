import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { RecursoComponent } from './pages/recurso/recurso.component';
import { RecursoAdministracion } from './model/recursoadministracion';
import { RecursoadministracionComponent } from './pages/recursoadministracion/recursoadministracion.component';

@Component({
  selector: 'app-root',
  imports: [
  ProveedorComponent, 
  RecursoComponent,
  RecursoadministracionComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('An_ProyectoAgronomia_G5');
}
