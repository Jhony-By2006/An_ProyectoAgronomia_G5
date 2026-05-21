import { HttpClient } from '@angular/common/http'; 
import { inject, Injectable } from '@angular/core'; 
import { environment } from '../../environments/environment.development'; 
import { Pago } from '../model/pago'; 
/*Pago.ts*/
@Injectable({
  providedIn: 'root',
})
export class PagoService {

  private url = `${environment.HOST}/pagos`; 
  
  private readonly http = inject(HttpClient); 

  findAll() { 
    return this.http.get<Pago[]>(this.url); 
  }
}