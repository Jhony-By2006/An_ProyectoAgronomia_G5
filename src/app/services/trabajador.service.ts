import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Trabajador } from '../model/trabajador';

@Injectable({
  providedIn: 'root',
})
export class TrabajadorService {

  private url = `${environment.HOST}/Trabajadores`;

  private readonly http = inject(HttpClient);

  protected $trabajadores = signal<Trabajador[]>([]);
  protected $message = signal<string>('');

  $listChange = this.$trabajadores;
  $messageChange = this.$message;

  findAll() {
    return this.http.get<Trabajador[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<Trabajador>(`${this.url}/${id}`);
  }

  save(trabajador: Trabajador) {
    return this.http.post(this.url, trabajador);
  }

  update(id: number, trabajador: Trabajador) {
    return this.http.put(`${this.url}/${id}`, trabajador);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  setListChange(data: Trabajador[]) {
    this.$trabajadores.set(data);
  }

  setMessageChange(data: string) {
    this.$message.set(data);
  }

}