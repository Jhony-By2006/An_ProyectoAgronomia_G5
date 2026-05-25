import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { MetodoPago } from '../model/metodopago';

@Injectable({
  providedIn: 'root',
})
export class MetodoPagoService extends GenericSignalService<MetodoPago> {
  protected override url: string = `${environment.HOST}/MetodoPago`; 
}