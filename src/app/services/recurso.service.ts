<<<<<<< HEAD
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Reporte } from '../model/reporte';
=======
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Recurso } from '../model/recurso'; 
import { GenericSignalService } from './generic-signal.service'; // Importamos la clase genérica
>>>>>>> origin/EtuFashin

@Injectable({
  providedIn: 'root',
})
<<<<<<< HEAD
export class ReporteService {

  private url = `${environment.HOST}/Reportes`;

  private readonly http = inject(HttpClient);

  protected $reportes = signal<Reporte[]>([]);
  protected $message = signal<string>('');

  $listChange = this.$reportes;
  $messageChange = this.$message;

  findAll() {
    return this.http.get<Reporte[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<Reporte>(`${this.url}/${id}`);
  }

  save(reporte: Reporte) {
    return this.http.post(this.url, reporte);
  }

  update(id: number, reporte: Reporte) {
    return this.http.put(`${this.url}/${id}`, reporte);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  setListChange(data: Reporte[]) {
    this.$reportes.set(data);
  }

  setMessageChange(data: string) {
    this.$message.set(data);
  }

=======
export class RecursoService extends GenericSignalService<Recurso> { 
  // Sobreescribimos la url para que apunte a la ruta de recursos en el backend
  protected override url: string = `${environment.HOST}/Recurso`;  
>>>>>>> origin/EtuFashin
}