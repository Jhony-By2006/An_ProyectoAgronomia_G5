import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; // Para tu combo box de Producto Final
import { InventarioService } from '../../../services/inventario.service';
import { ProductoFinalService } from '../../../services/producto-final.service'; // Servicio de tu relación
import { ProductoFinal } from '../../../model/producto-final';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-inventario-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './inventario-dialog.component.html',
  styleUrl: './inventario-dialog.component.css',
})
export class InventarioDialogComponent {
  private readonly inventarioService = inject(InventarioService);
  private readonly productoFinalService = inject(ProductoFinalService);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<InventarioDialogComponent>); // <--- Cambiado aquí también

  protected $inventario = signal({ ... this.data });
  protected $productosFinalesList = signal<ProductoFinal[]>([]);

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.idProductoFinal === o2.idProductoFinal : o1 === o2;
  }

  constructor() {
    this.productoFinalService.findAll().subscribe(data => this.$productosFinalesList.set(data));
  }

  operate(){
    const inventario = this.$inventario();
    const isEdit = inventario != null && inventario.idInventario > 0;
    const msg = isEdit ? 'UPDATED' : 'CREATED';
    const operation$ = isEdit 
      ? this.inventarioService.update(inventario.idInventario, inventario) 
      : this.inventarioService.save(inventario); 

    operation$.pipe(
      switchMap(() => this.inventarioService.findAll()),
      tap(data => this.inventarioService.setListChange(data)),
      tap(() => this.inventarioService.setMessageChange(msg))
    )
    .subscribe(() => this.close());
  }

  close(){
    this.dialogRef.close();
  }
}