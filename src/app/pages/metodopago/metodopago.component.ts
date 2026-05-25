import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { MetodoPago } from '../../model/metodopago';
import { MetodoPagoService } from '../../services/metodopago.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MetodoPagoDialogComponent } from './metodopago-dialog/metodopago-dialog.component';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-metodopago',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './metodopago.component.html',
  styleUrl: './metodopago.component.css',
})
export class MetodoPagoComponent {

  private readonly metodoPagoService = inject(MetodoPagoService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected $dataSource = signal(new MatTableDataSource<MetodoPago>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected $metodosPago = this.metodoPagoService.$listChange;

  protected displayedColumns: string[] = [
    'idMetodoPago', 'nombre', 'descripcion', 'estadoMetodoPago', 'actions'
  ];

  constructor() {
    this.metodoPagoService.findAll().subscribe(data => this.metodoPagoService.setListChange(data));
    this.initializeEffects();
  }

  private initializeEffects() {
    effect(() => {
      const data = this.$metodosPago();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();

      ds.data = data;
      ds.paginator = p ?? null;
      ds.sort = s ?? null;
    });

    effect(() => {
      const message = this.metodoPagoService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        untracked(() => this.metodoPagoService.setMessageChange(''));
      }
    });
  }

  // Abre el dialog: sin argumento = Nuevo | con argumento = Editar
  openDialog(metodoPago?: MetodoPago) {
    this.dialog.open(MetodoPagoDialogComponent, {
      width: '550px',
      data: metodoPago,
    });
  }

  delete(idMetodoPago: number) {
    const ok = window.confirm('¿Está seguro de eliminar este método de pago?');
    if (ok) {
      this.metodoPagoService.delete(idMetodoPago)
        .pipe(
          switchMap(() => this.metodoPagoService.findAll()),
          tap(data => this.metodoPagoService.setListChange(data)),
          tap(() => this.metodoPagoService.setMessageChange('ELIMINADO'))
        )
        .subscribe();
    }
  }

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
}