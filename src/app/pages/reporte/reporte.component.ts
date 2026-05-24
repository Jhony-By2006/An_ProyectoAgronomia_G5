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
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';

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
    //RouterLink,
    //RouterOutlet,
    MatSnackBarModule
  ],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css',
})
export class ReporteComponent {

  private readonly reporteService = inject(ReporteService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Reporte>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  // Enlazamos al signal del servicio genérico
  protected $reportes = this.reporteService.$listChange;

  // Columnas mapeadas exactamente con los campos de tu modelo Reporte
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
    // Carga inicial de datos
    this.reporteService.findAll().subscribe(data => this.reporteService.setListChange(data));

    // Efecto para sincronizar el DataSource, paginador y ordenamiento
    effect(() => {
      const data = this.$reportes();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();
      
      ds.data = data;
      ds.paginator = p ? p : null;
      ds.sort = s ? s : null;
    }); 
    
    // Efecto para manejar los mensajes de notificación (Snackbars)
    effect(() => {
      const message = this.reporteService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', {
          duration: 2000, 
          horizontalPosition: 'right', 
          verticalPosition: 'top'
        });
        untracked(() => this.reporteService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any){
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  delete(idReporte: number){
    const ok = window.confirm('¿Estás seguro de eliminar este reporte?');
    if(ok){
      this.reporteService.delete(idReporte)
      .pipe(
        switchMap(() => this.reporteService.findAll()),
        tap(data => this.reporteService.setListChange(data)),
        tap(() => this.reporteService.setMessageChange('ELIMINADO'))
      )
      .subscribe();
    }
  }
}