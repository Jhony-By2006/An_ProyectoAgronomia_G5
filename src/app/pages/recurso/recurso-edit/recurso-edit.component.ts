import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; // Importante para la lista desplegable de Proveedores
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecursoService } from '../../../services/recurso.service';
import { ProveedorService } from '../../../services/proveedor.service'; // Inyectamos proveedores para la relación
import { Proveedor } from '../../../model/proveedor';
import { toSignal } from '@angular/core/rxjs-interop';
import { Recurso } from '../../../model/recurso';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-recurso-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule, 
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './recurso-edit.component.html',
  styleUrl: './recurso-edit.component.css',
})
export class RecursoEditComponent {

  // Inyecciones de Dependencia usando la sintaxis moderna 'inject()' de Angular 17+
  private readonly route = inject(ActivatedRoute); // Permite capturar los parámetros de la URL (como el ID del recurso)
  private readonly router = inject(Router);         // Permite la navegación programática entre páginas (redirección)
  private readonly recursoService = inject(RecursoService);     // Servicio CRUD para Recursos
  private readonly proveedorService = inject(ProveedorService); // Servicio CRUD para jalar los Proveedores de la BD

  // EXPLICACIÓN: Guardamos la lista de proveedores en una Señal (Signal) reactiva para alimentar el mat-select del HTML
  protected $proveedoresList = signal<Proveedor[]>([]);

  // Estructura del Formulario Reactivo usando Signals para rastrear su estado en tiempo real
  protected $form = signal(new FormGroup({
    idRecurso: new FormControl<number | null>(null),
    
    // EXPLICACIÓN: 'proveedor' almacena el objeto Proveedor completo que Spring Boot espera debido al @ManyToOne
    proveedor: new FormControl<any>(null, [Validators.required]),
    nombreRecurso: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    tipoRecurso: new FormControl<string>('', [Validators.required]),
    cantidadRecurso: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    unidadMedidaRecurso: new FormControl<string>('', [Validators.required]),
    costoRecurso: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    fechaIngresoRecurso: new FormControl<string>('', [Validators.required]),
    estadoRecurso: new FormControl<boolean | null>(true),
  }));

  // LÓGICA REACTIVA (SIGNALS):
  // 1. Convertimos el Observable de parámetros de la URL a una Señal reactiva
  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  
  // 2. Extraemos el 'id' de la URL de forma computada (se actualiza automáticamente si cambia el parámetro)
  protected $id = computed(() => this.$params()['id']);
  
  // 3. Bandera booleana: Si hay un ID en la URL significa que estamos Editando (true), sino, Creando (false)
  protected $isEdit = computed(() => !!this.$id()); 
  
  // 4. Acceso directo y simplificado a los controles del formulario en el HTML para validaciones visuales
  protected $f = computed(() => this.$form().controls);

  /**
   * EXPLICACIÓN IMPORTANTE (Mecanismo de comparación):
   * Angular Material necesita saber cuál de todos los proveedores de la lista desplegable debe marcar como "seleccionado".
   * Como 'o1' y 'o2' son objetos completos (JSON), los comparamos únicamente por su clave primaria 'idProveedor'.
   */
  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.idProveedor === o2.idProveedor : o1 === o2;
  }

  constructor() {
    // Carga inicial: Traemos todos los proveedores de la Base de Datos para poblar la lista del select
    this.proveedorService.findAll().subscribe(data => this.$proveedoresList.set(data));

    // El 'effect' vigila constantemente el ID. Si detecta un ID válido, se activa para cargar el formulario
    effect(() => {
      const id = this.$id();
      if(id){
        this.recursoService.findById(id).subscribe(data => {
          
          /**
           * SOLUCIÓN DE FECHA (LocalDate de Spring Boot):
           * Cuando Spring Boot envía un LocalDate, Jackson a veces lo serializa como un arreglo numérico [año, mes, día]
           * o añade marcas de tiempo. Esta sección intercepta la fecha y la convierte a un formato puro String 'YYYY-MM-DD'
           * que el input HTML pueda renderizar, evitando que el formulario se pinte en blanco.
           */
          let fechaFormateada = '';
          if (data.fechaIngresoRecurso) {
            if (Array.isArray(data.fechaIngresoRecurso)) {
              const [year, month, day] = data.fechaIngresoRecurso;
              fechaFormateada = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            } else if (typeof data.fechaIngresoRecurso === 'string') {
              fechaFormateada = data.fechaIngresoRecurso.split('T')[0]; // Remueve horas si se usa LocalDateTime
            }
          }

          // Rellenamos el formulario reactivo de forma controlada con los datos limpios obtenidos de la BD
          this.$form().patchValue({
            idRecurso: data.idRecurso,
            proveedor: data.proveedor, 
            nombreRecurso: data.nombreRecurso,
            tipoRecurso: data.tipoRecurso,
            cantidadRecurso: data.cantidadRecurso,
            unidadMedidaRecurso: data.unidadMedidaRecurso,
            costoRecurso: data.costoRecurso,
            fechaIngresoRecurso: fechaFormateada, // Inyectamos la fecha saneada
            estadoRecurso: data.estadoRecurso
          });
        });
      }
    });
  }

  /**
   * Método Unificado para guardar cambios (Registrar o Actualizar)
   */
  operate(){
    const form = this.$form();
    const isEdit = this.$isEdit();

    // Si el formulario tiene campos inválidos o vacíos, cancelamos la operación de inmediato
    if(form.invalid) return;

    // Convertimos el mapa de valores del formulario en una instancia de nuestro modelo de TypeScript 'Recurso'
    const recurso: Recurso = form.value as Recurso;

    // EXPLICACIÓN SIVALIDACIÓN: Determinamos dinámicamente si llamamos al endpoint PUT o POST de Spring Boot
    // Usamos 'recurso.idRecurso!' para garantizar que usemos el ID incrustado en el modelo, tal cual la lógica del profesor
    const operation$ = isEdit 
      ? this.recursoService.update(recurso.idRecurso!, recurso) 
      : this.recursoService.save(recurso);

    // Flujo Reactivo RxJS: Ejecuta la operación, actualiza la lista global en el servicio y notifica el mensaje
    operation$.pipe(
      switchMap(() => this.recursoService.findAll()), // Re-consulta la lista actualizada de la base de datos
      tap(data => this.recursoService.setListChange(data)), // Emite el nuevo arreglo para actualizar la tabla del listado
      tap(() => this.recursoService.setMessageChange(isEdit ? 'UPDATED' : 'CREATED')) // Dispara el aviso del SnackBar
    )
    .subscribe(() => {
      // Redireccionamos al usuario de regreso al listado general de recursos una vez finalizado con éxito
      this.router.navigate(['/pages/recurso']);
    });
  }
}