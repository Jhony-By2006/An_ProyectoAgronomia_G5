import { inject, Injectable } from '@angular/core';
import { ProductoFinal } from '../model/producto-final';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductoFinalService {
    private url = `${environment.HOST}/ProductosFinales`; 
  
  private readonly http = inject(HttpClient); 

  findAll() { 
    return this.http.get<ProductoFinal[]>(this.url); 
  }
}
