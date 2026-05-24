import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Reporte } from '../model/reporte'; 
import { GenericSignalService } from './generic-signal.service'; // Importamos la clase genérica

@Injectable({
  providedIn: 'root',
})
export class ReporteService extends GenericSignalService<Reporte> { 
  // Sobreescribimos la url para que apunte a la ruta de reportes en el backend
  protected override url: string = `${environment.HOST}/reportes`;  
}