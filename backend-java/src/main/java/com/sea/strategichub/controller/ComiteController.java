package com.sea.strategichub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.sql.PreparedStatement;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ComiteController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/comite/lista")
    @Transactional
    public ResponseEntity<?> createComite(@RequestBody Map<String, Object> body) {
        try {
            String codigo = (String) body.get("codigo");
            String nombre = (String) body.get("nombre");
            Double montoMaxAprob = body.get("monto_max_aprob") != null ? ((Number) body.get("monto_max_aprob")).doubleValue() : null;
            String frecuencia = (String) body.get("frecuencia");
            List<Map<String, Object>> miembros = (List<Map<String, Object>>) body.get("miembros");

            GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(
                        "INSERT INTO comites (codigo, nombre, monto_max_aprob, frecuencia) VALUES (?, ?, ?, ?)",
                        new String[]{"ID"}
                );
                ps.setString(1, codigo);
                ps.setString(2, nombre);
                if (montoMaxAprob != null) {
                    ps.setDouble(3, montoMaxAprob);
                } else {
                    ps.setNull(3, java.sql.Types.DOUBLE);
                }
                ps.setString(4, frecuencia);
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key == null) {
                throw new RuntimeException("No se pudo obtener el ID autogenerado del Comité");
            }
            long comiteId = key.longValue();

            if (miembros != null && !miembros.isEmpty()) {
                String insertMiembroSql = "INSERT INTO miembros_comite (comite_id, nombre, cargo, cedula, email) VALUES (?, ?, ?, ?, ?)";
                for (Map<String, Object> m : miembros) {
                    jdbcTemplate.update(insertMiembroSql,
                            comiteId,
                            m.get("nombre"),
                            m.get("cargo"),
                            m.get("cedula"),
                            m.get("email")
                    );
                }
            }

            return ResponseEntity.status(201).body(Map.of("id", comiteId, "success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear comité: " + e.getMessage()));
        }
    }
}
