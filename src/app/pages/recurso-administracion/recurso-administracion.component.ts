import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { RecursoAdministracion } from '../../model/recurso-administracion';
import { RecursoAdministracionService } from '../../services/recurso-administracion.service';
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
  selector: 'app-recurso-administracion',
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
  templateUrl: './recurso-administracion.component.html',
  styleUrl: './recurso-administracion.component.css',
})
export class RecursoAdministracionComponent {

  private readonly recursoAdministracionService = inject(RecursoAdministracionService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<RecursoAdministracion>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected $recursos = this.recursoAdministracionService.$listChange;

  protected displayedColumns: string[] = [
    'idRecursoAdministracion', 'recurso', 'fechaRecepcion',
    'cantidadRecibida', 'observaciones', 'estadoRecursoA', 'actions'
  ];

  constructor() {
    this.recursoAdministracionService.findAll().subscribe(data => this.recursoAdministracionService.setListChange(data));

    effect(() => {
      const data = this.$recursos();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();

      ds.data = data;
      ds.paginator = p ? p : null;
      ds.sort = s ? s : null;
    });

    effect(() => {
      const message = this.recursoAdministracionService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.recursoAdministracionService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  delete(idRecursoAdministracion: number) {
    const ok = window.confirm('¿Está seguro de eliminar este recurso?');
    if (ok) {
      this.recursoAdministracionService.delete(idRecursoAdministracion)
        .pipe(
          switchMap(() => this.recursoAdministracionService.findAll()),
          tap(data => this.recursoAdministracionService.setListChange(data)),
          tap(() => this.recursoAdministracionService.setMessageChange('ELIMINADO'))
        )
        .subscribe();
    }
  }
}