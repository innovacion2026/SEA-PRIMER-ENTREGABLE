export const fmtMoney = (n: number) =>
  new Intl.NumberFormat("es-VE", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const fmtDate = (d: string | Date) => {
  if (!d) return '';
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return String(d);
    return new Intl.DateTimeFormat("es-VE", { day: "2-digit", month: "short", year: "numeric" }).format(dt);
  } catch {
    return String(d);
  }
};

/* Dashboard */
export const aging = [
  { rango: "0-30 días", monto: 184500 },
  { rango: "31-60 días", monto: 96200 },
  { rango: "+60 días", monto: 41800 },
];
export const totalDeuda = aging.reduce((s, a) => s + a.monto, 0);

export const proximasFacturas = [
  { proveedor: "Distribuidora Andina C.A.", monto: 12450, fecha: "2026-05-02" },
  { proveedor: "Tecnología Global S.A.", monto: 8900, fecha: "2026-05-04" },
  { proveedor: "Servicios Integrales 360", monto: 5230, fecha: "2026-05-07" },
  { proveedor: "Logística Caribe", monto: 17800, fecha: "2026-05-10" },
  { proveedor: "Suministros Pro", monto: 3120, fecha: "2026-05-12" },
];

export const gastosMensuales = [
  { mes: "Nov", monto: 142000 },
  { mes: "Dic", monto: 168000 },
  { mes: "Ene", monto: 151000 },
  { mes: "Feb", monto: 175000 },
  { mes: "Mar", monto: 192000 },
  { mes: "Abr", monto: 184000 },
];
export const gastoActual = gastosMensuales[5].monto;
export const gastoAnterior = gastosMensuales[4].monto;
export const variacionPct = ((gastoActual - gastoAnterior) / gastoAnterior) * 100;

export const centrosCosto = [
  { name: "Operaciones", value: 78000 },
  { name: "Administración", value: 42000 },
  { name: "Ventas", value: 38000 },
  { name: "IT", value: 26000 },
];
export const topCentros = [...centrosCosto].sort((a, b) => b.value - a.value).slice(0, 3);

/* Generic table data per route */
export interface Col { key: string; label: string; format?: "money" | "date" | "badge" }
export interface DataSet { columns: Col[]; rows: Record<string, any>[] }

const proveedores: DataSet = {
  columns: [
    { key: "rif", label: "RIF" },
    { key: "nombre", label: "Nombre Comercial" },
    { key: "categoria", label: "Categoría" },
    { key: "estatus", label: "Estatus", format: "badge" },
  ],
  rows: [
    { rif: "J-30123456-7", nombre: "Distribuidora Andina C.A.", categoria: "Insumos", zona: "Caracas / Miranda", contacto: "M. Pérez", telefono: "+58 212-555-0101", evaluacion: "A", estatus: "Activo" },
    { rif: "J-31998877-2", nombre: "Tecnología Global S.A.", categoria: "Hardware/SW", zona: "Nacional", contacto: "L. Ramírez", telefono: "+58 212-555-0144", evaluacion: "A", estatus: "Activo" },
    { rif: "J-30551122-9", nombre: "Servicios Integrales 360", categoria: "Mantenimiento", zona: "Centro", contacto: "C. Salazar", telefono: "+58 414-555-0188", evaluacion: "B", estatus: "Activo" },
    { rif: "J-32004411-0", nombre: "Logística Caribe", categoria: "Transporte", zona: "Costa", contacto: "R. Moreno", telefono: "+58 261-555-0203", evaluacion: "A", estatus: "Activo" },
    { rif: "J-29887766-4", nombre: "Suministros Pro", categoria: "Oficina", zona: "Caracas", contacto: "A. Linares", telefono: "+58 212-555-0111", evaluacion: "C", estatus: "Inactivo" },
    { rif: "J-31112233-5", nombre: "Construcciones Vega", categoria: "Obras", zona: "Andes", contacto: "J. Vega", telefono: "+58 274-555-0167", evaluacion: "B", estatus: "Activo" },
  ],
};

const solicitudes: DataSet = {
  columns: [
    { key: "codigo", label: "Código" },
    { key: "proveedor", label: "Proveedor" },
    { key: "fecha", label: "Fecha", format: "date" },
    { key: "estatus", label: "Estatus", format: "badge" },
  ],
  rows: [
    { codigo: "SOL-2026-0036", proveedor: "Innovatech C.A.", fecha: "2026-04-25", tipo: "Nuevo registro", etapa: "Registro", estatus: "Pendiente" },
    { codigo: "SOL-2026-0035", proveedor: "Distribuidora Sol", fecha: "2026-04-24", tipo: "Nuevo registro", etapa: "Documentación", estatus: "Pendiente" },
    { codigo: "SOL-2026-0034", proveedor: "Imprenta Nacional", fecha: "2026-04-22", tipo: "Actualización", etapa: "Validación Legal", estatus: "En revisión" },
    { codigo: "SOL-2026-0033", proveedor: "Servitec del Sur", fecha: "2026-04-20", tipo: "Nuevo registro", etapa: "Aprobación", estatus: "Pendiente" },
    { codigo: "SOL-2026-0032", proveedor: "Aseo Total S.A.", fecha: "2026-04-18", tipo: "Nuevo registro", etapa: "Alta en SEA", estatus: "Aprobado" },
    { codigo: "SOL-2026-0031", proveedor: "Cargo Express", fecha: "2026-04-15", tipo: "Nuevo registro", etapa: "Validación Legal", estatus: "Rechazado" },
  ],
};

const evaluacion: DataSet = {
  columns: [
    { key: "proveedor", label: "Proveedor" },
    { key: "periodo", label: "Período" },
    { key: "puntaje", label: "Puntaje" },
    { key: "calificacion", label: "Calificación", format: "badge" },
  ],
  rows: [
    { proveedor: "Distribuidora Andina C.A.", periodo: "Q1 2026", calidad: 95, tiempo: 92, precio: 88, puntaje: 91.7, calificacion: "A" },
    { proveedor: "Tecnología Global S.A.", periodo: "Q1 2026", calidad: 97, tiempo: 90, precio: 85, puntaje: 90.6, calificacion: "A" },
    { proveedor: "Servicios Integrales 360", periodo: "Q1 2026", calidad: 84, tiempo: 78, precio: 90, puntaje: 84.0, calificacion: "B" },
    { proveedor: "Logística Caribe", periodo: "Q1 2026", calidad: 92, tiempo: 95, precio: 80, puntaje: 89.0, calificacion: "A" },
  ],
};

const notificaciones: DataSet = {
  columns: [
    { key: "codigo", label: "Código" },
    { key: "tipo", label: "Tipo" },
    { key: "destinatario", label: "Destinatario" },
    { key: "fecha", label: "Fecha", format: "date" },
    { key: "estatus", label: "Estatus", format: "badge" },
  ],
  rows: [
    { codigo: "NOT-1042", tipo: "Carta de referencia comercial", destinatario: "Distribuidora Andina C.A.", fecha: "2026-04-20", estatus: "Enviado" },
    { codigo: "NOT-1041", tipo: "Selección por servicio", destinatario: "Logística Caribe", fecha: "2026-04-18", estatus: "Enviado" },
    { codigo: "NOT-1040", tipo: "Observaciones bien recibido", destinatario: "Suministros Pro", fecha: "2026-04-15", estatus: "Borrador" },
  ],
};

const documentacion: DataSet = {
  columns: [
    { key: "proveedor", label: "Proveedor" },
    { key: "documento", label: "Documento" },
    { key: "vencimiento", label: "Vencimiento", format: "date" },
    { key: "estatus", label: "Estatus", format: "badge" },
  ],
  rows: [
    { proveedor: "Distribuidora Andina C.A.", documento: "RIF actualizado", vencimiento: "2026-12-31", estatus: "Vigente" },
    { proveedor: "Tecnología Global S.A.", documento: "Solvencia Laboral", vencimiento: "2026-06-15", estatus: "Por vencer" },
    { proveedor: "Servicios Integrales 360", documento: "Póliza RC", vencimiento: "2026-03-30", estatus: "Vencido" },
  ],
};

const comites: DataSet = {
  columns: [
    { key: "codigo", label: "Código" },
    { key: "nombre", label: "Comité" },
    { key: "frecuencia", label: "Frecuencia" },
    { key: "estatus", label: "Estatus", format: "badge" },
  ],
  rows: [
    { codigo: "CM-01", nombre: "Comité de Compras Menores", montoMax: 5000, frecuencia: "Semanal", estatus: "Activo" },
    { codigo: "CM-02", nombre: "Comité de Compras Mayores", montoMax: 50000, frecuencia: "Quincenal", estatus: "Activo" },
    { codigo: "CM-03", nombre: "Comité de Inversiones", montoMax: 250000, frecuencia: "Mensual", estatus: "Activo" },
    { codigo: "CM-04", nombre: "Comité Ejecutivo", montoMax: 1000000, frecuencia: "Mensual", estatus: "Activo" },
  ],
};

const miembros: DataSet = {
  columns: [
    { key: "cedula", label: "Cédula" },
    { key: "nombre", label: "Apellidos y Nombres" },
    { key: "cargo", label: "Cargo" },
    { key: "comite", label: "Comité" },
    { key: "estatus", label: "Estatus", format: "badge" },
  ],
  rows: [
    { cedula: "V-12.345.678", nombre: "Pérez, María", cargo: "Gerente Finanzas", comite: "CM-02", estatus: "Activo" },
    { cedula: "V-9.876.543", nombre: "Salazar, Carlos", cargo: "Director General", comite: "CM-04", estatus: "Activo" },
    { cedula: "V-15.221.009", nombre: "Linares, Andrea", cargo: "Jefe de Compras", comite: "CM-01", estatus: "Activo" },
    { cedula: "V-13.554.221", nombre: "Moreno, Rafael", cargo: "Gerente IT", comite: "CM-03", estatus: "Activo" },
  ],
};

const casos: DataSet = {
  columns: [
    { key: "codigo", label: "Código" },
    { key: "tipo", label: "Tipo Comité" },
    { key: "fecha", label: "Fecha", format: "date" },
    { key: "monto", label: "Monto", format: "money" },
    { key: "decision", label: "Decisión", format: "badge" },
  ],
  rows: [
    { codigo: "CASO-2026-018", tipo: "Compras Mayores", fecha: "2026-04-22", asistentes: 5, monto: 38500, decision: "Aprobado" },
    { codigo: "CASO-2026-017", tipo: "Compras Menores", fecha: "2026-04-19", asistentes: 3, monto: 4200, decision: "Aprobado" },
    { codigo: "CASO-2026-016", tipo: "Inversiones", fecha: "2026-04-15", asistentes: 6, monto: 187000, decision: "Diferido" },
    { codigo: "CASO-2026-015", tipo: "Ejecutivo", fecha: "2026-04-10", asistentes: 7, monto: 620000, decision: "Aprobado" },
  ],
};

const requerimientos: DataSet = {
  columns: [
    { key: "codigo", label: "Código" },
    { key: "solicitante", label: "Solicitante" },
    { key: "prioridad", label: "Prioridad", format: "badge" },
    { key: "etapa_negocio", label: "Estatus", format: "badge" },
  ],
  rows: [
    { codigo: "SOL-2026-091", tipo_orden: "Producto", solicitante: "Juan Pérez", departamento: "IT", descripcion: "Renovación licencias antivirus (Bitdefender 2026)", cantidad_unidad: "50 licencias", centroCosto: "Infraestructura IT", prioridad: "Urgente", fecha: "2026-04-22", estatus: "ENVIADA", etapa_negocio: "Solicitud" },
    { codigo: "SOL-2026-090", tipo_orden: "Servicio", solicitante: "María García", departamento: "Operaciones", descripcion: "Repuestos planta Caracas (Filtros y Correas)", cantidad_unidad: "12 unidades", centroCosto: "Mantenimiento Planta", prioridad: "Normal", fecha: "2026-04-20", estatus: "APROBADA", etapa_negocio: "Presupuesto" },
    { codigo: "SOL-2026-089", tipo_orden: "Producto", solicitante: "Carlos Rodríguez", departamento: "Administración", descripcion: "Insumos oficina Q2 (Papelería y Toners)", cantidad_unidad: "1 lote global", centroCosto: "Gastos Administrativos", prioridad: "Programada", fecha: "2026-04-18", estatus: "BORRADOR", etapa_negocio: "Aprobación" },
    { codigo: "SOL-2026-088", tipo_orden: "Servicio", solicitante: "Ana López", departamento: "Ventas", descripcion: "Material POP para feria comercial", cantidad_unidad: "500 unidades", centroCosto: "Marketing y Ventas", prioridad: "Urgente", fecha: "2026-04-15", estatus: "EN PROCESO", etapa_negocio: "Recepción" },
    { codigo: "SOL-2026-087", tipo_orden: "Producto", solicitante: "Luis Rivas", departamento: "Logística", descripcion: "Cámara Profesional para Marketing", cantidad_unidad: "1 unidad", centroCosto: "Marketing", prioridad: "Urgente", fecha: "2026-05-10", estatus: "APROBADA", etapa_negocio: "Compras" },
  ],
};

const presupuestos: DataSet = {
  columns: [
    { key: "codigo", label: "Código" },
    { key: "tipo", label: "Tipo" },
    { key: "proveedores_count", label: "Proveedores" },
    { key: "ganador", label: "Adjudicado" },
    { key: "monto", label: "Monto", format: "money" },
    { key: "puntaje", label: "Puntaje" },
    { key: "estatus", label: "Estatus", format: "badge" },
  ],
  rows: [],
};

const ordenes: DataSet = {
  columns: [
    { key: "codigo", label: "N° OC" },
    { key: "proveedor", label: "Proveedor" },
    { key: "centro_costo", label: "Centro Costo" },
    { key: "partida", label: "Partida" },
    { key: "monto", label: "Monto", format: "money" },
    { key: "vigencia", label: "Vigencia", format: "date" },
    { key: "estatus", label: "Estatus", format: "badge" },
  ],
  rows: [],
};

const recepciones: DataSet = {
  columns: [
    { key: "codigo", label: "N° Recepción" },
    { key: "oc_asociada", label: "OC Asociada" },
    { key: "proveedor", label: "Proveedor" },
    { key: "fecha", label: "Fecha", format: "date" },
    { key: "estado", label: "Estado", format: "badge" },
  ],
  rows: [],
};

const cxp: DataSet = {
  columns: [
    { key: "factura", label: "N° Factura" },
    { key: "proveedor", label: "Proveedor" },
    { key: "vencimiento", label: "Vencimiento", format: "date" },
    { key: "monto", label: "Monto", format: "money" },
    { key: "estatus", label: "Estatus", format: "badge" },
  ],
  rows: [
    { factura: "F-00012458", proveedor: "Distribuidora Andina", emision: "2026-04-02", vencimiento: "2026-05-02", monto: 12450, estatus: "Pendiente" },
    { factura: "F-00012450", proveedor: "Tecnología Global", emision: "2026-04-04", vencimiento: "2026-05-04", monto: 8900, estatus: "Pendiente" },
    { factura: "F-00012431", proveedor: "Servicios 360", emision: "2026-04-07", vencimiento: "2026-05-07", monto: 5230, estatus: "Pendiente" },
    { factura: "F-00012410", proveedor: "Logística Caribe", emision: "2026-04-10", vencimiento: "2026-05-10", monto: 17800, estatus: "Pendiente" },
    { factura: "F-00012380", proveedor: "Suministros Pro", emision: "2026-03-12", vencimiento: "2026-04-12", monto: 3120, estatus: "Vencida" },
  ],
};

const retenciones: DataSet = {
  columns: [
    { key: "comprobante", label: "Comprobante" },
    { key: "tipo", label: "Tipo" },
    { key: "proveedor", label: "Proveedor" },
    { key: "monto", label: "Monto Retenido", format: "money" },
  ],
  rows: [
    { comprobante: "RET-IVA-00891", tipo: "IVA 75%", proveedor: "Distribuidora Andina", fecha: "2026-04-02", base: 12450, monto: 1494 },
    { comprobante: "RET-ISLR-00342", tipo: "ISLR 2%", proveedor: "Servicios 360", fecha: "2026-04-07", base: 5230, monto: 105 },
    { comprobante: "RET-IVA-00890", tipo: "IVA 75%", proveedor: "Tecnología Global", fecha: "2026-04-04", base: 8900, monto: 1068 },
  ],
};

const pagos: DataSet = {
  columns: [
    { key: "referencia", label: "Referencia" },
    { key: "beneficiario", label: "Beneficiario" },
    { key: "fecha", label: "Fecha", format: "date" },
    { key: "monto", label: "Monto", format: "money" },
    { key: "estatus", label: "Estatus", format: "badge" },
  ],
  rows: [
    { referencia: "PAG-2026-0312", beneficiario: "Suministros Pro", metodo: "Transferencia", fecha: "2026-04-22", monto: 3120, estatus: "Procesado" },
    { referencia: "PAG-2026-0311", beneficiario: "Logística Caribe", metodo: "Cheque", fecha: "2026-04-20", monto: 17800, estatus: "Procesado" },
    { referencia: "PAG-2026-0310", beneficiario: "Tecnología Global", metodo: "Transferencia", fecha: "2026-04-18", monto: 8900, estatus: "En tránsito" },
  ],
};

const cajaParam: DataSet = {
  columns: [
    { key: "unidad", label: "Unidad" },
    { key: "responsable", label: "Responsable" },
    { key: "monto", label: "Monto Asignado", format: "money" },
    { key: "estatus", label: "Estatus", format: "badge" },
  ],
  rows: [
    { unidad: "Administración", responsable: "A. Linares", monto: 1500, estatus: "Activo" },
    { unidad: "Operaciones Caracas", responsable: "R. Moreno", monto: 2500, estatus: "Activo" },
    { unidad: "Sucursal Valencia", responsable: "P. Gómez", monto: 1200, estatus: "Activo" },
  ],
};

const cajaMov: DataSet = {
  columns: [
    { key: "codigo", label: "Código" },
    { key: "tipo", label: "Tipo" },
    { key: "unidad", label: "Unidad" },
    { key: "fecha", label: "Fecha", format: "date" },
    { key: "monto", label: "Monto", format: "money" },
  ],
  rows: [
    { codigo: "CC-2026-052", tipo: "Apertura", unidad: "Operaciones Caracas", fecha: "2026-04-01", monto: 2500 },
    { codigo: "CC-2026-053", tipo: "Reposición", unidad: "Administración", fecha: "2026-04-15", monto: 980 },
    { codigo: "CC-2026-054", tipo: "Reposición", unidad: "Sucursal Valencia", fecha: "2026-04-20", monto: 640 },
  ],
};

const cajaSop: DataSet = {
  columns: [
    { key: "codigo", label: "Código" },
    { key: "concepto", label: "Concepto" },
    { key: "fecha", label: "Fecha", format: "date" },
    { key: "monto", label: "Monto", format: "money" },
    { key: "documento", label: "Documento" },
  ],
  rows: [
    { codigo: "SOP-2241", concepto: "Material limpieza", fecha: "2026-04-12", monto: 84, documento: "Factura #4421" },
    { codigo: "SOP-2242", concepto: "Refrigerios reunión", fecha: "2026-04-14", monto: 56, documento: "Factura #1187" },
    { codigo: "SOP-2243", concepto: "Mensajería local", fecha: "2026-04-17", monto: 32, documento: "Recibo #008" },
  ],
};

const viatParam: DataSet = {
  columns: [
    { key: "cargo", label: "Cargo" },
    { key: "naturaleza", label: "Naturaleza" },
    { key: "hospedaje", label: "Hospedaje/día", format: "money" },
    { key: "alimentacion", label: "Alimentación/día", format: "money" },
    { key: "transporte", label: "Transporte", format: "money" },
  ],
  rows: [
    { cargo: "Director", naturaleza: "Internacional", hospedaje: 280, alimentacion: 90, transporte: 600 },
    { cargo: "Gerente", naturaleza: "Internacional", hospedaje: 220, alimentacion: 75, transporte: 500 },
    { cargo: "Gerente", naturaleza: "Nacional", hospedaje: 110, alimentacion: 45, transporte: 200 },
    { cargo: "Analista", naturaleza: "Nacional", hospedaje: 80, alimentacion: 35, transporte: 150 },
  ],
};

const viatSol: DataSet = {
  columns: [
    { key: "codigo", label: "Código" },
    { key: "solicitante", label: "Solicitante" },
    { key: "destino", label: "Destino" },
    { key: "monto", label: "Monto", format: "money" },
    { key: "estatus", label: "Estatus", format: "badge" },
  ],
  rows: [
    { codigo: "VIA-2026-077", solicitante: "M. Pérez", destino: "Maracaibo", ida: "2026-05-04", regreso: "2026-05-07", monto: 1240, estatus: "Aprobado", etapa: "Pago" },
    { codigo: "VIA-2026-076", solicitante: "C. Salazar", destino: "Bogotá", ida: "2026-05-12", regreso: "2026-05-15", monto: 2980, estatus: "En revisión", etapa: "Presupuesto" },
    { codigo: "VIA-2026-075", solicitante: "L. Ramírez", destino: "Valencia", ida: "2026-04-28", regreso: "2026-04-29", monto: 380, estatus: "Pagado", etapa: "Rendición" },
    { codigo: "VIA-2026-074", solicitante: "J. Lovera", destino: "Caracas", ida: "2026-05-11", regreso: "2026-05-14", monto: 850, estatus: "Pendiente", etapa: "Solicitud" },
  ],
};

const viatMov: DataSet = {
  columns: [
    { key: "codigo", label: "Código" },
    { key: "solicitud", label: "Solicitud" },
    { key: "tipo", label: "Tipo Movimiento" },
    { key: "fecha", label: "Fecha", format: "date" },
    { key: "monto", label: "Monto", format: "money" },
  ],
  rows: [
    { codigo: "MV-001", solicitud: "VIA-2026-077", tipo: "Asignación", fecha: "2026-04-22", monto: 1240 },
    { codigo: "MV-002", solicitud: "VIA-2026-076", tipo: "Replanificación", fecha: "2026-04-23", monto: 0 },
    { codigo: "MV-003", solicitud: "VIA-2026-075", tipo: "Ajuste de monto", fecha: "2026-04-20", monto: -40 },
  ],
};

const viatSop: DataSet = {
  columns: [
    { key: "codigo", label: "Código" },
    { key: "solicitud", label: "Solicitud" },
    { key: "concepto", label: "Concepto" },
    { key: "fecha", label: "Fecha", format: "date" },
    { key: "monto", label: "Monto", format: "money" },
  ],
  rows: [
    { codigo: "VS-441", solicitud: "VIA-2026-075", concepto: "Hotel Hesperia", fecha: "2026-04-28", monto: 110 },
    { codigo: "VS-442", solicitud: "VIA-2026-075", concepto: "Taxi aeropuerto", fecha: "2026-04-29", monto: 35 },
  ],
};

const reportesGastos: DataSet = {
  columns: [
    { key: "categoria", label: "Categoría" },
    { key: "ene", label: "Ene", format: "money" },
    { key: "feb", label: "Feb", format: "money" },
    { key: "mar", label: "Mar", format: "money" },
    { key: "abr", label: "Abr", format: "money" },
    { key: "total", label: "Total", format: "money" },
  ],
  rows: [
    { categoria: "Servicios profesionales", ene: 18000, feb: 21000, mar: 19500, abr: 22000, total: 80500 },
    { categoria: "Suministros", ene: 8200, feb: 9100, mar: 7800, abr: 8400, total: 33500 },
    { categoria: "Mantenimiento", ene: 12400, feb: 11800, mar: 13200, abr: 12900, total: 50300 },
    { categoria: "Tecnología", ene: 9500, feb: 9800, mar: 11200, abr: 10400, total: 40900 },
    { categoria: "Viáticos", ene: 4200, feb: 5100, mar: 4800, abr: 5600, total: 19700 },
  ],
};

const compania: DataSet = {
  columns: [
    { key: "codigo", label: "Código" },
    { key: "nombre", label: "Nombre Comercial" },
    { key: "rif", label: "RIF" },
    { key: "ciudad", label: "Ciudad" },
    { key: "telefono", label: "Teléfono" },
    { key: "estatus", label: "Estatus", format: "badge" },
  ],
  rows: [
    { codigo: "CIA-001", nombre: "Consultores 2026", rif: "J-31002233-4", ciudad: "Caracas", telefono: "+58 212-555-2026", estatus: "Activo" },
    { codigo: "CIA-002", nombre: "Consultores 2026 - Filial Andes", rif: "J-31002233-5", ciudad: "Mérida", telefono: "+58 274-555-1010", estatus: "Activo" },
  ],
};

const parametros: DataSet = {
  columns: [
    { key: "categoria", label: "Categoría" },
    { key: "registros", label: "Registros" },
    { key: "ultima", label: "Última Modif.", format: "date" },
    { key: "estatus", label: "Estatus", format: "badge" },
  ],
  rows: [
    { categoria: "Países", registros: 45, ultima: "2026-04-10", estatus: "Activo" },
    { categoria: "Ciudades", registros: 312, ultima: "2026-04-12", estatus: "Activo" },
    { categoria: "Estados", registros: 24, ultima: "2026-03-22", estatus: "Activo" },
    { categoria: "Municipios", registros: 335, ultima: "2026-03-22", estatus: "Activo" },
    { categoria: "Parroquias", registros: 1136, ultima: "2026-03-22", estatus: "Activo" },
    { categoria: "Urbanizaciones", registros: 4892, ultima: "2026-04-18", estatus: "Activo" },
    { categoria: "Idiomas", registros: 12, ultima: "2026-01-15", estatus: "Activo" },
    { categoria: "Bancos", registros: 38, ultima: "2026-04-19", estatus: "Activo" },
    { categoria: "Monedas", registros: 14, ultima: "2026-04-19", estatus: "Activo" },
    { categoria: "Clases de cambio", registros: 6, ultima: "2026-04-19", estatus: "Activo" },
    { categoria: "Cotización moneda", registros: 28, ultima: "2026-04-22", estatus: "Activo" },
  ],
};

const listaValores: DataSet = {
  columns: [
    { key: "codigo", label: "Código" },
    { key: "lista", label: "Lista" },
    { key: "valores", label: "# Valores" },
    { key: "estatus", label: "Estatus", format: "badge" },
  ],
  rows: [
    { codigo: "LV-001", lista: "Tipos de documento", valores: 8, estatus: "Activo" },
    { codigo: "LV-002", lista: "Formas de pago", valores: 6, estatus: "Activo" },
    { codigo: "LV-003", lista: "Categorías de proveedor", valores: 12, estatus: "Activo" },
    { codigo: "LV-004", lista: "Centros de costo", valores: 4, estatus: "Activo" },
  ],
};

const auditoria: DataSet = {
  columns: [
    { key: "fecha", label: "Fecha" },
    { key: "usuario", label: "Usuario" },
    { key: "modulo", label: "Módulo" },
    { key: "accion", label: "Acción" },
  ],
  rows: [
    { fecha: "2026-04-28 09:14", usuario: "mperez", modulo: "Tesorería", accion: "Aprobó pago PAG-2026-0312", ip: "10.0.4.21" },
    { fecha: "2026-04-28 09:02", usuario: "csalazar", modulo: "Compras", accion: "Creó OC-2026-0188", ip: "10.0.4.07" },
    { fecha: "2026-04-28 08:51", usuario: "alinares", modulo: "Proveedores", accion: "Aprobó solicitud SOL-2026-0032", ip: "10.0.4.42" },
    { fecha: "2026-04-27 17:30", usuario: "rmoreno", modulo: "Configuración", accion: "Editó parámetros (Bancos)", ip: "10.0.4.11" },
  ],
};

const usuarios: DataSet = {
  columns: [
    { key: "usuario", label: "Usuario" },
    { key: "nombre", label: "Nombre" },
    { key: "rol", label: "Rol" },
    { key: "estatus", label: "Estatus", format: "badge" },
  ],
  rows: [
    { usuario: "mperez", nombre: "María Pérez", rol: "Administrador", ultimo: "2026-04-28 09:14", estatus: "Activo" },
    { usuario: "csalazar", nombre: "Carlos Salazar", rol: "Director", ultimo: "2026-04-28 09:02", estatus: "Activo" },
    { usuario: "alinares", nombre: "Andrea Linares", rol: "Compras", ultimo: "2026-04-28 08:51", estatus: "Activo" },
    { usuario: "rmoreno", nombre: "Rafael Moreno", rol: "IT", ultimo: "2026-04-27 17:30", estatus: "Activo" },
    { usuario: "pgomez", nombre: "Pedro Gómez", rol: "Tesorería", ultimo: "2026-04-26 14:22", estatus: "Inactivo" },
  ],
};

const roles: DataSet = {
  columns: [
    { key: "codigo", label: "Código" },
    { key: "rol", label: "Rol" },
    { key: "permisos", label: "# Permisos" },
    { key: "usuarios", label: "# Usuarios" },
    { key: "estatus", label: "Estatus", format: "badge" },
  ],
  rows: [
    { codigo: "ROL-01", rol: "Administrador", permisos: 48, usuarios: 2, estatus: "Activo" },
    { codigo: "ROL-02", rol: "Director", permisos: 36, usuarios: 3, estatus: "Activo" },
    { codigo: "ROL-03", rol: "Compras", permisos: 18, usuarios: 6, estatus: "Activo" },
    { codigo: "ROL-04", rol: "Tesorería", permisos: 22, usuarios: 4, estatus: "Activo" },
    { codigo: "ROL-05", rol: "Consulta", permisos: 8, usuarios: 12, estatus: "Activo" },
  ],
};

export const datasets: Record<string, DataSet> = {
  "/app/proveedores/directorio": proveedores,
  "/app/proveedores/solicitudes": solicitudes,
  "/app/proveedores/evaluacion": evaluacion,
  "/app/proveedores/notificaciones": notificaciones,
  "/app/proveedores/documentacion": documentacion,
  "/app/comite/lista": comites,
  "/app/comite/miembros": miembros,
  "/app/comite/casos": casos,
  "/app/compras/requerimientos": requerimientos,
  "/app/compras/presupuestos": presupuestos,
  "/app/compras/ordenes": ordenes,
  "/app/compras/recepciones": recepciones,
  "/app/tesoreria/cxp": cxp,
  "/app/tesoreria/retenciones": retenciones,
  "/app/tesoreria/pagos": pagos,
  "/app/tesoreria/caja-chica/parametros": cajaParam,
  "/app/tesoreria/caja-chica/movimientos": cajaMov,
  "/app/tesoreria/caja-chica/soportes": cajaSop,
  "/app/tesoreria/viaticos/parametros": viatParam,
  "/app/tesoreria/viaticos/solicitud": viatSol,
  "/app/tesoreria/viaticos/movimientos": viatMov,
  "/app/tesoreria/viaticos/soportes": viatSop,
  "/app/reportes/gastos": reportesGastos,
  "/app/configuracion/compania": compania,
  "/app/configuracion/parametros": parametros,
  "/app/configuracion/lista-valores": listaValores,
  "/app/auditoria": auditoria,
  "/app/seguridad/usuarios": usuarios,
  "/app/seguridad/roles": roles,
};
