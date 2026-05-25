import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { RecursoAdministracion } from '../model/recurso-administracion';


@Injectable({
  providedIn: 'root',
})
export class RecursoAdministracionService {
  private url = `${environment.HOST}/RecusoAdministracion`;
  private readonly http = inject(HttpClient);

  findAll(): Observable<RecursoAdministracion[]> {
    return this.http.get<RecursoAdministracion[]>(this.url);
  }
}