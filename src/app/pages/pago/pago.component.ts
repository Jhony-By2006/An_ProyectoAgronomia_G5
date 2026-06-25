import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Pago } from '../../model/pago';
import { PagoService } from '../../services/pago.service';
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
  selector: 'app-pago',
  imports: [
    DecimalPipe,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterOutlet,
    MatSnackBarModule,

  ],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css',
})
export class PagoComponent {

  private readonly pagoService = inject(PagoService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Pago>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected $pagos = this.pagoService.$listChange;

  protected displayedColumns: string[] = [
    'idPago', 'monto', 'fechaPago', 'concepto',
    'comprobante', 'metodoPago', 'estadoPago', 'actions'
  ];

  constructor() {
    this.pagoService.findAll().subscribe(data => this.pagoService.setListChange(data));

    effect(() => {
      const data = this.$pagos();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();

      ds.data = data;
      ds.paginator = p ? p : null;
      ds.sort = s ? s : null;
    });

    effect(() => {
      const message = this.pagoService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        untracked(() => this.pagoService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  delete(idPago: number) {
    const ok = window.confirm('¿Está seguro de eliminar este pago?');
    if (ok) {
      this.pagoService.delete(idPago)
        .pipe(
          switchMap(() => this.pagoService.findAll()),
          tap(data => this.pagoService.setListChange(data)),
          tap(() => this.pagoService.setMessageChange('ELIMINADO'))
        )
        .subscribe();
    }
  }
}