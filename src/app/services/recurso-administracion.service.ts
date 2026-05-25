import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { RecursoAdministracion } from '../model/recurso-administracion'; 
import { GenericSignalService } from './generic-signal.service'; 

@Injectable({
  providedIn: 'root',
})
export class RecursoAdministracionService extends GenericSignalService<RecursoAdministracion> { 
  // Sobreescribimos la url para que apunte a la ruta de recurso administracion en el backend
  protected override url: string = `${environment.HOST}/RecusoAdministracion`;  //Es RecursoAdministracion
}