import { inject, Injectable } from '@angular/core';
import { Inventario } from '../model/inventario';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
      private url = `${environment.HOST}/Inventario`; 
  
  private readonly http = inject(HttpClient); 

  findAll() { 
    return this.http.get<Inventario[]>(this.url); 
  }
}
