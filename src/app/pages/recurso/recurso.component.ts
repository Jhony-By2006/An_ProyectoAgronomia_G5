import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Recurso } from '../../model/recurso';
import { RecursoService } from '../../services/recurso.service';
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
  selector: 'app-recurso',
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
  templateUrl: './recurso.component.html',
  styleUrl: './recurso.component.css',
})
export class RecursoComponent {

  private readonly recursoService = inject(RecursoService);
  private readonly snackBar = inject(MatSnackBar);

  // protected $recursos = toSignal<Recurso[]>(this.recursoService.findAll());
  protected $dataSource = signal(new MatTableDataSource<Recurso>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  //@ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;

  //Enlaza con el signal del service para que cada vez que haya un cambio en los recursos, se actualice la tabla
  // protected $recursos = this.recursoService.$recursosChange;
  protected $recursos = this.recursoService.$listChange;


  protected displayedColumns: string[] = [
    'idRecurso', 'nombreRecurso','proveedor', 'tipoRecurso', 'cantidadRecurso', 
    'unidadMedidaRecurso', 'costoRecurso', 'fechaIngresoRecurso', 'estadoRecurso', 'actions'
  ];


  constructor() {
    // this.recursoService.findAll().subscribe(data => this.recursoService.setRecursoChange(data));
    this.recursoService.findAll().subscribe(data => this.recursoService.setListChange(data));

    effect( () => {
      const data = this.$recursos();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();
      
      ds.data = data;
      ds.paginator = p ? p : null;
      ds.sort = s ? s : null;
    }); 
    
    effect(() => {
      const message = this.recursoService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
        //this.recursoService.setMessageChange('');
        //esta limpieza no activa el rastreo del effect, no entra a un bucle infinito
        untracked( () => this.recursoService.setMessageChange('') );
      }
    });
  }

  applyFilter(e: any){
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  delete(idRecurso: number){
    const ok = window.confirm('Are you sure to delete?');
    if(ok){
      this.recursoService.delete(idRecurso)
      .pipe(
        switchMap( () => this.recursoService.findAll() ),
        // tap( data => this.recursoService.setRecursoChange(data) ),
        tap( data => this.recursoService.setListChange(data) ),
        tap( () => this.recursoService.setMessageChange('DELETED') )
      )
      .subscribe();
    }
  }

}