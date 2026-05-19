import { Component, inject } from '@angular/core';
import { InventarioService } from '../../services/inventario.service';
import { Inventario } from '../../model/inventario';

@Component({
  selector: 'app-inventario',
  imports: [],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
})
export class InventarioComponent {
    protected inventario: Inventario[] = [];
  private readonly InventarioService = inject(InventarioService); 

  ngOnInit () : void {

    this.InventarioService.findAll().subscribe(data => this.inventario = data); 

  }
}
