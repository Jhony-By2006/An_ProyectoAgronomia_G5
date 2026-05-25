import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Proveedor } from '../../model/proveedor';
import { ProveedorService } from '../../services/proveedor.service';
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
  selector: 'app-proveedor',
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
  templateUrl: './proveedor.component.html',
  styleUrl: './proveedor.component.css',
})
export class ProveedorComponent {

  private readonly proveedorService = inject(ProveedorService);
  private readonly snackBar = inject(MatSnackBar);

  // protected $proveedores = toSignal<Proveedor[]>(this.proveedorService.findAll());
  protected $dataSource = signal(new MatTableDataSource<Proveedor>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  //@ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;

  //Enlaza con el signal del service para que cada vez que haya un cambio en los proveedores, se actualice la tabla
  // protected $proveedores = this.proveedorService.$proveedoresChange;
  protected $proveedores = this.proveedorService.$listChange;

  protected displayedColumns: string[] = [
    'idProveedor', 'nombreProveedor', 'apellidoProveedor', 'rucProveedor', 
    'direccionProveedor', 'telefonoProveedor', 'emailProveedor', 'estadoProveedor', 'actions'
  ];

  //Esta esuchando los signals de proveedor, paginador y sort para actualizar la tabla cada vez que haya un cambio
  constructor() {
    // this.proveedorService.findAll().subscribe(data => this.proveedorService.setProveedorChange(data));
    this.proveedorService.findAll().subscribe(data => this.proveedorService.setListChange(data));

    effect( () => {
      const data = this.$proveedores();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();
      
      ds.data = data;
      ds.paginator = p ? p : null;
      ds.sort = s ? s : null;
    }); 
    
    effect(() => {
      const message = this.proveedorService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
        //this.proveedorService.setMessageChange('');
        //esta limpieza no activa el rastreo del effect, no entra a un bucle infinito
        untracked( () => this.proveedorService.setMessageChange('') );
      }
    });
  }

  applyFilter(e: any){
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  delete(idProveedor: number){
    const ok = window.confirm('Are you sure to delete?');
    if(ok){
      this.proveedorService.delete(idProveedor)
      .pipe(
        switchMap( () => this.proveedorService.findAll() ),
        // tap( data => this.proveedorService.setProveedorChange(data) ),
        tap( data => this.proveedorService.setListChange(data) ),
        tap( () => this.proveedorService.setMessageChange('DELETED') )
      )
      .subscribe();
    }
  }
}