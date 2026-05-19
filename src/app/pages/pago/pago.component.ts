import { Component, inject, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { Pago } from '../../model/pago';
import { PagoService } from '../../services/pago.service';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css',
})
export class ProveedorComponent implements OnInit { 
  protected pagos: Pago[] = [];
  private readonly pagoService = inject(PagoService);

  ngOnInit(): void {
    this.pagoService.findAll().subscribe(data => this.pagos = data);
  }
}

