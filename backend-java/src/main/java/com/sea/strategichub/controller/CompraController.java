package com.sea.strategichub.controller;

import com.sea.strategichub.service.GenericDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/compras")
public class CompraController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private GenericDataService genericDataService;

    // ═══════════════════════════════════════════════════════════════
    //  REQUERIMIENTOS
    // ═══════════════════════════════════════════════════════════════

    @PostMapping("/requerimientos")
    public ResponseEntity<?> createRequerimiento(@RequestBody Map<String, Object> body) {
        try {
            String codigo = (String) body.get("codigo");
            String tipoOrden = (String) body.get("tipo_orden");
            String solicitante = (String) body.get("solicitante");
            String departamento = (String) body.get("departamento");
            String descripcion = (String) body.get("descripcion");
            String cantidadUnidad = (String) body.get("cantidad_unidad");
            String centroCosto = (String) body.get("centro_costo");
            String prioridad = (String) body.get("prioridad");
            String etapaNegocio = (String) body.getOrDefault("etapa_negocio", "Solicitud");

            String sql = "INSERT INTO requerimientos (codigo, tipo_orden, solicitante, departamento, descripcion, cantidad_unidad, centro_costo, prioridad, etapa_negocio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, codigo, tipoOrden, solicitante, departamento, descripcion, cantidadUnidad, centroCosto, prioridad, etapaNegocio);

            // Fetch created row
            String fetchSql = "SELECT * FROM requerimientos WHERE codigo = ?";
            Map<String, Object> created = genericDataService.keysToLowerCase(jdbcTemplate.queryForMap(fetchSql, codigo));
            return ResponseEntity.status(201).body(created);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear requerimiento: " + e.getMessage()));
        }
    }

    @PutMapping("/requerimientos/{id}/etapa")
    public ResponseEntity<?> updateEtapaRequerimiento(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            String etapaNegocio = (String) body.get("etapa_negocio");
            String sql = "UPDATE requerimientos SET etapa_negocio = ? WHERE id = ?";
            jdbcTemplate.update(sql, etapaNegocio, id);

            Map<String, Object> updated = genericDataService.getRowById("REQUERIMIENTOS", id);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar etapa: " + e.getMessage()));
        }
    }

    @GetMapping("/requerimientos/{id}")
    public ResponseEntity<?> getRequerimiento(@PathVariable Long id) {
        try {
            Map<String, Object> req = genericDataService.getRowById("REQUERIMIENTOS", id);
            if (req == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Requerimiento no encontrado"));
            }
            return ResponseEntity.ok(req);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener requerimiento: " + e.getMessage()));
        }
    }

    @PutMapping("/requerimientos/{id}")
    public ResponseEntity<?> updateRequerimiento(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            List<String> validFields = List.of("tipo_orden", "solicitante", "departamento", "descripcion", "cantidad_unidad", "centro_costo", "prioridad", "estatus", "etapa_negocio", "monto_estimado");
            Map<String, Object> updated = genericDataService.updateTableFields("REQUERIMIENTOS", id, body, validFields);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar requerimiento: " + e.getMessage()));
        }
    }

    // ═══════════════════════════════════════════════════════════════
    //  ÓRDENES DE COMPRA
    // ═══════════════════════════════════════════════════════════════

    @GetMapping("/ordenes/{id}")
    public ResponseEntity<?> getOrdenCompra(@PathVariable Long id) {
        try {
            Map<String, Object> oc = genericDataService.getRowById("ORDENES_COMPRA", id);
            if (oc == null) {
                return ResponseEntity.status(404).body(Map.of("error", "OC no encontrada"));
            }
            List<Map<String, Object>> items = jdbcTemplate.queryForList("SELECT * FROM ordenes_compra_items WHERE oc_id = ? ORDER BY id", id)
                    .stream().map(genericDataService::keysToLowerCase).collect(Collectors.toList());
            oc.put("items", items);
            return ResponseEntity.ok(oc);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener OC: " + e.getMessage()));
        }
    }

    @GetMapping("/ordenes/by-codigo/{codigo}")
    public ResponseEntity<?> getOrdenCompraByCodigo(@PathVariable String codigo) {
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList("SELECT * FROM ordenes_compra WHERE codigo = ?", codigo);
            if (rows.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "OC no encontrada"));
            }
            Map<String, Object> oc = genericDataService.keysToLowerCase(rows.get(0));
            Long id = ((Number) oc.get("id")).longValue();
            List<Map<String, Object>> items = jdbcTemplate.queryForList("SELECT * FROM ordenes_compra_items WHERE oc_id = ? ORDER BY id", id)
                    .stream().map(genericDataService::keysToLowerCase).collect(Collectors.toList());
            oc.put("items", items);
            return ResponseEntity.ok(oc);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener OC por código: " + e.getMessage()));
        }
    }

    @PutMapping("/ordenes/{id}")
    public ResponseEntity<?> updateOrdenCompra(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            List<String> validFields = List.of(
                    "proveedor","proveedor_rif","proveedor_contacto","proveedor_email","proveedor_telefono",
                    "centro_costo","partida","vigencia","estatus","fecha_emision",
                    "condicion_pago","dias_credito","banco_pago",
                    "lugar_entrega","plazo_entrega","garantia",
                    "moneda","tasa_cambio",
                    "iva_porcentaje","iva_exento","islr_porcentaje",
                    "subtotal","monto_iva","monto_islr_retenido","monto_total","monto",
                    "observaciones","aprobado_por","requerimiento_ref","presupuesto_ref"
            );
            Map<String, Object> updated = genericDataService.updateTableFields("ORDENES_COMPRA", id, body, validFields);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar OC: " + e.getMessage()));
        }
    }

    @GetMapping("/ordenes/{id}/items")
    public ResponseEntity<?> getOrdenCompraItems(@PathVariable Long id) {
        try {
            List<Map<String, Object>> items = jdbcTemplate.queryForList("SELECT * FROM ordenes_compra_items WHERE oc_id = ? ORDER BY id", id)
                    .stream().map(genericDataService::keysToLowerCase).collect(Collectors.toList());
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener items de la OC: " + e.getMessage()));
        }
    }

    @PostMapping("/ordenes/{id}/items")
    @Transactional
    public ResponseEntity<?> addOrdenCompraItem(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            String descripcion = (String) body.get("descripcion");
            String unidad = (String) body.getOrDefault("unidad", "Unidad");
            Double cantidad = body.get("cantidad") != null ? ((Number) body.get("cantidad")).doubleValue() : 1.0;
            Double precioUnitario = body.get("precio_unitario") != null ? ((Number) body.get("precio_unitario")).doubleValue() : 0.0;

            String insertSql = "INSERT INTO ordenes_compra_items (oc_id, descripcion, unidad, cantidad, precio_unitario) VALUES (?, ?, ?, ?, ?)";
            jdbcTemplate.update(insertSql, id, descripcion, unidad, cantidad, precioUnitario);

            // Recalculate subtotal and total in OC table
            String updateOcSql = "UPDATE ordenes_compra SET " +
                    "  subtotal = (SELECT COALESCE(SUM(monto_linea), 0) FROM ordenes_compra_items WHERE oc_id = ?), " +
                    "  monto = (SELECT COALESCE(SUM(monto_linea), 0) FROM ordenes_compra_items WHERE oc_id = ?) " +
                    "WHERE id = ?";
            jdbcTemplate.update(updateOcSql, id, id, id);

            // Fetch the newly added item
            String fetchItemSql = "SELECT * FROM ordenes_compra_items WHERE oc_id = ? ORDER BY id DESC LIMIT 1";
            Map<String, Object> created = genericDataService.keysToLowerCase(jdbcTemplate.queryForMap(fetchItemSql, id));
            return ResponseEntity.status(201).body(created);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al agregar item: " + e.getMessage()));
        }
    }

    @DeleteMapping("/ordenes/items/{itemId}")
    @Transactional
    public ResponseEntity<?> deleteOrdenCompraItem(@PathVariable Long itemId) {
        try {
            List<Map<String, Object>> itemRows = jdbcTemplate.queryForList("SELECT oc_id FROM ordenes_compra_items WHERE id = ?", itemId);
            if (itemRows.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Item no encontrado"));
            }
            Long ocId = ((Number) itemRows.get(0).get("OC_ID")).longValue();

            jdbcTemplate.update("DELETE FROM ordenes_compra_items WHERE id = ?", itemId);

            // Recalculate subtotal and total in OC table
            String updateOcSql = "UPDATE ordenes_compra SET " +
                    "  subtotal = (SELECT COALESCE(SUM(monto_linea), 0) FROM ordenes_compra_items WHERE oc_id = ?), " +
                    "  monto = (SELECT COALESCE(SUM(monto_linea), 0) FROM ordenes_compra_items WHERE oc_id = ?) " +
                    "WHERE id = ?";
            jdbcTemplate.update(updateOcSql, ocId, ocId, ocId);

            return ResponseEntity.ok(Map.of("ok", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar item: " + e.getMessage()));
        }
    }

    // ═══════════════════════════════════════════════════════════════
    //  RECEPCIONES DE ALMACÉN
    // ═══════════════════════════════════════════════════════════════

    @GetMapping("/recepciones/{id}")
    public ResponseEntity<?> getRecepcion(@PathVariable Long id) {
        try {
            Map<String, Object> rec = genericDataService.getRowById("RECEPCIONES_ALMACEN", id);
            if (rec == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Recepción no encontrada"));
            }
            List<Map<String, Object>> items = jdbcTemplate.queryForList("SELECT * FROM recepciones_almacen_items WHERE recepcion_id = ? ORDER BY id", id)
                    .stream().map(genericDataService::keysToLowerCase).collect(Collectors.toList());
            rec.put("items", items);
            return ResponseEntity.ok(rec);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener recepción: " + e.getMessage()));
        }
    }

    @PutMapping("/recepciones/{id}")
    public ResponseEntity<?> updateRecepcion(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            List<String> validFields = List.of(
                    "oc_asociada","proveedor","fecha","estado",
                    "recibido_por","responsable_almacen","hora_recepcion",
                    "descripcion_general","condicion_entrega","observaciones",
                    "numero_guia","numero_factura","lugar_recepcion"
            );
            Map<String, Object> updated = genericDataService.updateTableFields("RECEPCIONES_ALMACEN", id, body, validFields);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar recepción: " + e.getMessage()));
        }
    }

    @GetMapping("/recepciones/{id}/items")
    public ResponseEntity<?> getRecepcionItems(@PathVariable Long id) {
        try {
            List<Map<String, Object>> items = jdbcTemplate.queryForList("SELECT * FROM recepciones_almacen_items WHERE recepcion_id = ? ORDER BY id", id)
                    .stream().map(genericDataService::keysToLowerCase).collect(Collectors.toList());
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener items de recepción: " + e.getMessage()));
        }
    }

    @PostMapping("/recepciones/{id}/items")
    @Transactional
    public ResponseEntity<?> addRecepcionItem(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            String descripcion = (String) body.get("descripcion");
            String unidad = (String) body.getOrDefault("unidad", "Unidad");
            Double cantidadPedida = body.get("cantidad_pedida") != null ? ((Number) body.get("cantidad_pedida")).doubleValue() : 0.0;
            Double cantidadRecibida = body.get("cantidad_recibida") != null ? ((Number) body.get("cantidad_recibida")).doubleValue() : 0.0;
            String condicion = (String) body.getOrDefault("condicion", "Conforme");
            String observacionLinea = (String) body.get("observacion_linea");

            String insertSql = "INSERT INTO recepciones_almacen_items (recepcion_id, descripcion, unidad, cantidad_pedida, cantidad_recibida, condicion, observacion_linea) VALUES (?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(insertSql, id, descripcion, unidad, cantidadPedida, cantidadRecibida, condicion, observacionLinea);

            // Re-calculate state of reception
            updateRecepcionEstado(id);

            // Fetch newly added item
            String fetchItemSql = "SELECT * FROM recepciones_almacen_items WHERE recepcion_id = ? ORDER BY id DESC LIMIT 1";
            Map<String, Object> created = genericDataService.keysToLowerCase(jdbcTemplate.queryForMap(fetchItemSql, id));
            return ResponseEntity.status(201).body(created);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al agregar ítem: " + e.getMessage()));
        }
    }

    @DeleteMapping("/recepciones/items/{itemId}")
    @Transactional
    public ResponseEntity<?> deleteRecepcionItem(@PathVariable Long itemId) {
        try {
            List<Map<String, Object>> itemRows = jdbcTemplate.queryForList("SELECT recepcion_id FROM recepciones_almacen_items WHERE id = ?", itemId);
            if (itemRows.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Ítem no encontrado"));
            }
            Long recId = ((Number) itemRows.get(0).get("RECEPCION_ID")).longValue();

            jdbcTemplate.update("DELETE FROM recepciones_almacen_items WHERE id = ?", itemId);

            // Re-calculate state of reception
            updateRecepcionEstado(recId);

            return ResponseEntity.ok(Map.of("ok", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar ítem: " + e.getMessage()));
        }
    }

    private void updateRecepcionEstado(Long recId) {
        List<Map<String, Object>> items = jdbcTemplate.queryForList("SELECT cantidad_pedida, cantidad_recibida, condicion FROM recepciones_almacen_items WHERE recepcion_id = ?", recId);
        if (items.isEmpty()) {
            jdbcTemplate.update("UPDATE recepciones_almacen SET estado = 'Pendiente' WHERE id = ?", recId);
            return;
        }

        boolean hasDiff = false;
        boolean hasNonConf = false;

        for (Map<String, Object> item : items) {
            Double pedida = ((Number) item.get("CANTIDAD_PEDIDA")).doubleValue();
            Double recibida = ((Number) item.get("CANTIDAD_RECIBIDA")).doubleValue();
            String cond = (String) item.get("CONDICION");

            if (!pedida.equals(recibida)) {
                hasDiff = true;
            }
            if ("No Conforme".equalsIgnoreCase(cond)) {
                hasNonConf = true;
            }
        }

        String newEstado = hasNonConf ? "No Conforme" : (hasDiff ? "Parcial" : "Completa");
        jdbcTemplate.update("UPDATE recepciones_almacen SET estado = ? WHERE id = ?", newEstado, recId);
    }

    // aprob-cxp endpoint will be inside CompraController too
    @PostMapping("/recepciones/{id}/aprobar-cxp")
    @Transactional
    public ResponseEntity<?> aprobarRecepcionCxP(@PathVariable Long id) {
        try {
            // Get Reception
            List<Map<String, Object>> recRows = jdbcTemplate.queryForList("SELECT * FROM recepciones_almacen WHERE id = ?", id);
            if (recRows.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Recepción no encontrada"));
            }
            Map<String, Object> rec = genericDataService.keysToLowerCase(recRows.get(0));

            // Get OC associated
            Map<String, Object> oc = new HashMap<>();
            String ocAsociada = (String) rec.get("oc_asociada");
            if (ocAsociada != null && !ocAsociada.trim().isEmpty()) {
                List<Map<String, Object>> ocRows = jdbcTemplate.queryForList("SELECT * FROM ordenes_compra WHERE codigo = ?", ocAsociada);
                if (!ocRows.isEmpty()) {
                    oc = genericDataService.keysToLowerCase(ocRows.get(0));
                }
            }

            String facturaNum = (String) rec.get("numero_factura");
            if (facturaNum == null || facturaNum.trim().isEmpty()) {
                facturaNum = "FACT-" + rec.get("codigo");
            }

            // Check if factura already exists
            Integer existingCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM cxp WHERE factura = ?", Integer.class, facturaNum);
            if (existingCount != null && existingCount > 0) {
                return ResponseEntity.status(400).body(Map.of("error", "Ya existe una factura registrada con ese número o error al crear"));
            }

            // Prepare insertion values
            String proveedor = rec.get("proveedor") != null ? (String) rec.get("proveedor") : (String) oc.get("proveedor");
            Object emision = rec.get("fecha");
            Object vencimiento = oc.get("vigencia");
            if (vencimiento == null) {
                // Default 30 days after emision date
                java.sql.Date emisionDate;
                if (emision instanceof java.sql.Date) {
                    emisionDate = (java.sql.Date) emision;
                } else if (emision instanceof java.util.Date) {
                    emisionDate = new java.sql.Date(((java.util.Date) emision).getTime());
                } else {
                    emisionDate = new java.sql.Date(System.currentTimeMillis());
                }
                Calendar cal = Calendar.getInstance();
                cal.setTime(emisionDate);
                cal.add(Calendar.DATE, 30);
                vencimiento = new java.sql.Date(cal.getTimeInMillis());
            }

            Double monto = oc.get("monto_total") != null ? ((Number) oc.get("monto_total")).doubleValue() : 0.0;
            Double subtotal = oc.get("subtotal") != null ? ((Number) oc.get("subtotal")).doubleValue() : 0.0;
            Double montoIva = oc.get("monto_iva") != null ? ((Number) oc.get("monto_iva")).doubleValue() : 0.0;
            Double montoIslr = oc.get("monto_islr_retenido") != null ? ((Number) oc.get("monto_islr_retenido")).doubleValue() : 0.0;
            Double montoNeto = oc.get("monto_total") != null ? ((Number) oc.get("monto_total")).doubleValue() : 0.0;
            String moneda = oc.get("moneda") != null ? (String) oc.get("moneda") : "Bs";
            Double tasaCambio = oc.get("tasa_cambio") != null ? ((Number) oc.get("tasa_cambio")).doubleValue() : 1.0;
            String bancoPago = (String) oc.get("banco_pago");

            String insertSql = "INSERT INTO cxp (factura, proveedor, emision, vencimiento, monto, estatus, recepcion_id, oc_codigo, subtotal, monto_iva, monto_islr_retenido, monto_neto, moneda, tasa_cambio, banco_pago) " +
                    "VALUES (?, ?, ?, ?, ?, 'Pendiente', ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(insertSql, facturaNum, proveedor, emision, vencimiento, monto, id, ocAsociada, subtotal, montoIva, montoIslr, montoNeto, moneda, tasaCambio, bancoPago);

            // Update Recepcion
            jdbcTemplate.update("UPDATE recepciones_almacen SET estado = 'Procesada a CxP' WHERE id = ?", id);

            Map<String, Object> createdCxp = genericDataService.keysToLowerCase(jdbcTemplate.queryForMap("SELECT * FROM cxp WHERE factura = ?", facturaNum));
            return ResponseEntity.ok(createdCxp);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al aprobar a CxP: " + e.getMessage()));
        }
    }
}
