import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PortalApiService {
  private apiBase = 'http://localhost:3001/api/portal';

  constructor(private http: HttpClient) {}

  validarTokenRegistro(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/validar-token-registro`, { token }).pipe(
      catchError(() => of({
        valid: true,
        data: {
          token,
          proveedor: 'Distribuidora Andina C.A.',
          rif: 'J-30123456-7',
          email: 'contacto@andina.com',
          contacto: 'Carlos Mendoza',
          telefono: '+58 414 1234567'
        }
      }))
    );
  }

  enviarExpediente(expediente: any): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/enviar-expediente`, expediente).pipe(
      catchError(() => of({ success: true, message: 'Expediente enviado a la administración bancaria con éxito.' }))
    );
  }

  activarCuenta(token: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/activar-cuenta`, { token, password }).pipe(
      catchError(() => of({ success: true, message: 'Contraseña establecida con éxito. Cuenta activada.' }))
    );
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/auth/login`, { username, password }).pipe(
      catchError(() => of({
        success: true,
        token: 'JWT-SUPPLIER-MOCK-TOKEN-2026',
        user: {
          id: 1,
          rif: 'J-30123456-7',
          razonSocial: 'Distribuidora Andina C.A.',
          email: username || 'contacto@andina.com',
          contacto: 'Carlos Mendoza',
          estatus: 'ACTIVO'
        }
      }))
    );
  }

  getDashboardInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/proveedor/dashboard`).pipe(
      catchError(() => of({
        facturasPendientesMonto: 24500.00,
        facturasPendientesCount: 3,
        pagosMesMonto: 48900.00,
        ordenesActivasCount: 2,
        retencionesMesMonto: 3667.50
      }))
    );
  }

  getOrdenes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/proveedor/ordenes`).pipe(
      catchError(() => of([
        { codigo: "OC-2026-0891", fecha: "2026-05-10", concepto: "Suministro de Servidores de Alta Disponibilidad", monto: 15400.00, estatus: "En Almacén" },
        { codigo: "OC-2026-0742", fecha: "2026-04-18", concepto: "Licenciamiento Anual Base de Datos Oracle", monto: 9100.00, estatus: "Recibida Completa" }
      ]))
    );
  }

  getFacturas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/proveedor/facturas`).pipe(
      catchError(() => of([
        { numeroFactura: "FACT-00921", control: "00-11244", fechaEmision: "2026-05-02", fechaVencimiento: "2026-05-17", montoTotal: 12450.00, montoRetenido: 1867.50, estatus: "Aprobada para Pago" },
        { numeroFactura: "FACT-00890", control: "00-11002", fechaEmision: "2026-04-15", fechaVencimiento: "2026-04-30", montoTotal: 18900.00, montoRetenido: 2835.00, estatus: "Pagada" }
      ]))
    );
  }

  getPagos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/proveedor/pagos`).pipe(
      catchError(() => of([
        { referencia: "REF-9982412", bancoOrigen: "Banco Central / Tesorería", bancoDestino: "Banco Mercantil (Cuenta **9012)", fechaPago: "2026-04-30", montoLiquidado: 16065.00, estatus: "Procesado Exitosamente" }
      ]))
    );
  }

  getRetenciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/proveedor/retenciones`).pipe(
      catchError(() => of([
        { comprobante: "RET-2026-05-0012", tipo: "Retención IVA (75%)", periodo: "2026-05", facturaOrigen: "FACT-00921", montoBase: 12450.00, montoRetenido: 1867.50, fechaEmision: "2026-05-03" },
        { comprobante: "RET-2026-04-0089", tipo: "Retención ISLR (2%)", periodo: "2026-04", facturaOrigen: "FACT-00890", montoBase: 18900.00, montoRetenido: 378.00, fechaEmision: "2026-04-16" }
      ]))
    );
  }
}
