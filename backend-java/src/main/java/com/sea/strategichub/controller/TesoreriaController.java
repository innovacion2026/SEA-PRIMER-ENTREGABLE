package com.sea.strategichub.controller;

import com.sea.strategichub.service.GenericDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class TesoreriaController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private GenericDataService genericDataService;

    // ═══════════════════════════════════════════════════════════════
    //  CUENTAS POR PAGAR (CxP)
    // ═══════════════════════════════════════════════════════════════

    @GetMapping("/tesoreria/cxp/{id}")
    public ResponseEntity<?> getCxp(@PathVariable Long id) {
        try {
            Map<String, Object> cxp = genericDataService.getRowById("CXP", id);
            if (cxp == null) {
                return ResponseEntity.status(404).body(Map.of("error", "CxP no encontrada"));
            }

            // Get items from associated OC if exists
            List<Map<String, Object>> items = new ArrayList<>();
            String ocCodigo = (String) cxp.get("oc_codigo");
            if (ocCodigo != null && !ocCodigo.trim().isEmpty()) {
                List<Map<String, Object>> ocRows = jdbcTemplate.queryForList("SELECT id FROM ordenes_compra WHERE codigo = ?", ocCodigo);
                if (!ocRows.isEmpty()) {
                    Long ocId = ((Number) ocRows.get(0).get("ID")).longValue();
                    items = jdbcTemplate.queryForList("SELECT * FROM ordenes_compra_items WHERE oc_id = ? ORDER BY id", ocId)
                            .stream().map(genericDataService::keysToLowerCase).collect(Collectors.toList());
                }
            }
            cxp.put("items", items);
            return ResponseEntity.ok(cxp);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener CxP: " + e.getMessage()));
        }
    }

    @PutMapping("/tesoreria/cxp/{id}")
    public ResponseEntity<?> updateCxp(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            List<String> validFields = List.of("factura","proveedor","emision","vencimiento","subtotal","monto_iva","monto_islr_retenido","monto_neto","monto","estatus","moneda","tasa_cambio","banco_pago","motivo_devolucion");
            Map<String, Object> updated = genericDataService.updateTableFields("CXP", id, body, validFields);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar CxP: " + e.getMessage()));
        }
    }

    @PostMapping("/tesoreria/cxp/{id}/devolver")
    @Transactional
    public ResponseEntity<?> devolverCxp(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            String motivo = (String) body.get("motivo_devolucion");

            jdbcTemplate.update("UPDATE cxp SET estatus = 'Devuelta', motivo_devolucion = ? WHERE id = ?", motivo, id);

            List<Map<String, Object>> rows = jdbcTemplate.queryForList("SELECT recepcion_id FROM cxp WHERE id = ?", id);
            if (!rows.isEmpty() && rows.get(0).get("RECEPCION_ID") != null) {
                Long recId = ((Number) rows.get(0).get("RECEPCION_ID")).longValue();
                jdbcTemplate.update("UPDATE recepciones_almacen SET estado = 'Devuelta' WHERE id = ?", recId);
            }

            return ResponseEntity.ok(Map.of("ok", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al devolver CxP: " + e.getMessage()));
        }
    }

    @PostMapping("/tesoreria/cxp/{id}/pagar")
    @Transactional
    public ResponseEntity<?> pagarCxp(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            String bancoOrigen = (String) body.get("banco_origen");
            String cuentaOrigen = (String) body.get("cuenta_origen");
            String referencia = (String) body.get("referencia");
            String fecha = (String) body.get("fecha");
            String metodo = (String) body.get("metodo");

            jdbcTemplate.update("UPDATE cxp SET estatus = 'Pagada' WHERE id = ?", id);

            Map<String, Object> cxp = genericDataService.getRowById("CXP", id);
            if (cxp == null) {
                return ResponseEntity.status(404).body(Map.of("error", "CxP no encontrada"));
            }

            String ref = referencia != null ? referencia : "REF-" + System.currentTimeMillis();
            String met = metodo != null ? metodo : "Transferencia";
            Object pFecha = fecha != null ? Date.valueOf(fecha) : new Date(System.currentTimeMillis());
            Double monto = cxp.get("monto_neto") != null ? ((Number) cxp.get("monto_neto")).doubleValue() : 0.0;
            String proveedor = (String) cxp.get("proveedor");
            String factura = (String) cxp.get("factura");

            String insertSql = "INSERT INTO pagos (referencia, beneficiario, metodo, fecha, monto, estatus, cxp_id, banco_origen, cuenta_origen, factura_asociada) " +
                    "VALUES (?, ?, ?, ?, ?, 'Completado', ?, ?, ?, ?)";
            jdbcTemplate.update(insertSql, ref, proveedor, met, pFecha, monto, id, bancoOrigen, cuentaOrigen, factura);

            // Fetch newly created payment
            Map<String, Object> createdPago = genericDataService.keysToLowerCase(jdbcTemplate.queryForMap("SELECT * FROM pagos WHERE referencia = ?", ref));
            return ResponseEntity.ok(createdPago);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al aplicar pago: " + e.getMessage()));
        }
    }

    // ═══════════════════════════════════════════════════════════════
    //  PAGOS
    // ═══════════════════════════════════════════════════════════════

    @GetMapping("/tesoreria/pagos/{id}")
    public ResponseEntity<?> getPago(@PathVariable Long id) {
        try {
            Map<String, Object> pago = genericDataService.getRowById("PAGOS", id);
            if (pago == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Pago no encontrado"));
            }
            return ResponseEntity.ok(pago);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener pago: " + e.getMessage()));
        }
    }

    // ═══════════════════════════════════════════════════════════════
    //  VIÁTICOS Y GASTOS (SOPORTES DE RENDICIÓN)
    // ═══════════════════════════════════════════════════════════════

    @PostMapping("/tesoreria/viaticos")
    public ResponseEntity<?> createViatico(@RequestBody Map<String, Object> body) {
        try {
            String codigo = (String) body.get("codigo");
            String solicitante = (String) body.get("solicitante");
            String destino = (String) body.get("destino");
            Object ida = body.get("ida");
            Object regreso = body.get("regreso");
            Double monto = body.get("monto") != null ? ((Number) body.get("monto")).doubleValue() : 0.0;
            String estatus = (String) body.getOrDefault("estatus", "Pendiente");
            String etapa = (String) body.getOrDefault("etapa", "Solicitud");
            String motivo = (String) body.get("motivo");

            String sql = "INSERT INTO viaticos (codigo, solicitante, destino, ida, regreso, monto, estatus, etapa, motivo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, codigo, solicitante, destino, ida != null ? Date.valueOf((String) ida) : null, regreso != null ? Date.valueOf((String) regreso) : null, monto, estatus, etapa, motivo);

            Map<String, Object> created = genericDataService.keysToLowerCase(jdbcTemplate.queryForMap("SELECT * FROM viaticos WHERE codigo = ?", codigo));
            return ResponseEntity.status(201).body(created);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear viático: " + e.getMessage()));
        }
    }

    @PutMapping("/tesoreria/viaticos/{id}/etapa")
    public ResponseEntity<?> updateEtapaViatico(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            String etapa = (String) body.get("etapa");
            jdbcTemplate.update("UPDATE viaticos SET etapa = ? WHERE id = ?", etapa, id);

            Map<String, Object> updated = genericDataService.getRowById("VIATICOS", id);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar etapa de viático: " + e.getMessage()));
        }
    }

    @GetMapping("/tesoreria/viaticos/{id}/gastos")
    public ResponseEntity<?> getGastos(@PathVariable Long id) {
        try {
            String sql = "SELECT id, viatico_id, fecha, categoria, descripcion, monto, factura_nro, archivo_nombre, archivo_tipo FROM rendicion_gastos WHERE viatico_id = ? ORDER BY fecha ASC";
            List<Map<String, Object>> gastos = jdbcTemplate.queryForList(sql, id)
                    .stream().map(genericDataService::keysToLowerCase).collect(Collectors.toList());
            return ResponseEntity.ok(gastos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener gastos: " + e.getMessage()));
        }
    }

    @PostMapping("/tesoreria/viaticos/{id}/gastos")
    public ResponseEntity<?> addGasto(
            @PathVariable Long id,
            @RequestParam(value = "fecha", required = false) String fecha,
            @RequestParam("categoria") String categoria,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("monto") Double monto,
            @RequestParam("factura_nro") String facturaNro,
            @RequestParam(value = "archivo", required = false) MultipartFile file) {
        try {
            Object pFecha = fecha != null ? Date.valueOf(fecha) : new Date(System.currentTimeMillis());
            String fileName = file != null ? file.getOriginalFilename() : null;
            String fileType = file != null ? file.getContentType() : null;
            byte[] fileBytes = file != null ? file.getBytes() : null;

            String insertSql = "INSERT INTO rendicion_gastos (viatico_id, fecha, categoria, descripcion, monto, factura_nro, archivo_nombre, archivo_tipo, archivo_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(insertSql, id, pFecha, categoria, descripcion, monto, facturaNro, fileName, fileType, fileBytes);

            // Fetch newly added gasto (id, fecha, categoria, monto)
            String fetchSql = "SELECT * FROM (SELECT id, fecha, categoria, monto FROM rendicion_gastos WHERE viatico_id = ? ORDER BY id DESC) WHERE ROWNUM = 1";
            Map<String, Object> created = genericDataService.keysToLowerCase(jdbcTemplate.queryForMap(fetchSql, id));
            return ResponseEntity.status(201).body(created);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al registrar gasto: " + e.getMessage()));
        }
    }

    @GetMapping("/rendicion/archivo/{id}")
    public ResponseEntity<byte[]> getArchivo(@PathVariable Long id) {
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList("SELECT archivo_nombre, archivo_tipo, archivo_data FROM rendicion_gastos WHERE id = ?", id);
            if (rows.isEmpty() || rows.get(0).get("ARCHIVO_DATA") == null) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> row = rows.get(0);
            String name = (String) row.get("ARCHIVO_NOMBRE");
            String type = (String) row.get("ARCHIVO_TIPO");
            byte[] bytes = (byte[]) row.get("ARCHIVO_DATA");

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(type != null ? type : "application/octet-stream"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + name + "\"")
                    .body(bytes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
