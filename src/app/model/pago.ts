import { MetodoPago } from './metodopago'; 

export class Pago {
    idPago: number;
    monto: number;
    fechaPago: Date;
    concepto: string;
    comprobante: string;
    estadoPago: boolean;
    metodoPago: MetodoPago; 
}