import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Administracion } from '../../model/administracion';
import { AdministracionService } from '../../services/administracion.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdministracionDialogComponent } from './administracion-dialog/administracion-dialog.component';

@Component({
  selector: 'app-administracion',
  imports: [
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
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.css',
})
export class AdministracionComponent {
  private readonly administracionService = inject(AdministracionService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected $dataSource = signal(new MatTableDataSource<Administracion>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected $administraciones = this.administracionService.$listChange;

  // Columnas adaptadas a los atributos de tu modelo Administracion
  protected displayedColumns: string[] = [
    'idAdministracion', 
    'nombre', 
    'descripcion', 
    'fechaRegistro', 
    'responsable', 
    'estadoAdmin', 
    'actions'
  ];

  constructor() {
    this.administracionService.findAll().subscribe(data => this.administracionService.setListChange(data));

    this.initializeEffects();
  }

  private initializeEffects(){
    effect(() => {
      const data = this.$administraciones();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();
      
      ds.data = data;
      ds.paginator = p ? p : null;
      ds.sort = s ? s : null;
    }); 

    effect(() => {
      const message = this.administracionService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
        // Esta limpieza no activa el rastreo del effect, evita bucle infinito
        untracked(() => this.administracionService.setMessageChange(''));
      }
    });
  }

  openDialog(administracion?: Administracion){
    this.dialog.open(AdministracionDialogComponent, {
      width: '650px',
      data: administracion,
    });
  }

  delete(idAdministracion: number){
    const ok = window.confirm('Are you sure to delete?');
    if(ok){
      this.administracionService.delete(idAdministracion)
      .pipe(
        switchMap(() => this.administracionService.findAll()),
        tap(data => this.administracionService.setListChange(data)),
        tap(() => this.administracionService.setMessageChange('DELETED'))
      )
      .subscribe();
    }
  }
  
  applyFilter(e: any){
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
}