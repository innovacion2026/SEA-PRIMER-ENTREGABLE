-- ==============================================================================
-- SCRIPT DE DATOS SEMILLA COMPLETOS PARA SEA & SEA-PROVEEDORES (POSTGRESQL)
-- ==============================================================================

-- 1. MAESTRO DE PROVEEDORES
INSERT INTO PROVEEDORES (RIF, NOMBRE, CATEGORIA, ZONA, CONTACTO, TELEFONO, EMAIL, BANCO, CUENTA_BANCARIA, EVALUACION, ESTATUS) VALUES
('J-30123456-7', 'Distribuidora Andina C.A.', 'Insumos', 'Caracas / Miranda', 'M. Pérez', '+58 212-555-0101', 'contacto@andina.com', 'Banco Mercantil', '0105-0012-34-10009012', 91.7, 'Activo'),
('J-31998877-2', 'Tecnología Global S.A.', 'Hardware/SW', 'Nacional', 'L. Ramírez', '+58 212-555-0144', 'ventas@tecglobal.com', 'Banesco', '0134-0099-88-20004511', 90.6, 'Activo'),
('J-30551122-9', 'Servicios Integrales 360', 'Mantenimiento', 'Centro', 'C. Salazar', '+58 414-555-0188', 'contacto@servicios360.com', 'BBVA Provincial', '0108-0111-22-30009911', 84.0, 'Activo'),
('J-32004411-0', 'Logística Caribe', 'Transporte', 'Costa', 'R. Moreno', '+58 261-555-0203', 'logistica@caribe.com', 'Banco de Venezuela', '0102-0444-55-10008822', 89.0, 'Activo'),
('J-29887766-4', 'Suministros Pro', 'Oficina', 'Caracas', 'A. Linares', '+58 212-555-0111', 'ventas@suministrospro.com', 'Bancamiga', '0172-0001-99-40001234', 75.0, 'Inactivo'),
('J-31112233-5', 'Construcciones Vega', 'Obras', 'Andes', 'J. Vega', '+58 274-555-0167', 'info@vega.com', 'Banco Exterior', '0115-0033-11-20005566', 82.0, 'Activo')
ON CONFLICT (RIF) DO UPDATE SET ESTATUS = EXCLUDED.ESTATUS;

-- 2. SOLICITUDES DE PROVEEDOR
INSERT INTO SOLICITUDES_PROVEEDOR (CODIGO, PROVEEDOR, RIF, CONTACTO, TELEFONO, EMAIL, FECHA, TIPO, ETAPA, ESTATUS, CATEGORIA) VALUES
('SOL-2026-0036', 'Innovatech C.A.', 'J-40112233-9', 'D. Herrera', '+58 412-555-0999', 'info@innovatech.com', '2026-04-25', 'Nuevo registro', 'Registro', 'Pendiente', 'Tecnología'),
('SOL-2026-0035', 'Distribuidora Sol', 'J-40556677-1', 'G. Torres', '+58 414-555-0888', 'ventas@distribuidorasol.com', '2026-04-24', 'Nuevo registro', 'Documentación', 'Pendiente', 'Insumos'),
('SOL-2026-0034', 'Imprenta Nacional', 'J-30998811-5', 'F. Blanco', '+58 212-555-0777', 'contacto@imprenta.gob.ve', '2026-04-22', 'Actualización', 'Validación Legal', 'En revisión', 'Servicios'),
('SOL-2026-0033', 'Servitec del Sur', 'J-31445566-2', 'H. Medina', '+58 261-555-0666', 'contacto@servitec.com', '2026-04-20', 'Nuevo registro', 'Aprobación', 'Pendiente', 'Mantenimiento'),
('SOL-2026-0032', 'Aseo Total S.A.', 'J-30221144-8', 'E. Castillo', '+58 212-555-0555', 'contacto@aseototal.com', '2026-04-18', 'Nuevo registro', 'Alta en SEA', 'Aprobado', 'Servicios'),
('SOL-2026-0031', 'Cargo Express', 'J-40889900-3', 'K. Rojas', '+58 241-555-0444', 'envios@cargoexpress.com', '2026-04-15', 'Nuevo registro', 'Validación Legal', 'Rechazado', 'Transporte');

-- 3. EVALUACIONES Y NOTIFICACIONES DE PROVEEDORES
INSERT INTO EVALUACIONES_PROVEEDOR (PROVEEDOR_ID, PUNTAJE, COMENTARIO, FECHA_EVALUACION) VALUES
((SELECT id FROM proveedores WHERE rif = 'J-30123456-7' LIMIT 1), 91.7, 'Excelente cumplimiento de tiempos en entrega de insumos Q1 2026', CURRENT_TIMESTAMP),
((SELECT id FROM proveedores WHERE rif = 'J-31998877-2' LIMIT 1), 90.6, 'Alta calidad de equipamiento hardware y garantías de soporte', CURRENT_TIMESTAMP),
((SELECT id FROM proveedores WHERE rif = 'J-30551122-9' LIMIT 1), 84.0, 'Servicios de mantenimiento satisfactorios con observaciones en tiempos', CURRENT_TIMESTAMP),
((SELECT id FROM proveedores WHERE rif = 'J-32004411-0' LIMIT 1), 89.0, 'Excelente servicio de transporte y logística nacional', CURRENT_TIMESTAMP);

INSERT INTO NOTIFICACIONES_PROVEEDOR (TITULO, MENSAJE, LEIDO, FECHA) VALUES
('NOT-1042', 'Carta de referencia comercial emitida para Distribuidora Andina C.A.', 1, CURRENT_TIMESTAMP - INTERVAL '5 days'),
('NOT-1041', 'Selección por servicio adjudicado a Logística Caribe', 1, CURRENT_TIMESTAMP - INTERVAL '7 days'),
('NOT-1040', 'Observaciones de documentación recibidas para Suministros Pro', 0, CURRENT_TIMESTAMP - INTERVAL '10 days');

-- 4. DOCUMENTACIÓN DE PROVEEDORES
INSERT INTO DOCUMENTACION_PROVEEDOR (PROVEEDOR_ID, NOMBRE_DOCUMENTO, CATEGORIA, NOMBRE_ARCHIVO_PDF, PESO_ARCHIVO, FECHA_VENCIMIENTO, ESTATUS_VALIDACION) VALUES
((SELECT id FROM proveedores WHERE rif = 'J-30123456-7' LIMIT 1), 'RIF Actualizado 2026', 'Legal', 'RIF_Andina_2026.pdf', '1.2 MB', '2026-12-31', 'Vigente'),
((SELECT id FROM proveedores WHERE rif = 'J-31998877-2' LIMIT 1), 'Solvencia Laboral INCES', 'Laboral', 'Solvencia_Laboral_TecGob.pdf', '850 KB', '2026-06-15', 'Por vencer'),
((SELECT id FROM proveedores WHERE rif = 'J-30551122-9' LIMIT 1), 'Póliza Responsabilidad Civil', 'Seguros', 'Poliza_RC_Serv360.pdf', '2.4 MB', '2026-03-30', 'Vencido');

-- 5. COMITÉS, MIEMBROS Y CASOS
INSERT INTO COMITES (CODIGO, NOMBRE, MONTO_MAX_APROB, FRECUENCIA, ESTATUS) VALUES
('CM-01', 'Comité de Compras Menores', 5000.00, 'Semanal', 'Activo'),
('CM-02', 'Comité de Compras Mayores', 50000.00, 'Quincenal', 'Activo'),
('CM-03', 'Comité de Inversiones', 250000.00, 'Mensual', 'Activo'),
('CM-04', 'Comité Ejecutivo', 1000000.00, 'Mensual', 'Activo')
ON CONFLICT (CODIGO) DO NOTHING;

INSERT INTO MIEMBROS_COMITE (COMITE_ID, NOMBRE, CARGO, CEDULA, EMAIL) VALUES
(1, 'Andrea Linares', 'Jefe de Compras', 'V-15.221.009', 'alinares@sea.gob.ve'),
(2, 'María Pérez', 'Gerente Finanzas', 'V-12.345.678', 'mperez@sea.gob.ve'),
(3, 'Rafael Moreno', 'Gerente IT', 'V-13.554.221', 'rmoreno@sea.gob.ve'),
(4, 'Carlos Salazar', 'Director General', 'V-9.876.543', 'csalazar@sea.gob.ve');

INSERT INTO CASOS_COMITE (COMITE_ID, TITULO, DESCRIPCION, ESTATUS, DECISION, FECHA_PRESENTACION) VALUES
(2, 'CASO-2026-018', 'Adjudicación licitación compras mayores de servidores', 'Aprobado', 'Aprobado', '2026-04-22'),
(1, 'CASO-2026-017', 'Compra urgente de repuestos de imprenta', 'Aprobado', 'Aprobado', '2026-04-19'),
(3, 'CASO-2026-016', 'Proyecto renovación de data center principal', 'Diferido', 'Diferido', '2026-04-15'),
(4, 'CASO-2026-015', 'Ampliación de infraestructura corporativa 2026', 'Aprobado', 'Aprobado', '2026-04-10');

-- 6. REQUERIMIENTOS
INSERT INTO REQUERIMIENTOS (CODIGO, TIPO_ORDEN, SOLICITANTE, DEPARTAMENTO, DESCRIPCION, CANTIDAD_UNIDAD, CENTRO_COSTO, PRIORIDAD, ETAPA_NEGOCIO, ESTATUS, MONTO_ESTIMADO) VALUES
('SOL-2026-091', 'Producto', 'Juan Pérez', 'IT Planta', 'Renovación licencias antivirus (Bitdefender 2026)', '50 licencias', 'IT Planta', 'Urgente', 'Solicitud', 'ENVIADA', 12500.00),
('SOL-2026-090', 'Servicio', 'María García', 'Operaciones', 'Repuestos planta Caracas (Filtros y Correas)', '12 unidades', 'Mantenimiento Planta', 'Normal', 'Presupuesto', 'APROBADA', 8500.00),
('SOL-2026-089', 'Producto', 'Carlos Rodríguez', 'Administración', 'Insumos oficina Q2 (Papelería y Toners)', '1 lote global', 'Gastos Administrativos', 'Programada', 'Aprobación', 'BORRADOR', 3200.00),
('SOL-2026-088', 'Servicio', 'Ana López', 'Ventas', 'Material POP para feria comercial', '500 unidades', 'Marketing y Ventas', 'Urgente', 'Recepción', 'EN PROCESO', 4500.00),
('SOL-2026-087', 'Producto', 'Luis Rivas', 'Logística', 'Cámara Profesional para Marketing', '1 unidad', 'Marketing', 'Urgente', 'Compras', 'APROBADA', 1800.00)
ON CONFLICT (CODIGO) DO NOTHING;

-- 7. ÓRDENES DE COMPRA Y RECEPCIONES
INSERT INTO ORDENES_COMPRA (CODIGO, PROVEEDOR_ID, PROVEEDOR, MONTO_TOTAL, ESTATUS_ENTREGA, ESTATUS) VALUES
('OC-2026-0188', 1, 'Distribuidora Andina C.A.', 12450.00, 'Recibido Total', 'Emitida'),
('OC-2026-0187', 2, 'Tecnología Global S.A.', 8900.00, 'En Proceso Almacén', 'Emitida'),
('OC-2026-0186', 4, 'Logística Caribe', 17800.00, 'Pendiente Entrega', 'Emitida')
ON CONFLICT (CODIGO) DO NOTHING;

INSERT INTO RECEPCIONES_ALMACEN (CODIGO, OC_CODIGO, PROVEEDOR, ESTADO, NOTAS) VALUES
('REC-2026-0045', 'OC-2026-0188', 'Distribuidora Andina C.A.', 'Recibida Conforme', 'Equipos recibidos y probados en almacén central'),
('REC-2026-0044', 'OC-2026-0187', 'Tecnología Global S.A.', 'En Revisión', 'Lote de toners inspeccionándose')
ON CONFLICT (CODIGO) DO NOTHING;

-- 8. CXP, RETENCIONES Y PAGOS
INSERT INTO CXP (FACTURA, PROVEEDOR, EMISION, VENCIMIENTO, SUBTOTAL, MONTO_IVA, MONTO_NETO, MONTO, ESTATUS) VALUES
('F-00012458', 'Distribuidora Andina C.A.', '2026-04-02', '2026-05-02', 12450.00, 1992.00, 14442.00, 12450.00, 'Pendiente'),
('F-00012450', 'Tecnología Global S.A.', '2026-04-04', '2026-05-04', 8900.00, 1424.00, 10324.00, 8900.00, 'Pendiente'),
('F-00012431', 'Servicios Integrales 360', '2026-04-07', '2026-05-07', 5230.00, 836.80, 6066.80, 5230.00, 'Pendiente'),
('F-00012410', 'Logística Caribe', '2026-04-10', '2026-05-10', 17800.00, 2848.00, 20648.00, 17800.00, 'Pendiente'),
('F-00012380', 'Suministros Pro', '2026-03-12', '2026-04-12', 3120.00, 499.20, 3619.20, 3120.00, 'Vencida')
ON CONFLICT (FACTURA) DO NOTHING;

INSERT INTO RETENCIONES (CXP_ID, TIPO_RETENCION, PORCENTAJE, MONTO, COMPROBANTE) VALUES
(1, 'IVA 75%', 75.0, 1494.00, 'RET-IVA-00891'),
(2, 'IVA 75%', 75.0, 1068.00, 'RET-IVA-00890'),
(3, 'ISLR 2%', 2.0, 105.00, 'RET-ISLR-00342');

INSERT INTO PAGOS (REFERENCIA, PROVEEDOR, BANCO_ORIGEN, CUENTA_ORIGEN, CUENTA_DESTINO, MONTO, FECHA, ESTATUS) VALUES
('PAG-2026-0312', 'Suministros Pro', 'Banco Mercantil', '0105-0012-34-10009012', '0172-0001-99-40001234', 3120.00, '2026-04-22', 'Procesado'),
('PAG-2026-0311', 'Logística Caribe', 'Banco Mercantil', '0105-0012-34-10009012', '0102-0444-55-10008822', 17800.00, '2026-04-20', 'Procesado'),
('PAG-2026-0310', 'Tecnología Global S.A.', 'Banesco', '0134-0099-88-20004511', '0134-0099-88-20004511', 8900.00, '2026-04-18', 'En tránsito')
ON CONFLICT (REFERENCIA) DO NOTHING;

-- 9. CAJA CHICA
INSERT INTO CAJA_CHICA_PARAMETROS (FONDO_FIJO, MONTO_MAXIMO_BOLETA, CUSTODIO, ESTATUS) VALUES
(1500.00, 200.00, 'A. Linares (Administración)', 'Activo'),
(2500.00, 300.00, 'R. Moreno (Operaciones Caracas)', 'Activo'),
(1200.00, 150.00, 'P. Gómez (Sucursal Valencia)', 'Activo');

INSERT INTO CAJA_CHICA_MOVIMIENTOS (CONCEPTO, MONTO, TIPO, ESTATUS) VALUES
('CC-2026-052 - Apertura de fondo caja chica Operaciones', 2500.00, 'Apertura', 'Aprobado'),
('CC-2026-053 - Reposición gastos papelería y consumibles', 980.00, 'Reposición', 'Aprobado'),
('CC-2026-054 - Reposición fondo sucursal Valencia', 640.00, 'Reposición', 'Aprobado');

INSERT INTO CAJA_CHICA_SOPORTES (MOVIMIENTO_ID, ARCHIVO) VALUES
(1, 'Factura_Material_Limpieza_4421.pdf'),
(2, 'Factura_Refrigerios_1187.pdf'),
(3, 'Recibo_Mensajeria_008.pdf');

-- 10. VIÁTICOS Y RENDICIÓN
INSERT INTO VIATICOS_PARAMETROS (TARIFA_DIARIA, MONEDA) VALUES
(280.00, 'USD'),
(220.00, 'USD'),
(110.00, 'USD'),
(80.00, 'USD');

INSERT INTO VIATICOS (SOLICITANTE, DESTINO, MOTIVO, MONTO_ASIGNADO, ESTATUS, FECHA_INICIO, FECHA_FIN) VALUES
('M. Pérez', 'Maracaibo', 'Inspección técnica de planta occidental', 1240.00, 'Aprobado', '2026-05-04', '2026-05-07'),
('C. Salazar', 'Bogotá', 'Reunión estratégica filial regional', 2980.00, 'En revisión', '2026-05-12', '2026-05-15'),
('L. Ramírez', 'Valencia', 'Supervisión instalación de sistemas', 380.00, 'Pagado', '2026-04-28', '2026-04-29'),
('J. Fernández', 'Caracas', 'Jornada de capacitación central', 850.00, 'Pendiente', '2026-05-11', '2026-05-14');

INSERT INTO VIATICOS_MOVIMIENTOS (VIATICO_ID, CONCEPTO, MONTO, FECHA) VALUES
(1, 'MV-001 - Asignación viático Maracaibo', 1240.00, '2026-04-22'),
(2, 'MV-002 - Replanificación agenda Bogotá', 0.00, '2026-04-23'),
(3, 'MV-003 - Ajuste de rendición Valencia', -40.00, '2026-04-20');

INSERT INTO VIATICOS_SOPORTES (VIATICO_ID, ARCHIVO) VALUES
(3, 'VS-441 - Factura_Hotel_Hesperia_441.pdf'),
(3, 'VS-442 - Recibo_Taxi_Aeropuerto_442.pdf');

INSERT INTO RENDICION_GASTOS (VIATICO_ID, CATEGORIA, MONTO) VALUES
(3, 'Hospedaje', 110.00),
(3, 'Transporte', 35.00);

-- 11. CONFIGURACIÓN, AUDITORÍA Y SEGURIDAD
INSERT INTO COMPANIA (RIF, RAZON_SOCIAL, DIRECCION, TELEFONO) VALUES
('J-31002233-4', 'Consultores 2026 C.A.', 'Av. Francisco de Miranda, Torre SEA, Piso 8, Caracas', '+58 212-555-2026'),
('J-31002233-5', 'Consultores 2026 - Filial Andes', 'Av. Las Américas, Centro Empresarial Mérida', '+58 274-555-1010');

INSERT INTO PARAMETROS_BASE (CLAVE, VALOR, DESCRIPCION) VALUES
('PAISES', '45', 'Países configurados'),
('CIUDADES', '312', 'Ciudades configuradas'),
('BANCOS', '38', 'Bancos nacionales e internacionales'),
('MONEDAS', '14', 'Monedas activas')
ON CONFLICT (CLAVE) DO NOTHING;

INSERT INTO LISTA_VALORES (LISTA, CODIGO, VALOR) VALUES
('Tipos de documento', 'LV-001', 'RIF, Cédula, Pasaporte, Registro Mercantil'),
('Formas de pago', 'LV-002', 'Transferencia, Cheque, Pago Móvil, Carta de Crédito'),
('Categorías de proveedor', 'LV-003', 'Insumos, Hardware/SW, Mantenimiento, Transporte, Servicios');

INSERT INTO LOGS_AUDITORIA (USUARIO, ACCION, DETALLE) VALUES
('mperez', 'Aprobó pago PAG-2026-0312', 'Pago a Suministros Pro procesado por $3,120'),
('csalazar', 'Creó OC-2026-0188', 'Orden de compra emitida a Distribuidora Andina'),
('alinares', 'Aprobó solicitud SOL-2026-0032', 'Proveedor Aseo Total promovido a alta SEA');

INSERT INTO ROLES (NOMBRE, DESCRIPCION) VALUES
('Administrador', 'Acceso total al sistema'),
('Director', 'Aprobaciones de comités e inversiones'),
('Compras', 'Gestión de requerimientos y proveedores'),
('Tesorería', 'Gestión de pagos, CxP, caja chica y viáticos')
ON CONFLICT (NOMBRE) DO NOTHING;

INSERT INTO USUARIOS (USERNAME, PASSWORD, NOMBRE, EMAIL, ROLE_ID, ESTATUS) VALUES
('admin', '123456798', 'Administrador SEA', 'admin@sea.gob.ve', 1, 'Activo'),
('mperez', '123456798', 'María Pérez', 'mperez@sea.gob.ve', 2, 'Activo'),
('csalazar', '123456798', 'Carlos Salazar', 'csalazar@sea.gob.ve', 2, 'Activo'),
('alinares', '123456798', 'Andrea Linares', 'alinares@sea.gob.ve', 3, 'Activo')
ON CONFLICT (USERNAME) DO NOTHING;
