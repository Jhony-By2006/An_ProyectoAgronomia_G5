import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Trabajador } from '../model/trabajador';
import { GenericSignalService } from './generic-signal.service';

@Injectable({
  providedIn: 'root',
})

export class TrabajadorService extends GenericSignalService<Trabajador> {

  protected override url: string = `${environment.HOST}/Trabajadores`;

}