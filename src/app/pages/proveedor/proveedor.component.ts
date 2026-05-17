import { Component , inject } from '@angular/core';
import { Proveedor } from '../../model/proveedor';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  selector: 'app-proveedor',
  imports: [],
  templateUrl: './proveedor.component.html',
  styleUrl: './proveedor.component.css',
})
export class ProveedorComponent {
  protected proveedores: Proveedor[] = []; //Array para almacenar la lista de proveedores obtenida del backend
  private readonly  proveedorService = inject(ProveedorService); //Inyecta el servicio ProveedorService para poder usar sus métodos

  ngOnInit () : void {

    this.proveedorService.findAll().subscribe(data => this.proveedores = data); //Llama al método findAll del servicio para obtener la lista de proveedores

  }

}
