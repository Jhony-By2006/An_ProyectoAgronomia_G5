import { Component , inject } from '@angular/core';
import { MetodoPago } from '../../model/metodopago';
import { MetodoPagoService } from '../../services/metodopago.service';
/*Metodo Pago.ts*/
@Component({
  selector: 'app-metodopago',
  imports: [],
  templateUrl: './metodopago.component.html',
  styleUrl: './metodopago.component.css',
})
export class MetodoPagoComponent {
  protected MetodosPago: MetodoPago[] = []; 
  private readonly  metodopagoService = inject(MetodoPagoService); 

  ngOnInit () : void {

    this.metodopagoService.findAll().subscribe(data => this.MetodosPago = data); 

  }

}