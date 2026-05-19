import { ProductoFinal } from "./producto-final";

export interface Inventario {
    idInventario: number;
    idProductoFinal: number;
    idProductoInicial: number;
    nombreInven: string;
    descripcionInven: string;
    stockActualInven: number;
    stockMinimoInven: number;
    unidadMedidaInven: string;
    fechaActualizacionInven: Date;
    estadoInven: boolean;
    productoFinal?: ProductoFinal;
}