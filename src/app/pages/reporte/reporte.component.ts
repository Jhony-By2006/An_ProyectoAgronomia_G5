import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Reporte } from '../../model/reporte';
import { ReporteService } from '../../services/reporte.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';  
import { ReporteDialogComponent } from './reporte-dialog/reporte-dialog.component';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-reporte',
  imports: [
    DatePipe,
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
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css',
})
export class ReporteComponent {
  private readonly reporteService = inject(ReporteService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected $dataSource = signal(new MatTableDataSource<Reporte>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);
  protected $reportes = this.reporteService.$listChange;

  protected displayedColumns: string[] = [
    'idReporte', 'titulo', 'tipoReporte', 'fechaGeneracion',
    'generadoPor', 'estadoReporte', 'actions'
  ];

  constructor() {
    this.reporteService.findAll().subscribe(data => this.reporteService.setListChange(data));
    this.initializeEffects();
  }

  private initializeEffects() {
    effect(() => {
      const data = this.$reportes();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();
      ds.data = data;
      ds.paginator = p ?? null;
      ds.sort = s ?? null;
    });

    effect(() => {
      const message = this.reporteService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        untracked(() => this.reporteService.setMessageChange(''));
      }
    });
  }

  openDialog(reporte?: Reporte) {
    this.dialog.open(ReporteDialogComponent, {
      width: '550px',
      data: reporte,
    });
  }

  delete(idReporte: number) {
    const ok = window.confirm('¿Está seguro de eliminar este reporte?');
    if (ok) {
      this.reporteService.delete(idReporte)
        .pipe(
          switchMap(() => this.reporteService.findAll()),
          tap(data => this.reporteService.setListChange(data)),
          tap(() => this.reporteService.setMessageChange('ELIMINADO'))
        )
        .subscribe();
    }
  }

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
}