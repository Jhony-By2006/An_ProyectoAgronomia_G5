import { Component, inject, signal, OnInit } from '@angular/core';
import { Recurso } from '../../model/recurso';
import { RecursoService } from '../../services/recurso.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recurso',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './recurso.component.html',
  styleUrl: './recurso.component.css',
})
export class RecursoComponent implements OnInit {
  
  // Almacena los datos de la tabla de forma reactiva
  protected $dataSource = signal(new MatTableDataSource<Recurso>());
  
  // Define los nombres y el orden de las columnas que se renderizarán en el HTML
  protected displayedColumns: string[] = ['idRecurso', 'nombreRecurso', 'tipoRecurso', 'cantidadRecurso', 'costoRecurso', 'estadoRecurso'];

  // Inyección del servicio para consumir la API
  private readonly recursoService = inject(RecursoService);

  ngOnInit(): void {
    // Obtiene los recursos del backend y los asigna a la tabla
    this.recursoService.findAll().subscribe(data => {
      this.$dataSource.set(new MatTableDataSource<Recurso>(data));
    });
  }
}