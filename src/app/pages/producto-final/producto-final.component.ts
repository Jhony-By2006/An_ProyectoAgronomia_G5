import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { ProductoFinal } from '../../model/producto-final';
import { ProductoFinalService } from '../../services/producto-final.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-producto-final',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterOutlet,
    MatSnackBarModule
  ],
  templateUrl: './producto-final.component.html',
  styleUrl: './producto-final.component.css',
})
export class ProductoFinalComponent {

  private readonly productoFinalService = inject(ProductoFinalService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<ProductoFinal>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  // Enlazamos con el signal del servicio genérico para rastrear cambios en la lista
  protected $productosFinales = this.productoFinalService.$listChange;

  // Columnas exactas basadas en la imagen de tu interfaz de Agronomía Espinoza
  protected displayedColumns: string[] = [
    'id', 
    'idProductoFinal', 
    'idProductoInicial', 
    'nombreProductoFinal', 
    'descripcionProductoFinal', 
    'stockProductoFinal', 
    'precioProductoFinal', 
    'estadoProductoFinal', 
    'actions'
  ];

  constructor() {
    // Carga inicial de datos desde el backend
    this.productoFinalService.findAll().subscribe(data => this.productoFinalService.setListChange(data));

    // Efecto reactivo para actualizar la tabla de Angular Material
    effect(() => {
      const data = this.$productosFinales();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();
      
      ds.data = data;
      ds.paginator = p ? p : null;
      ds.sort = s ? s : null;
    }); 
    
    // Efecto reactivo para escuchar notificaciones (Snackbars)
    effect(() => {
      const message = this.productoFinalService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', {
          duration: 2000, 
          horizontalPosition: 'right', 
          verticalPosition: 'top'
        });
        untracked(() => this.productoFinalService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  delete(idProductoFinal: number) {
    const ok = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (ok) {
      this.productoFinalService.delete(idProductoFinal)
      .pipe(
        switchMap(() => this.productoFinalService.findAll()),
        tap(data => this.productoFinalService.setListChange(data)),
        tap(() => this.productoFinalService.setMessageChange('ELIMINADO'))
      )
      .subscribe();
    }
  }
}