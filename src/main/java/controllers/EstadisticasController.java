package controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import config.Database;
import io.javalin.http.Context;

public class EstadisticasController {

    // ==========================================
    // FASE 2: Extracción Optimizada + FASE 3: Motor Matemático
    // ==========================================

    // A. Distribución Normal (Demografía - Edades)
    // GET /api/estadisticas/demografia
    public static void obtenerDemografia(Context ctx) {
        try {
            // Extraer fechas de nacimiento de todos los pacientes
            String sql = "SELECT fechaNacimiento FROM PACIENTE WHERE fechaNacimiento IS NOT NULL";
            List<Integer> edades = new ArrayList<>();
            
            try (Connection conn = Database.getConnection();
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(sql)) {
                
                while (rs.next()) {
                    java.sql.Date fechaNacimiento = rs.getDate("fechaNacimiento");
                    if (fechaNacimiento != null) {
                        int edad = calcularEdad(fechaNacimiento);
                        edades.add(edad);
                    }
                }
            }

            // Motor Matemático: Calcular distribución por rangos
            Map<String, Integer> distribucion = calcularDistribucionEdades(edades);
            
            // Motor Matemático: Calcular media y desviación estándar
            double media = calcularMedia(edades);
            double desviacionEstandar = calcularDesviacionEstandar(edades, media);

            // Respuesta estructurada
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("distribucion", distribucion);
            response.put("media", media);
            response.put("desviacionEstandar", desviacionEstandar);
            response.put("totalMuestra", edades.size());
            
            ctx.status(200).json(response);
        } catch (Exception e) {
            ctx.status(500).json("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // B. Probabilidad y Proporción (Diagnósticos)
    // GET /api/estadisticas/diagnosticos
    public static void obtenerDiagnosticos(Context ctx) {
        try {
            // Extraer conteos agrupados por diagnóstico
            String sql = "SELECT descripcionPrincipal, COUNT(*) as cantidad FROM DIAGNOSTICO GROUP BY descripcionPrincipal";
            List<Map<String, Object>> diagnosticos = new ArrayList<>();
            int totalMuestra = 0;
            
            try (Connection conn = Database.getConnection();
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(sql)) {
                
                while (rs.next()) {
                    Map<String, Object> diagnostico = new HashMap<>();
                    String descripcion = rs.getString("descripcionPrincipal");
                    int cantidad = rs.getInt("cantidad");
                    
                    diagnostico.put("descripcionPrincipal", descripcion);
                    diagnostico.put("frecuenciaAbsoluta", cantidad);
                    
                    diagnosticos.add(diagnostico);
                    totalMuestra += cantidad;
                }
            }

            // Motor Matemático: Calcular frecuencia relativa (porcentaje)
            for (Map<String, Object> diagnostico : diagnosticos) {
                int frecuenciaAbsoluta = (int) diagnostico.get("frecuenciaAbsoluta");
                double frecuenciaRelativa = totalMuestra > 0 ? (double) frecuenciaAbsoluta / totalMuestra : 0;
                double porcentaje = frecuenciaRelativa * 100;
                
                diagnostico.put("frecuenciaRelativa", frecuenciaRelativa);
                diagnostico.put("porcentaje", porcentaje);
            }

            // Respuesta estructurada
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("diagnosticos", diagnosticos);
            response.put("totalMuestra", totalMuestra);
            
            ctx.status(200).json(response);
        } catch (Exception e) {
            ctx.status(500).json("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // C. Análisis de Series Temporales (Evolución de Paciente)
    // GET /api/estadisticas/evolucion/{idPaciente}
    public static void obtenerEvolucion(Context ctx) {
        try {
            int idPaciente = Integer.parseInt(ctx.pathParam("idPaciente"));
            
            // Extraer histórico temporal de mediciones del paciente
            String sql = "SELECT m.fechaMedicion, m.pesoKg, m.porcentajeGrasa " +
                        "FROM MEDICION m " +
                        "JOIN CITA c ON m.idCita = c.idCita " +
                        "WHERE c.idPaciente = ? " +
                        "ORDER BY m.fechaMedicion ASC";
            
            List<Map<String, Object>> mediciones = new ArrayList<>();
            
            try (Connection conn = Database.getConnection();
                 PreparedStatement pstmt = conn.prepareStatement(sql)) {
                
                pstmt.setInt(1, idPaciente);
                ResultSet rs = pstmt.executeQuery();
                
                while (rs.next()) {
                    Map<String, Object> medicion = new HashMap<>();
                    java.sql.Date fecha = rs.getDate("fechaMedicion");
                    medicion.put("fechaMedicion", fecha != null ? fecha.toString() : null);
                    medicion.put("pesoKg", rs.getFloat("pesoKg"));
                    medicion.put("porcentajeGrasa", rs.getFloat("porcentajeGrasa"));
                    mediciones.add(medicion);
                }
            }

            // Motor Matemático: Calcular tasa de cambio
            Map<String, Object> analisis = calcularTasaCambio(mediciones);

            // Respuesta estructurada
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("mediciones", mediciones);
            response.put("analisis", analisis);
            
            ctx.status(200).json(response);
        } catch (Exception e) {
            ctx.status(500).json("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // ==========================================
    // Motor Matemático - Funciones Auxiliares
    // ==========================================

    private static int calcularEdad(java.sql.Date fechaNacimiento) {
        LocalDate fechaNac = fechaNacimiento.toLocalDate();
        LocalDate hoy = LocalDate.now();
        Period periodo = Period.between(fechaNac, hoy);
        return periodo.getYears();
    }

    private static Map<String, Integer> calcularDistribucionEdades(List<Integer> edades) {
        Map<String, Integer> distribucion = new HashMap<>();
        distribucion.put("18-25", 0);
        distribucion.put("26-35", 0);
        distribucion.put("36-45", 0);
        distribucion.put("46-55", 0);
        distribucion.put("56+", 0);

        for (int edad : edades) {
            if (edad >= 18 && edad <= 25) {
                distribucion.put("18-25", distribucion.get("18-25") + 1);
            } else if (edad >= 26 && edad <= 35) {
                distribucion.put("26-35", distribucion.get("26-35") + 1);
            } else if (edad >= 36 && edad <= 45) {
                distribucion.put("36-45", distribucion.get("36-45") + 1);
            } else if (edad >= 46 && edad <= 55) {
                distribucion.put("46-55", distribucion.get("46-55") + 1);
            } else if (edad >= 56) {
                distribucion.put("56+", distribucion.get("56+") + 1);
            }
        }

        return distribucion;
    }

    private static double calcularMedia(List<Integer> valores) {
        if (valores.isEmpty()) return 0;
        
        double suma = 0;
        for (int valor : valores) {
            suma += valor;
        }
        return suma / valores.size();
    }

    private static double calcularDesviacionEstandar(List<Integer> valores, double media) {
        if (valores.isEmpty()) return 0;
        
        double sumaDiferenciasCuadradas = 0;
        for (int valor : valores) {
            double diferencia = valor - media;
            sumaDiferenciasCuadradas += diferencia * diferencia;
        }
        
        double varianza = sumaDiferenciasCuadradas / valores.size();
        return Math.sqrt(varianza);
    }

    private static Map<String, Object> calcularTasaCambio(List<Map<String, Object>> mediciones) {
        Map<String, Object> analisis = new HashMap<>();
        
        if (mediciones.isEmpty()) {
            analisis.put("tasaCambioPeso", 0);
            analisis.put("tasaCambioGrasa", 0);
            analisis.put("tendencia", "Sin datos");
            return analisis;
        }

        // Obtener primer y último registro
        Map<String, Object> primera = mediciones.get(0);
        Map<String, Object> ultima = mediciones.get(mediciones.size() - 1);

        float pesoInicial = (float) primera.get("pesoKg");
        float pesoFinal = (float) ultima.get("pesoKg");
        float grasaInicial = (float) primera.get("porcentajeGrasa");
        float grasaFinal = (float) ultima.get("porcentajeGrasa");

        // Calcular tasa de cambio: Valor Final - Valor Inicial
        float tasaCambioPeso = pesoFinal - pesoInicial;
        float tasaCambioGrasa = grasaFinal - grasaInicial;

        // Determinar tendencia
        String tendencia;
        if (tasaCambioPeso < -0.5) {
            tendencia = "Pérdida de peso significativa";
        } else if (tasaCambioPeso > 0.5) {
            tendencia = "Ganancia de peso";
        } else {
            tendencia = "Estable";
        }

        analisis.put("tasaCambioPeso", tasaCambioPeso);
        analisis.put("tasaCambioGrasa", tasaCambioGrasa);
        analisis.put("tendencia", tendencia);
        analisis.put("pesoInicial", pesoInicial);
        analisis.put("pesoFinal", pesoFinal);
        analisis.put("grasaInicial", grasaInicial);
        analisis.put("grasaFinal", grasaFinal);

        return analisis;
    }
}
