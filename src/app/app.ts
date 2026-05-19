import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RecursoComponent } from './pages/recurso/recurso.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { ProductoFinalComponent } from './pages/producto-final/producto-final.component';
// import { PagoComponent } from './pages/pago/pago.component';
import { MetodopagoComponent } from './pages/metodopago/metodopago.component';


@Component({
  selector: 'app-root',
  imports:[
    RecursoComponent, ProveedorComponent,
    InventarioComponent, ProductoFinalComponent,
    /* PagoComponent, */ MetodopagoComponent

  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('An_ProyectoAgronomia_G5');
}
