package com.sea.strategichub.controller;

import com.sea.strategichub.service.GenericDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class GenericDataController {

    @Autowired
    private GenericDataService genericDataService;

    @GetMapping("/data/{module}")
    public ResponseEntity<?> getModuleData(@PathVariable String module) {
        try {
            List<Map<String, Object>> data = genericDataService.getModuleData(module);
            return ResponseEntity.ok(data);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener datos: " + e.getMessage()));
        }
    }

    @PutMapping("/data/{module}/{id}")
    public ResponseEntity<?> updateModuleData(@PathVariable String module, @PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            Map<String, Object> updated = genericDataService.updateModuleData(module, id, body);
            if (updated == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Registro no encontrado"));
            }
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar registro: " + e.getMessage()));
        }
    }
}
