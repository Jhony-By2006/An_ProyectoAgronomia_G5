import { Component, inject } from '@angular/core';
import { Trabajador } from '../../model/trabajador';
import { TrabajadorService } from '../../services/trabajador.service';

@Component({
  selector: 'app-trabajador',
  imports: [],
  templateUrl: './trabajador.component.html',
  styleUrl: './trabajador.component.css',
})
export class TrabajadorComponent {

  protected trabajadores: Trabajador[] = [];

  private readonly trabajadorService = inject(TrabajadorService);

  ngOnInit(): void {

    this.trabajadorService.findAll()
      .subscribe(data => this.trabajadores = data);

  }

}
