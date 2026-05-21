import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';// Inyecta dependencias y declara servicios de angular
import { environment } from '../../environments/environment.development'; //Importa la configuración del entorno de desarrollo para obtener la URL a base de la API
import { Administracion } from '../model/administracion'; //importa el modelo de datos

@Injectable({
  providedIn: 'root',
})
export class AdministracionService {

  private url = `${environment.HOST}/Administracion`;

  private readonly http = inject(HttpClient);

  findAll() {
    return this.http.get<Administracion[]>(this.url);
  }

}