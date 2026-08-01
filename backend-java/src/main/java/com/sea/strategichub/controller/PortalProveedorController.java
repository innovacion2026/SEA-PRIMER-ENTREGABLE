package com.sea.strategichub.controller;

import com.sea.strategichub.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/portal")
@CrossOrigin(origins = "*")
public class PortalProveedorController {

    @Autowired
    private EmailService emailService;

    // In-memory mock storage for portal registration, tokens & supplier self-service data
    private final Map<String, Map<String, Object>> expedienteTokens = new ConcurrentHashMap<>();
    private final Map<String, Map<String, Object>> activationTokens = new ConcurrentHashMap<>();
    private final Map<String, Map<String, Object>> proveedoresExpedientes = new ConcurrentHashMap<>();

    @PostMapping("/invitar-proveedor")
    public ResponseEntity<Map<String, Object>> invitarProveedor(@RequestBody Map<String, Object> body) {
        String email = (String) body.getOrDefault("email", "");
        String proveedor = (String) body.getOrDefault("proveedor", "Proveedor Invitado");
        String rif = (String) body.getOrDefault("rif", "");
        String token = "REG-2026-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("email", email);
        data.put("proveedor", proveedor);
        data.put("rif", rif);
        data.put("estado", "Pendiente Registro");

        expedienteTokens.put(token, data);
        emailService.sendRegistroInvitation(email, proveedor, token);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("token", token);
        res.put("message", "Invitación enviada exitosamente por correo");
        return ResponseEntity.ok(res);
    }

    @PostMapping("/validar-token-registro")
    public ResponseEntity<Map<String, Object>> validarTokenRegistro(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        Map<String, Object> data = expedienteTokens.get(token);
        if (data == null) {
            // Generar datos por defecto para demostración fluida
            data = new HashMap<>();
            data.put("token", token);
            data.put("proveedor", "Distribuidora Andina C.A.");
            data.put("rif", "J-30123456-7");
            data.put("email", "contacto@andina.com");
            data.put("contacto", "Carlos Mendoza");
            data.put("telefono", "+58 414 1234567");
        }
        Map<String, Object> res = new HashMap<>();
        res.put("valid", true);
        res.put("data", data);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/enviar-expediente")
    public ResponseEntity<Map<String, Object>> enviarExpediente(@RequestBody Map<String, Object> expediente) {
        String rif = (String) expediente.getOrDefault("rif", "J-00000000-0");
        expediente.put("estatus", "Expediente Recibido");
        expediente.put("fechaRecepcion", new Date().toString());
        proveedoresExpedientes.put(rif, expediente);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Expediente recibido satisfactoriamente por la administración bancaria");
        return ResponseEntity.ok(res);
    }

    @PostMapping("/aprobar-expediente")
    public ResponseEntity<Map<String, Object>> aprobarExpediente(@RequestBody Map<String, Object> body) {
        String email = (String) body.getOrDefault("email", "proveedor@empresa.com");
        String proveedor = (String) body.getOrDefault("proveedor", "Proveedor Aprobado");
        String token = "ACT-2026-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Map<String, Object> act = new HashMap<>();
        act.put("token", token);
        act.put("email", email);
        act.put("proveedor", proveedor);

        activationTokens.put(token, act);
        emailService.sendBienvenidaActivation(email, proveedor, token);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("activationToken", token);
        res.put("message", "Expediente Aprobado. Correo de bienvenida enviado al proveedor.");
        return ResponseEntity.ok(res);
    }

    @PostMapping("/activar-cuenta")
    public ResponseEntity<Map<String, Object>> activarCuenta(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String password = body.get("password");

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Contraseña establecida con éxito. Cuenta activada para acceder al Portal.");
        return ResponseEntity.ok(res);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> loginProveedor(@RequestBody Map<String, String> creds) {
        Map<String, Object> user = new HashMap<>();
        user.put("id", 1);
        user.put("rif", "J-30123456-7");
        user.put("razonSocial", "Distribuidora Andina C.A.");
        user.put("email", creds.getOrDefault("username", "contacto@andina.com"));
        user.put("contacto", "Carlos Mendoza");
        user.put("estatus", "ACTIVO");

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("token", "JWT-SUPPLIER-MOCK-TOKEN-2026");
        res.put("user", user);
        return ResponseEntity.ok(res);
    }

    // --- Consultas del Portal Autogestionable ---

    @GetMapping("/proveedor/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardInfo() {
        Map<String, Object> res = new HashMap<>();
        res.put("facturasPendientesMonto", 24500.00);
        res.put("facturasPendientesCount", 3);
        res.put("pagosMesMonto", 48900.00);
        res.put("ordenesActivasCount", 2);
        res.put("retencionesMesMonto", 3667.50);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/proveedor/ordenes")
    public ResponseEntity<List<Map<String, Object>>> getOrdenesCompra() {
        List<Map<String, Object>> ordenes = new ArrayList<>();
        
        Map<String, Object> o1 = new HashMap<>();
        o1.put("codigo", "OC-2026-0891");
        o1.put("fecha", "2026-05-10");
        o1.put("concepto", "Suministro de Servidores de Alta Disponibilidad");
        o1.put("monto", 15400.00);
        o1.put("estatus", "En Almacén");
        ordenes.add(o1);

        Map<String, Object> o2 = new HashMap<>();
        o2.put("codigo", "OC-2026-0742");
        o2.put("fecha", "2026-04-18");
        o2.put("concepto", "Licenciamiento Anual Base de Datos Oracle");
        o2.put("monto", 9100.00);
        o2.put("estatus", "Recibida Completa");
        ordenes.add(o2);

        return ResponseEntity.ok(ordenes);
    }

    @GetMapping("/proveedor/facturas")
    public ResponseEntity<List<Map<String, Object>>> getFacturas() {
        List<Map<String, Object>> list = new ArrayList<>();

        Map<String, Object> f1 = new HashMap<>();
        f1.put("numeroFactura", "FACT-00921");
        f1.put("control", "00-11244");
        f1.put("fechaEmision", "2026-05-02");
        f1.put("fechaVencimiento", "2026-05-17");
        f1.put("montoTotal", 12450.00);
        f1.put("montoRetenido", 1867.50);
        f1.put("estatus", "Aprobada para Pago");
        list.add(f1);

        Map<String, Object> f2 = new HashMap<>();
        f2.put("numeroFactura", "FACT-00890");
        f2.put("control", "00-11002");
        f2.put("fechaEmision", "2026-04-15");
        f2.put("fechaVencimiento", "2026-04-30");
        f2.put("montoTotal", 18900.00);
        f2.put("montoRetenido", 2835.00);
        f2.put("estatus", "Pagada");
        list.add(f2);

        return ResponseEntity.ok(list);
    }

    @GetMapping("/proveedor/pagos")
    public ResponseEntity<List<Map<String, Object>>> getPagos() {
        List<Map<String, Object>> list = new ArrayList<>();

        Map<String, Object> p1 = new HashMap<>();
        p1.put("referencia", "REF-9982412");
        p1.put("bancoOrigen", "Banco Central / Tesorería");
        p1.put("bancoDestino", "Banco Mercantil (Cuenta **9012)");
        p1.put("fechaPago", "2026-04-30");
        p1.put("montoLiquidado", 16065.00);
        p1.put("estatus", "Procesado Exitosamente");
        list.add(p1);

        return ResponseEntity.ok(list);
    }

    @GetMapping("/proveedor/retenciones")
    public ResponseEntity<List<Map<String, Object>>> getRetenciones() {
        List<Map<String, Object>> list = new ArrayList<>();

        Map<String, Object> r1 = new HashMap<>();
        r1.put("comprobante", "RET-2026-05-0012");
        r1.put("tipo", "Retención IVA (75%)");
        r1.put("periodo", "2026-05");
        r1.put("facturaOrigen", "FACT-00921");
        r1.put("montoBase", 12450.00);
        r1.put("montoRetenido", 1867.50);
        r1.put("fechaEmision", "2026-05-03");
        list.add(r1);

        Map<String, Object> r2 = new HashMap<>();
        r2.put("comprobante", "RET-2026-04-0089");
        r2.put("tipo", "Retención ISLR (2%)");
        r2.put("periodo", "2026-04");
        r2.put("facturaOrigen", "FACT-00890");
        r2.put("montoBase", 18900.00);
        r2.put("montoRetenido", 378.00);
        r2.put("fechaEmision", "2026-04-16");
        list.add(r2);

        return ResponseEntity.ok(list);
    }
}
