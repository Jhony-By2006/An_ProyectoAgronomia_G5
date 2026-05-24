import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Reporte } from '../model/reporte';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {

  private url = `${environment.HOST}/Reportes`;

  private readonly http = inject(HttpClient);

  findAll() {
    return this.http.get<Reporte[]>(this.url);
  }

}

