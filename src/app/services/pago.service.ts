import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Pago } from '../model/pago';
import { GenericSignalService } from './generic-signal.service';

@Injectable({
  providedIn: 'root',
})
export class PagoService extends GenericSignalService<Pago> {
  protected override url: string = `${environment.HOST}/pagos`;
}