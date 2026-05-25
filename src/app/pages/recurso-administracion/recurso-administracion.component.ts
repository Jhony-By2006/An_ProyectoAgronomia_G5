import { Component , inject } from '@angular/core';
import { RecursoAdministracion } from '../../model/recurso-administracion';
import { RecursoAdministracionService } from '../../services/recurso-administracion.service';

/*Recurso Administracion.ts*/
@Component({
  selector: 'app-recurso-administracion',
  imports: [],
  templateUrl: './recurso-administracion.component.html',
  styleUrl: './recurso-administracion.component.css',
})
export class RecursoAdministracionComponent {
  protected RecursosAdministracion: RecursoAdministracion[] = []; 
  private readonly recursoAdministracionService = inject(RecursoAdministracionService); 

  ngOnInit () : void {
    this.recursoAdministracionService.findAll().subscribe(data => this.RecursosAdministracion = data); 
  }
}