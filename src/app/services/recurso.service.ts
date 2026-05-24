import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Reporte } from '../model/reporte';

@Injectable({
  providedIn: 'root',
})
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

}