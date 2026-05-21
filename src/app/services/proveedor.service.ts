import { HttpClient } from '@angular/common/http'; //Realiza peticiones HTTP (GET, POST, etc.)
import { inject, Injectable } from '@angular/core'; // Inyecta dependencias y declara servicios de angular
import { environment } from '../../environments/environment.development'; //Importa la configuración del entorno de desarrollo para obtener la URL a base de la API
import { Proveedor } from '../model/proveedor'; //Importa el modelo de datos para los proveedores


@Injectable({
  providedIn: 'root',
})

export class ProveedorService {

  private url = `${environment.HOST}/Proveedor`; //Se conecta con el constructor(private http: HttpClient);
  
  private readonly http = inject(HttpClient); //El HttpClient nos permite usar las funciones como GET, POST, etc.

  findAll() { //Pide al backend la lista de proveedores registradors
    return this.http.get<Proveedor[]>(this.url); 
  }

}