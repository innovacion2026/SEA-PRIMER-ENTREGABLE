package com.sea.strategichub.controller;

import com.sea.strategichub.service.GenericDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class ProveedorController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private GenericDataService genericDataService;

    @PostMapping("/proveedores")
    public ResponseEntity<?> createProveedor(@RequestBody Map<String, Object> body) {
        try {
            String rif = (String) body.get("rif");
            String nombre = (String) body.get("nombre");
            String categoria = (String) body.get("categoria");
            String zona = (String) body.get("zona");
            String contacto = (String) body.get("contacto");
            String telefono = (String) body.get("telefono");
            String estatus = (String) body.getOrDefault("estatus", "Activo");

            String sql = "INSERT INTO proveedores (rif, nombre, categoria, zona, contacto, telefono, estatus) VALUES (?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, rif, nombre, categoria, zona, contacto, telefono, estatus);

            Map<String, Object> created = genericDataService.keysToLowerCase(jdbcTemplate.queryForMap("SELECT * FROM proveedores WHERE rif = ?", rif));
            return ResponseEntity.status(201).body(created);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear proveedor: " + e.getMessage()));
        }
    }

    @PostMapping("/solicitudes-proveedor")
    public ResponseEntity<?> createSolicitudProveedor(@RequestBody Map<String, Object> body) {
        try {
            String codigo = (String) body.get("codigo");
            String proveedor = (String) body.get("proveedor");
            String rif = (String) body.get("rif");
            String contacto = (String) body.get("contacto");
            String telefono = (String) body.get("telefono");
            String email = (String) body.get("email");
            Object fecha = body.get("fecha");
            String tipo = (String) body.get("tipo");
            String etapa = (String) body.get("etapa");
            String estatus = (String) body.getOrDefault("estatus", "En revisión");

            java.sql.Date sqlDate = fecha != null ? java.sql.Date.valueOf((String) fecha) : new java.sql.Date(System.currentTimeMillis());

            String sql = "INSERT INTO solicitudes_proveedor (codigo, proveedor, rif, contacto, telefono, email, fecha, tipo, etapa, estatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, codigo, proveedor, rif, contacto, telefono, email, sqlDate, tipo, etapa, estatus);

            Map<String, Object> created = genericDataService.keysToLowerCase(jdbcTemplate.queryForMap("SELECT * FROM solicitudes_proveedor WHERE codigo = ?", codigo));
            return ResponseEntity.status(201).body(created);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear solicitud de proveedor: " + e.getMessage()));
        }
    }

    @GetMapping("/proveedores/{id}")
    public ResponseEntity<?> getProveedor(@PathVariable Long id) {
        try {
            Map<String, Object> p = genericDataService.getRowById("PROVEEDORES", id);
            if (p == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Proveedor no encontrado"));
            }
            return ResponseEntity.ok(p);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener proveedor: " + e.getMessage()));
        }
    }

    @GetMapping("/solicitudes-proveedor/{id}")
    public ResponseEntity<?> getSolicitudProveedor(@PathVariable Long id) {
        try {
            Map<String, Object> s = genericDataService.getRowById("SOLICITUDES_PROVEEDOR", id);
            if (s == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Solicitud no encontrada"));
            }
            return ResponseEntity.ok(s);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener solicitud: " + e.getMessage()));
        }
    }

    @PutMapping("/proveedores/{id}")
    public ResponseEntity<?> updateProveedor(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            List<String> validFields = List.of("rif", "nombre", "categoria", "zona", "contacto", "telefono", "evaluacion", "estatus", "fecha_ingreso");
            Map<String, Object> updated = genericDataService.updateTableFields("PROVEEDORES", id, body, validFields);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar proveedor: " + e.getMessage()));
        }
    }

    @PutMapping("/solicitudes-proveedor/{id}")
    @Transactional
    public ResponseEntity<?> updateSolicitudProveedor(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            if (body.containsKey("nombre") && !body.containsKey("proveedor")) {
                body.put("proveedor", body.get("nombre"));
            }

            List<String> validFields = List.of("codigo", "proveedor_id", "proveedor", "rif", "contacto", "telefono", "email", "fecha", "tipo", "etapa", "estatus", "categoria");
            Map<String, Object> updated = genericDataService.updateTableFields("SOLICITUDES_PROVEEDOR", id, body, validFields);

            String etapa = (String) updated.get("etapa");
            String rif = (String) updated.get("rif");
            String proveedor = (String) updated.get("proveedor");
            String contacto = (String) updated.get("contacto");
            String telefono = (String) updated.get("telefono");
            String categoria = (String) updated.get("categoria");

            // Auto-promotion to Directorio if phase is 'Alta en SEA'
            if ("Alta en SEA".equalsIgnoreCase(etapa)) {
                try {
                    List<Map<String, Object>> check = jdbcTemplate.queryForList("SELECT id FROM proveedores WHERE rif = ?", rif);
                    if (check.isEmpty()) {
                        String insertSql = "INSERT INTO proveedores (rif, nombre, contacto, telefono, estatus, fecha_ingreso, categoria) VALUES (?, ?, ?, ?, 'Activo', SYSDATE, ?)";
                        jdbcTemplate.update(insertSql, rif, proveedor, contacto, telefono, categoria);
                        System.out.println("Proveedor " + proveedor + " promovido al directorio con éxito.");
                    }
                } catch (Exception promoErr) {
                    System.err.println("Error en promoción automática: " + promoErr.getMessage());
                }
            }

            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar solicitud: " + e.getMessage()));
        }
    }
}
