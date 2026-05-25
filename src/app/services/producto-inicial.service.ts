import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ProductoInicial } from '../model/producto-inicial'; 
import { GenericSignalService } from './generic-signal.service'; 

@Injectable({
  providedIn: 'root',
})
export class ProductoInicialService extends GenericSignalService<ProductoInicial> { 
  protected override url: string = `${environment.HOST}/ProductosIniciales`;  
}