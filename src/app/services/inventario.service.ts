import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Inventario } from '../model/inventario';
import { GenericSignalService } from './generic-signal.service'; // Importamos la clase genérica

@Injectable({
  providedIn: 'root',
})
export class InventarioService extends GenericSignalService<Inventario> { 
  // Sobreescribimos la url para que apunte a la ruta de inventario en el backend
  protected override url: string = `${environment.HOST}/Inventario`;  
}