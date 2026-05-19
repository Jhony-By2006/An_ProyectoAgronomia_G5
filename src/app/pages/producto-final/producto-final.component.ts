import { Component, inject } from '@angular/core';
import { ProductoFinal } from '../../model/producto-final';
import { ProductoFinalService } from '../../services/producto-final.service';

@Component({
  selector: 'app-producto-final',
  imports: [],
  templateUrl: './producto-final.component.html',
  styleUrl: './producto-final.component.css',
})
export class ProductoFinalComponent {
    protected productosFinales: ProductoFinal[] = [];
  private readonly  productoFinalService = inject(ProductoFinalService);

  ngOnInit () : void {

    this.productoFinalService.findAll().subscribe(data => this.productosFinales = data);

  }
}
