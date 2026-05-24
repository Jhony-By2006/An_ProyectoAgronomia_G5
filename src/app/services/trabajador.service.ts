import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Trabajador } from '../model/trabajador';

@Injectable({
  providedIn: 'root',
})
export class TrabajadorService {

  private url = `${environment.HOST}/Trabajadores`;

  private readonly http = inject(HttpClient);

  findAll() {
    return this.http.get<Trabajador[]>(this.url);
  }

}

