import { Component , inject } from '@angular/core';
import { ProductoInicial } from '../../model/producto-inicial';
import { ProductoInicialService } from '../../services/producto-inicial.service';

/*Producto Inicial.ts*/
@Component({
  selector: 'app-producto-inicial',
  imports: [],
  templateUrl: './producto-inicial.component.html',
  styleUrl: './producto-inicial.component.css',
})
export class ProductoInicialComponent {
  protected ProductosIniciales: ProductoInicial[] = []; 
  private readonly productoInicialService = inject(ProductoInicialService); 

  ngOnInit () : void {
    this.productoInicialService.findAll().subscribe(data => this.ProductosIniciales = data); 
  }
}