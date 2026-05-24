import { Component, inject } from '@angular/core';
import { Reporte } from '../../model/reporte';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-reporte',
  imports: [],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css',
})
export class ReporteComponent {

  protected reportes: Reporte[] = [];

  private readonly reporteService = inject(ReporteService);

  ngOnInit(): void {

    this.reporteService.findAll()
      .subscribe(data => this.reportes = data);

  }

}
