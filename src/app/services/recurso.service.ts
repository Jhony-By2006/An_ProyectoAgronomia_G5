import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Recurso } from '../model/recurso';

@Injectable({
  providedIn: 'root',
})
export class RecursoService {

  private url: string = `${environment.HOST}/Recurso`;

  private readonly http = inject(HttpClient);

  findAll() {
    return this.http.get<Recurso[]>(this.url);
  }
}