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

// ── (Inventario) ──
const NOMBRE_REGEX = /^[a-zA-ZÀ-ÿ\s]{3,100}$/;
const UNIDAD_REGEX = /^[a-zA-ZÀ-ÿ.\s]{1,20}$/;
const DESCRIPCION_REGEX = /^(?=.*[a-zA-ZÀ-ÿ])[a-zA-ZÀ-ÿ0-9.,°@\-\s]{5,250}$/;
const STOCK_MAX = 1000000;

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

  protected $productosFinalesList = signal<any[]>([]);
  protected $productosInicialesList = signal<any[]>([]);

  // ── Exclusivo para enlazar las validaciones al HTML ──
  protected readonly nombrePattern = NOMBRE_REGEX;
  protected readonly unidadPattern = UNIDAD_REGEX;
  protected readonly descripcionPattern = DESCRIPCION_REGEX;
  protected readonly stockMaxVal = STOCK_MAX;
  protected readonly maxFechaHoy = new Date().toISOString().split('T')[0];

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

  private validar(): boolean {
    const inv = this.$inventario();

    if (!inv.productoFinal) {
      alert('Seleccione un producto final.');
      return false;
    }

    if (!inv.productoInicial) {
      alert('Seleccione un producto inicial.');
      return false;
    }

    const nombre = (inv.nombreInven ?? '').trim();
    if (!nombre || !NOMBRE_REGEX.test(nombre)) {
      alert('El nombre solo debe contener letras y espacios, sin números ni símbolos como @, entre 3 y 100 caracteres.');
      return false;
    }

    const descripcion = (inv.descripcionInven ?? '').trim();
    if (!descripcion || !DESCRIPCION_REGEX.test(descripcion)) {
      alert('La descripción debe contener letras, entre 5 y 250 caracteres.');
      return false;
    }

    const stockActual = Number(inv.stockActualInven);
    if (inv.stockActualInven === '' || inv.stockActualInven == null || !Number.isInteger(stockActual) || stockActual < 0 || stockActual > STOCK_MAX) {
      alert(`El stock actual debe ser un entero entre 0 y ${STOCK_MAX.toLocaleString('es-PE')}.`);
      return false;
    }

    const stockMinimo = Number(inv.stockMinimoInven);
    if (inv.stockMinimoInven === '' || inv.stockMinimoInven == null || !Number.isInteger(stockMinimo) || stockMinimo < 0 || stockMinimo > STOCK_MAX) {
      alert(`El stock mínimo debe ser un entero entre 0 y ${STOCK_MAX.toLocaleString('es-PE')}.`);
      return false;
    }

    const unidad = (inv.unidadMedidaInven ?? '').trim();
    if (!unidad || !UNIDAD_REGEX.test(unidad)) {
      alert('La unidad de medida debe contener solo letras (ej. kg, L, unidades), sin números ni @, máx. 20 caracteres.');
      return false;
    }

    if (!inv.fechaActualizacionInven) {
      alert('Seleccione una fecha de actualización.');
      return false;
    }
    const fechaSeleccionada = new Date(inv.fechaActualizacionInven);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaSeleccionada > hoy) {
      alert('La fecha de actualización no puede ser futura.');
      return false;
    }

    return true;
  }

  operate(){
    if (!this.validar()) return;

    const formValue = this.$inventario();
    const isEdit = formValue != null && formValue.idInventario > 0;
    const msg = isEdit ? 'UPDATED' : 'CREATED';

    let fechaFormateada = formValue.fechaActualizacionInven;
    if (fechaFormateada && !fechaFormateada.includes('T')) {
      fechaFormateada = `${fechaFormateada}T00:00:00`;
    }

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
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}