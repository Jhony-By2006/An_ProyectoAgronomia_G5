import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; // Importa ChangeDetectorRef
import { Proveedor } from '../../model/proveedor';
import { ProveedorService } from '../../services/proveedor.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proveedor.component.html',
  styleUrl: './proveedor.component.css',
})
export class ProveedorComponent implements OnInit {

  // Lista de proveedores que se mostrará en la vista
  public proveedores: Proveedor[] = [];

  // Inyectamos el servicio para acceder al backend
  private readonly proveedorService = inject(ProveedorService);

  // Inyectamos el detector de cambios para forzar actualización de la vista
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    // Llamamos al servicio para obtener todos los proveedores
    this.proveedorService.findAll().subscribe({
      next: (data) => {
        // Guardamos los datos recibidos en la variable pública
        this.proveedores = data;
        console.log('Datos recibidos en Angular:', data);

        // Forzamos a Angular a refrescar la vista con los nuevos datos
        this.cdr.detectChanges();
      },
      error: (err) => {
        // Capturamos y mostramos cualquier error de conexión
        console.error('Error al conectar con el backend:', err);
      }
    });
  }
}
