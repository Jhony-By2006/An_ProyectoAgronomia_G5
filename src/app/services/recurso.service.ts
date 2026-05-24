import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Recurso } from '../model/recurso'; 
import { GenericSignalService } from './generic-signal.service'; // Importamos la clase genérica

@Injectable({
  providedIn: 'root',
})
export class RecursoService extends GenericSignalService<Recurso> { 
  // Sobreescribimos la url para que apunte a la ruta de recursos en el backend
  protected override url: string = `${environment.HOST}/recursos`;  
}