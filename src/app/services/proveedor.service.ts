import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Proveedor } from '../model/proveedor'; 
import { GenericSignalService } from './generic-signal.service'; // Se importa la clase generica para reutilizar el codigo y evitar repetir el mismo codigo en cada servicio

@Injectable({
  providedIn: 'root',
})

export class ProveedorService extends GenericSignalService<Proveedor> { // La clase generica es para reutilizar codigo y evitar repetir el mismo codigo en cada servicio, se le pasa el tipo de dato que se va a manejar en este caso Proveedor

  protected override url: string = `${environment.HOST}/Proveedor`;  // Se sobreescribe la url para que apunte a la ruta de proveedores en el backend

}