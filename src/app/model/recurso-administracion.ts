import { Recurso } from './recurso';

export class RecursoAdministracion {
    idRecursoAdministracion: number;
    recurso: Recurso; 
    nombreRecurso: string;
    fechaRecepcion: string;
    cantidadRecibida: number;
    observaciones: string; 
    estadoRecursoA: boolean;
}