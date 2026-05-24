import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Administracion } from '../model/administracion'; 
import { GenericSignalService } from './generic-signal.service'; // Importamos la clase genérica

@Injectable({
  providedIn: 'root',
})
export class AdministracionService extends GenericSignalService<Administracion> { 
  // Sobreescribimos la url para que apunte a la ruta de administración en el backend
  protected override url: string = `${environment.HOST}/Administracion`;  
}