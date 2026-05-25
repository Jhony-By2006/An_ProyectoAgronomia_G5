import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { ProductoInicial } from '../../model/producto-inicial';
import { ProductoInicialService } from '../../services/producto-inicial.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-producto-inicial',
  imports: [
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
  templateUrl: './producto-inicial.component.html',
  styleUrl: './producto-inicial.component.css',
})
export class ProductoInicialComponent {

  private readonly productoInicialService = inject(ProductoInicialService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<ProductoInicial>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected $productos = this.productoInicialService.$listChange;

  protected displayedColumns: string[] = [
    'idProductoInicial', 'nombreProdI', 'descripcionProdI', 'cantidadInicialProdI',
    'unidadMedidaProdI', 'costoUnitarioProdI', 'fechaIngresoProdI',
    'proveedorOrigenProdI', 'estadoProdI', 'actions'
  ];

  constructor() {
    this.productoInicialService.findAll().subscribe(data => this.productoInicialService.setListChange(data));

    effect(() => {
      const data = this.$productos();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();

      ds.data = data;
      ds.paginator = p ? p : null;
      ds.sort = s ? s : null;
    });

    effect(() => {
      const message = this.productoInicialService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.productoInicialService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  delete(idProductoInicial: number) {
    const ok = window.confirm('¿Está seguro de eliminar este producto?');
    if (ok) {
      this.productoInicialService.delete(idProductoInicial)
        .pipe(
          switchMap(() => this.productoInicialService.findAll()),
          tap(data => this.productoInicialService.setListChange(data)),
          tap(() => this.productoInicialService.setMessageChange('ELIMINADO'))
        )
        .subscribe();
    }
  }
}