import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Inventario } from '../../model/inventario';
import { InventarioService } from '../../services/inventario.service';
import { InventarioDialogComponent } from './inventario-dialog/inventario-dialog.component';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-inventario',
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
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
})
export class InventarioComponent {
  private readonly inventarioService = inject(InventarioService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected $dataSource = signal(new MatTableDataSource<Inventario>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);
  protected $inventarios = this.inventarioService.$listChange;


  protected displayedColumns: string[] = [
    'idInventario', 
    'nombreInven', 
    'descripcionInven', 
    'stockActualInven', 
    'unidadMedidaInven', 
    'fechaActualizacionInven', 
    'estadoInven', 
    'actions'
  ];
  
  constructor() {
    // Carga inicial de datos
    this.inventarioService.findAll().subscribe(data =>
      this.inventarioService.setListChange(data)
    );

    // Efecto para controlar la reactividad de la tabla, paginador y ordenamiento
    effect(() => {
      const data = this.$inventarios();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();
      
      ds.data = data;
      ds.paginator = p ? p : null;
      ds.sort = s ? s : null;
    });

    // Efecto para las notificaciones automáticas (SnackBars)
    effect(() => {
      const message = this.inventarioService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        untracked(() => this.inventarioService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  openDialog(element?: Inventario) {
    this.dialog.open(InventarioDialogComponent, {
      width: '550px',
      data: element ?? null
    });
  }

  delete(idInventario: number) {
    const ok = window.confirm('¿Estás seguro de eliminar este registro del inventario?');
    if (ok) {
      this.inventarioService.delete(idInventario)
        .pipe(
          switchMap(() => this.inventarioService.findAll()),
          tap(data => this.inventarioService.setListChange(data)),
          tap(() => this.inventarioService.setMessageChange('ELIMINADO'))
        )
        .subscribe();
    }
  }

  getStockPercent(row: Inventario): number {
    const max = row.stockMinimoInven * 2;
    if (max <= 0) return 100;
    return Math.min((row.stockActualInven / max) * 100, 100);
  }
}