import { Component, inject } from '@angular/core';
import { Recurso } from '../../model/recurso';
import { RecursoService } from '../../services/recurso.service';

@Component({
  selector: 'app-recurso',
  imports: [],
  templateUrl: './recurso.component.html',
  styleUrl: './recurso.component.css',
})
export class RecursoComponent {

  protected recursos: Recurso[] = [];

  private readonly recursoService = inject(RecursoService);

  ngOnInit(): void {
    // this.examService.findAll().subscribe(data => console.log(data));
    this.recursoService.findAll().subscribe(data => this.recursos = data);
  }
}