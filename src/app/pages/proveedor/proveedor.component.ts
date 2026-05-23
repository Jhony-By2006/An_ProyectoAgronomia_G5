import { Component, inject, signal, OnInit } from '@angular/core';
import { Proveedor } from '../../model/proveedor';
import { ProveedorService } from '../../services/proveedor.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './proveedor.component.html',
  styleUrl: './proveedor.component.css',
})
export class ProveedorComponent implements OnInit {
  
  protected $dataSource = signal(new MatTableDataSource<Proveedor>());
  
  protected displayedColumns: string[] = ['idProveedor','nombreProveedor','apellidoProveedor','rucProveedor','direccionProveedor','telefonoProveedor','emailProveedor','estadoProveedor'
  ];

  private readonly proveedorService = inject(ProveedorService);

  ngOnInit(): void {
    this.proveedorService.findAll().subscribe(data => {
      this.$dataSource.set(new MatTableDataSource<Proveedor>(data));
    });
  }
}
