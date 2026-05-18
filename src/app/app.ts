import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RecursoComponent } from './pages/recurso/recurso.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';

@Component({
  selector: 'app-root',
  imports:[
    RecursoComponent,
    ProveedorComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('An_ProyectoAgronomia_G5');
}
