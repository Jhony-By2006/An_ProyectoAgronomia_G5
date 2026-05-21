import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http'; //Realiza peticiones HTTP (GET, POST, etc.)
import { Recurso } from '../model/recurso';

@Injectable({
  providedIn: 'root',
})
export class RecursoService {

  private url = `${environment.HOST}/Recurso`; //Se conecta con el constructor(private http: HttpClient);

  private readonly http = inject(HttpClient); //El HttpClient nos permite usar las funciones como GET, POST, etc.

  findAll() {
    return this.http.get<Recurso[]>(this.url);
  }
}
