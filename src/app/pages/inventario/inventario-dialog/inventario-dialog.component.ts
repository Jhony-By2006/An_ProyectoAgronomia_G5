import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; 
import { InventarioService } from '../../../services/inventario.service';
import { ProductoFinalService } from '../../../services/producto-final.service'; 
import { ProductoInicialService } from '../../../services/producto-inicial.service'; 
import { ProductoFinal } from '../../../model/producto-final';
import { ProductoInicial } from '../../../model/producto-inicial'; 
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-inventario-dialog',
  standalone: true,
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
  private readonly productoInicialService = inject(ProductoInicialService); 
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<InventarioDialogComponent>); 

  protected $inventario = signal<any>(
    this.data 
      ? { ...this.data } 
      : { productoFinal: null, 
        productoInicial: null, 
        nombreInven: '', 
        stockActualInven: 0, 
        stockMinimoInven: 0, unidadMedidaInven: '', 
        estadoInven: true, 
        fechaActualizacionInven: '' }
  );

  protected $productosFinalesList = signal<ProductoFinal[]>([]);
  protected $productosInicialesList = signal<ProductoInicial[]>([]);

  compareFinal(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.idProductoFinal === o2.idProductoFinal : o1 === o2;
  }

  compareInicial(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.idProductoInicial === o2.idProductoInicial : o1 === o2;
  }

  constructor() {
    this.productoFinalService.findAll().subscribe(data => this.$productosFinalesList.set(data));
    this.productoInicialService.findAll().subscribe(data => this.$productosInicialesList.set(data));

    const inv = this.$inventario();
    if (inv && inv.fechaActualizacionInven) {
      if (Array.isArray(inv.fechaActualizacionInven)) {
        const [year, month, day] = inv.fechaActualizacionInven;
        inv.fechaActualizacionInven = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      } else if (typeof inv.fechaActualizacionInven === 'string') {
        inv.fechaActualizacionInven = inv.fechaActualizacionInven.split('T')[0];
      }
      this.$inventario.set(inv);
    }
  }

  operate(){
    const formValue = this.$inventario();
    const isEdit = formValue != null && formValue.idInventario > 0;
    const msg = isEdit ? 'UPDATED' : 'CREATED';

    let fechaFormateada = formValue.fechaActualizacionInven;
    if (fechaFormateada && !fechaFormateada.includes('T')) {
      fechaFormateada = `${fechaFormateada}T00:00:00`;
    }

    // Esto obliga a Spring Boot a actualizar su caché interna con nombres incluidos.
    const inventarioPayload: any = {
      idProductoFinal: formValue.productoFinal?.idProductoFinal,
      idProductoInicial: formValue.productoInicial?.idProductoInicial, 
      
      productoFinal: formValue.productoFinal ?? null,   
      productoInicial: formValue.productoInicial ?? null, 
      
      nombreInven: formValue.nombreInven,
      descripcionInven: formValue.descripcionInven,
      stockActualInven: formValue.stockActualInven,
      stockMinimoInven: formValue.stockMinimoInven,
      unidadMedidaInven: formValue.unidadMedidaInven,
      fechaActualizacionInven: fechaFormateada,
      estadoInven: formValue.estadoInven ?? true
    };

    if (isEdit) {
      inventarioPayload.idInventario = formValue.idInventario;
    }

    const operation$ = isEdit 
      ? this.inventarioService.update(formValue.idInventario, inventarioPayload) 
      : this.inventarioService.save(inventarioPayload); 

    operation$.pipe(
      switchMap(() => this.inventarioService.findAll()),
      tap(data => this.inventarioService.setListChange(data)),
      tap(() => this.inventarioService.setMessageChange(msg))
    )
    .subscribe({
      next: () => this.close(),
      error: (err) => {
        console.error("Error en servidor al guardar:", err);
      }
    });
  }

  close(){
    this.dialogRef.close();
  }
}