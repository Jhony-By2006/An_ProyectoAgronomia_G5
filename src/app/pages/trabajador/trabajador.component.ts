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
import { TrabajadorService } from '../../services/trabajador.service';
import { TrabajadorEditComponent } from './trabajador-edit/trabajador-edit.component';
import { Trabajador } from '../../model/trabajador';

@Component({
  selector: 'app-trabajador',
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
  templateUrl: './trabajador.component.html',
  styleUrl: './trabajador.component.css'
})
export class TrabajadorComponent {

  private readonly trabajadorService = inject(TrabajadorService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected $dataSource = signal(new MatTableDataSource<Trabajador>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected $trabajadores = this.trabajadorService.$listChange as any;

  // Lista oficial de columnas que se pintarán en la tabla
  protected displayedColumns: string[] = [
    'idTrabajador',
    'nombre',
    'apellido',
    'dni',
    'telefono',
    'cargo',
    'fechaContrato', // <--- Clave para vincular la columna del HTML
    'email',
    'estadoTrabajador',
    'actions'
  ];

  constructor() {
    this.listarTodo();

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
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.trabajadorService.setMessageChange(''));
      }
    });
  }

  listarTodo() {
    this.trabajadorService.findAll().subscribe((data: any) => this.trabajadorService.setListChange(data));
  }

  openDialog(row?: Trabajador) {
    const dialogRef = this.dialog.open(TrabajadorEditComponent, {
      width: '450px',
      data: row
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listarTodo();
      }
    });
  }

  eliminarTrabajador(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este trabajador de forma permanente?')) {
      this.trabajadorService.delete(id).subscribe({
        next: () => {
          this.trabajadorService.setMessageChange('TRABAJADOR ELIMINADO');
          this.listarTodo(); 
        },
        error: (err) => console.error('Error al eliminar el trabajador:', err)
      });
    }
  }

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
}