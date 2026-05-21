import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { MetodoPago } from '../model/metodopago';
/*Metodo Pago.ts*/
@Injectable({
  providedIn: 'root',
})
export class MetodoPagoService {
  private url = `${environment.HOST}/MetodoPago`;
  private readonly http = inject(HttpClient);

  findAll(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(this.url);
  }
}
