import { Component, inject, OnInit } from '@angular/core';
import { Proveedor } from '../../model/proveedor';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  selector: 'app-proveedor',
  imports: [],
  templateUrl: './proveedor.component.html',
  styleUrl: './proveedor.component.css',
})
export class ProveedorComponent implements OnInit {
  protected proveedores: Proveedor[] = [];
  private readonly proveedorService = inject(ProveedorService);

  ngOnInit(): void {
    this.proveedorService.findAll().subscribe(data => this.proveedores = data);
  }
}