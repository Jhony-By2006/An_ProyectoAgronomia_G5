import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ProductoFinal } from '../model/producto-final';
import { GenericSignalService } from './generic-signal.service'; // Importamos la clase genérica

@Injectable({
  providedIn: 'root',
})
export class ProductoFinalService extends GenericSignalService<ProductoFinal> { 
  // Sobreescribimos la url para que apunte a la ruta de productos finales en el backend
  protected override url: string = `${environment.HOST}/ProductosFinales`;  
}