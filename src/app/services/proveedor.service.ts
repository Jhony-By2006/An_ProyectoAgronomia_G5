import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {

  private url = 'http://localhost:9090/Proveedor';

  //constructor(private http: HttpClient);
  private readonly http = inject(HttpClient);

  findAll() {
    return this.http.get(this.url);
  }

  findById() {
      return this.http.get(this.url + "/1");
  }
}
  