package com.sea.strategichub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GenericDataService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final Map<String, String> TABLE_MAP = new HashMap<>();
    static {
        TABLE_MAP.put("proveedores", "PROVEEDORES");
        TABLE_MAP.put("solicitudes", "SOLICITUDES_PROVEEDOR");
        TABLE_MAP.put("evaluacion", "EVALUACIONES_PROVEEDOR");
        TABLE_MAP.put("notificaciones", "NOTIFICACIONES_PROVEEDOR");
        TABLE_MAP.put("documentacion", "DOCUMENTACION_PROVEEDOR");
        TABLE_MAP.put("comite_lista", "COMITES");
        TABLE_MAP.put("comite_miembros", "MIEMBROS_COMITE");
        TABLE_MAP.put("comite_casos", "CASOS_COMITE");
        TABLE_MAP.put("requerimientos", "REQUERIMIENTOS");
        TABLE_MAP.put("presupuestos", "PRESUPUESTOS");
        TABLE_MAP.put("ordenes", "ORDENES_COMPRA");
        TABLE_MAP.put("recepciones", "RECEPCIONES_ALMACEN");
        TABLE_MAP.put("cxp", "CXP");
        TABLE_MAP.put("retenciones", "RETENCIONES");
        TABLE_MAP.put("pagos", "PAGOS");
        TABLE_MAP.put("caja_parametros", "CAJA_CHICA_PARAMETROS");
        TABLE_MAP.put("caja_movimientos", "CAJA_CHICA_MOVIMIENTOS");
        TABLE_MAP.put("caja_soportes", "CAJA_CHICA_SOPORTES");
        TABLE_MAP.put("viaticos_parametros", "VIATICOS_PARAMETROS");
        TABLE_MAP.put("viaticos_solicitud", "VIATICOS");
        TABLE_MAP.put("viaticos_movimientos", "VIATICOS_MOVIMIENTOS");
        TABLE_MAP.put("viaticos_soportes", "VIATICOS_SOPORTES");
        TABLE_MAP.put("compania", "COMPANIA");
        TABLE_MAP.put("parametros_base", "PARAMETROS_BASE");
        TABLE_MAP.put("lista_valores", "LISTA_VALORES");
        TABLE_MAP.put("auditoria", "LOGS_AUDITORIA");
        TABLE_MAP.put("usuarios", "USUARIOS");
        TABLE_MAP.put("roles", "ROLES");
    }

    public String getTableName(String module) {
        return TABLE_MAP.get(module.toLowerCase());
    }

    public List<Map<String, Object>> getModuleData(String module) {
        String tableName = getTableName(module);
        if (tableName == null) {
            throw new IllegalArgumentException("Módulo no encontrado: " + module);
        }
        String sql = "SELECT * FROM " + tableName + " ORDER BY id DESC";
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
        return rows.stream().map(this::keysToLowerCase).collect(Collectors.toList());
    }

    public Map<String, Object> updateModuleData(String module, Long id, Map<String, Object> body) {
        String tableName = getTableName(module);
        if (tableName == null) {
            throw new IllegalArgumentException("Módulo no encontrado: " + module);
        }

        List<String> fields = new ArrayList<>();
        List<Object> values = new ArrayList<>();

        for (Map.Entry<String, Object> entry : body.entrySet()) {
            String key = entry.getKey();
            if (key.equalsIgnoreCase("id") || key.equalsIgnoreCase("created_at")) {
                continue;
            }
            fields.add(key.toUpperCase());
            values.add(entry.getValue());
        }

        if (fields.isEmpty()) {
            throw new IllegalArgumentException("No hay campos para actualizar");
        }

        StringBuilder sql = new StringBuilder("UPDATE " + tableName + " SET ");
        for (int i = 0; i < fields.size(); i++) {
            sql.append(fields.get(i)).append(" = ?");
            if (i < fields.size() - 1) {
                sql.append(", ");
            }
        }
        sql.append(" WHERE id = ?");
        values.add(id);

        jdbcTemplate.update(sql.toString(), values.toArray());

        return getRowById(tableName, id);
    }

    public Map<String, Object> updateTableFields(String tableName, Long id, Map<String, Object> body, List<String> validFields) {
        List<String> fieldsToUpdate = new ArrayList<>();
        List<Object> values = new ArrayList<>();
        for (String field : validFields) {
            if (body.containsKey(field)) {
                fieldsToUpdate.add(field.toUpperCase());
                Object val = body.get(field);
                if (val instanceof Boolean) {
                    val = ((Boolean) val) ? 1 : 0;
                }
                values.add(val);
            }
        }
        if (fieldsToUpdate.isEmpty()) {
            throw new IllegalArgumentException("No hay campos válidos para actualizar");
        }
        StringBuilder sql = new StringBuilder("UPDATE " + tableName + " SET ");
        for (int i = 0; i < fieldsToUpdate.size(); i++) {
            sql.append(fieldsToUpdate.get(i)).append(" = ?");
            if (i < fieldsToUpdate.size() - 1) {
                sql.append(", ");
            }
        }
        sql.append(" WHERE id = ?");
        values.add(id);
        jdbcTemplate.update(sql.toString(), values.toArray());
        return getRowById(tableName, id);
    }

    public Map<String, Object> getRowById(String tableName, Long id) {
        String sql = "SELECT * FROM " + tableName + " WHERE id = ?";
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, id);
        if (rows.isEmpty()) {
            return null;
        }
        return keysToLowerCase(rows.get(0));
    }

    public Map<String, Object> keysToLowerCase(Map<String, Object> map) {
        Map<String, Object> lowerMap = new LinkedHashMap<>();
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            String key = entry.getKey().toLowerCase();
            Object value = entry.getValue();
            // Handle Oracle CLOB conversions if any (optional helper, Oracle LOBs can sometimes be returned as Clob objects)
            if (value instanceof java.sql.Clob) {
                try {
                    java.sql.Clob clob = (java.sql.Clob) value;
                    value = clob.getSubString(1, (int) clob.length());
                } catch (Exception e) {
                    value = value.toString();
                }
            }
            lowerMap.put(key, value);
        }
        return lowerMap;
    }
}
