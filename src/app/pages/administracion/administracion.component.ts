import { Component, inject } from '@angular/core';
import { Administracion } from '../../model/administracion';
import { AdministracionService } from '../../services/administracion.service';

@Component({
  selector: 'app-administracion',
  imports: [],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.css',
})
export class AdministracionComponent {

  protected administraciones: Administracion[] = [];

  private readonly administracionService = inject(AdministracionService);

  ngOnInit(): void {

    this.administracionService.findAll()
      .subscribe(data => this.administraciones = data);

  }

}