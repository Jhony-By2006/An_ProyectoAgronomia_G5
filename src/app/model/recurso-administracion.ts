import { Recurso } from './recurso';

export class RecursoAdministracion {
    idRecursoAdministracion: number;
    recurso: Recurso; 
    fechaRecepcion: string;
    cantidadRecibida: number;
    observaciones: string; 
    estadoRecursoA: boolean;
}