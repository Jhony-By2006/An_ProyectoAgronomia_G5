import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Trabajador } from '../../../model/trabajador';
import { TrabajadorService } from '../../../services/trabajador.service';
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
  selector: 'app-trabajador-edit',
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
  templateUrl: './trabajador-edit.component.html',
  styleUrl: './trabajador-edit.component.css',
})
export class TrabajadorEditComponent {

  private readonly trabajadorService = inject(TrabajadorService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Trabajador>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected $trabajadores = this.trabajadorService.$listChange;

  protected displayedColumns: string[] = [
    'idTrabajador',
    'nombre',
    'apellido',
    'cargo',
    'telefono',
    'email',
    'estadoTrabajador',
    'actions'
  ];

  constructor() {

    this.trabajadorService.findAll()
      .subscribe(data => this.trabajadorService.setListChange(data));

    effect(() => {

      const data = this.$trabajadores();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();

      ds.data = data;
      ds.paginator = p ? p : null;
      ds.sort = s ? s : null;

    });

    effect(() => {

      const message = this.trabajadorService.$messageChange();

      if(message){

        this.snackBar.open(
          message,
          'INFO',
          {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          }
        );

        untracked(() =>
          this.trabajadorService.setMessageChange('')
        );

      }

    });

  }

  applyFilter(e: any){

    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();

  }

  delete(idTrabajador: number){

    const ok = window.confirm('Are you sure to delete?');

    if(ok){

      this.trabajadorService.delete(idTrabajador)
      .pipe(
        switchMap(() => this.trabajadorService.findAll()),
        tap(data => this.trabajadorService.setListChange(data)),
        tap(() => this.trabajadorService.setMessageChange('DELETED'))
      )
      .subscribe();

    }

  }

}