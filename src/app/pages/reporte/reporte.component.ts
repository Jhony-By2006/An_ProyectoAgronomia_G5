import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ReporteService } from '../../services/reporte.service';
import { ReporteDialogComponent } from './reporte-dialog/reporte-dialog.component';
import { Reporte } from '../../model/reporte';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterOutlet,
    MatDialogModule,
    DatePipe
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

  protected $reportes = this.reporteService.$listChange as any;

  protected displayedColumns: string[] = [
    'idReporte',
    'titulo',
    'tipoReporte',
    'fechaGeneracion',
    'generadoPor',
    'estadoReporte',
    'actions'
  ];

  constructor() {
    this.listarTodo();

    effect(() => {
      const data = this.$reportes();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();

      ds.data = data;
      ds.paginator = p ? p : null;
      ds.sort = s ? s : null;
    });

    effect(() => {
      const message = this.reporteService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.reporteService.setMessageChange(''));
      }
    });
  }

  listarTodo() {
    this.reporteService.findAll().subscribe((data: any) => this.reporteService.setListChange(data));
  }

  openDialog(row?: Reporte) {
    const dialogRef = this.dialog.open(ReporteDialogComponent, {
      width: '450px',
      data: row
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listarTodo();
      }
    });
  }

  eliminarReporte(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este reporte de forma permanente?')) {
      this.reporteService.delete(id).subscribe({
        next: () => {
          this.reporteService.setMessageChange('REPORTE ELIMINADO');
          this.listarTodo();
        },
        error: (err) => console.error('Error al eliminar el reporte:', err)
      });
    }
  }

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
}
