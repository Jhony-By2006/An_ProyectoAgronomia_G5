import { HttpClient } from '@angular/common/http'; 
import { inject, Injectable } from '@angular/core'; 
import { environment } from '../../environments/environment.development'; 
import { Pago } from '../model/pago'; 

@Injectable({
  providedIn: 'root',
})
// 1. Cambia el nombre de ProveedorService a PagoService
export class PagoService {

  // 2. Cambia la ruta de /Proveedores a /Pagos (o como se llame en tu backend)
  private url = `${environment.HOST}/Pagos`; 
  
  private readonly http = inject(HttpClient); 

  findAll() { 
    return this.http.get<Pago[]>(this.url); 
  }
}