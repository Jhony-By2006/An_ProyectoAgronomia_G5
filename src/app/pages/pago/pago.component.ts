import { Component , inject } from '@angular/core';
import { Pago } from '../../model/pago';
import { PagoService } from '../../services/pago.service';
/*Pago.ts*/
@Component({
  selector: 'app-pago',
  imports: [],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css',
})
export class PagoComponent {
  protected Pagos: Pago[] = []; 
  private readonly  pagoService = inject(PagoService); 

  ngOnInit () : void {

    this.pagoService.findAll().subscribe(data => this.Pagos = data); 

  }

}

