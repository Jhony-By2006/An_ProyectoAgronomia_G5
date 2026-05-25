import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ProductoInicial } from '../model/producto-inicial';


@Injectable({
  providedIn: 'root',
})
export class ProductoInicialService {
  private url = `${environment.HOST}/ProductoInicial`;
  private readonly http = inject(HttpClient);

  findAll(): Observable<ProductoInicial[]> {
    return this.http.get<ProductoInicial[]>(this.url);
  }
}