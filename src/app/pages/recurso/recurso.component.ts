import { Component, inject  } from '@angular/core';
import { Recurso } from '../../model/recurso';
import { RecursoService } from '../../services/recurso.service';


@Component({
  selector: 'app-recurso',
  imports: [],
  templateUrl: './recurso.component.html',
  styleUrl: './recurso.component.css',
})
export class RecursoComponent {
  protected recursos : Recurso [] = []; //Array para almacenar la lista de recursos obtenida del backend

  private readonly recursoService = inject(RecursoService); 

  ngOnInit(): void {

    this.recursoService.findAll().subscribe(data => this.recursos = data); //Llama al método findAll del servicio para obtener la lista de recursos
  }
}
