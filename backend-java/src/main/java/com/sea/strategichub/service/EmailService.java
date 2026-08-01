package com.sea.strategichub.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendRegistroInvitation(String toEmail, String proveedorNombre, String token) {
        String url = "http://localhost:4201/registro-inicial?token=" + token;
        System.out.println("================================================================================");
        System.out.println("📬 SIMULACIÓN DE ENVÍO DE CORREO ELECTRONICO [SEA BANCO - INVITACIÓN DE REGISTRO]");
        System.out.println("Para: " + toEmail);
        System.out.println("Asunto: Invitación a completar Expediente de Contratación - SEA Banco");
        System.out.println("Mensaje: Estimado(a) " + proveedorNombre + ", ha sido invitado por el departamento");
        System.out.println("de administración para completar sus datos fiscales, bancarios y recaudos.");
        System.out.println("Enlace de Registro: " + url);
        System.out.println("================================================================================");
    }

    public void sendBienvenidaActivation(String toEmail, String proveedorNombre, String token) {
        String url = "http://localhost:4201/cambiar-password?token=" + token;
        System.out.println("================================================================================");
        System.out.println("🎉 SIMULACIÓN DE ENVÍO DE CORREO ELECTRONICO [SEA BANCO - ACTIVACIÓN DE CUENTA]");
        System.out.println("Para: " + toEmail);
        System.out.println("Asunto: ¡Expediente Aprobado! Establezca su contraseña de acceso al Portal");
        System.out.println("Mensaje: Estimado(a) " + proveedorNombre + ", su expediente de contratación ha sido");
        System.out.println("APROBADO satisfactoriamente por la administración bancaria.");
        System.out.println("Enlace de Activación: " + url);
        System.out.println("================================================================================");
    }
}
