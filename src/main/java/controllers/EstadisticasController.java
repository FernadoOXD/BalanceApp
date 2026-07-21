package controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import config.Database;
import io.javalin.http.Context;

public class EstadisticasController {

    // ==========================================
    // A. Distribución Normal (Demografía - Edades)
    // ==========================================
    public static void obtenerDemografia(Context ctx) {
        try {
            // Consulta apuntando directo a EXPEDIENTE_NUEVO leyendo la edad
            String sql = "SELECT edad FROM EXPEDIENTE_NUEVO WHERE edad IS NOT NULL AND edad != ''";
            List<Integer> edades = new ArrayList<>();
            
            try (Connection conn = Database.getConnection();
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(sql)) {
                
                while (rs.next()) {
                    try {
                        int edadPaciente = Integer.parseInt(rs.getString("edad"));
                        edades.add(edadPaciente);
                    } catch (NumberFormatException e) {
                        System.out.println("Edad omitida por formato inválido: " + e.getMessage());
                    }
                }
            }

            Map<String, Integer> distribucion = calcularDistribucionEdades(edades);
            double media = calcularMedia(edades);
            double desviacionEstandar = calcularDesviacionEstandar(edades, media);

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

    // ==========================================
    // B. Probabilidad y Proporción (Diagnósticos)
    // ==========================================
    public static void obtenerDiagnosticos(Context ctx) {
        try {
            // Usando patologiaPrevia como Diagnóstico principal
            String sql = 
                "SELECT patologiaPrevia AS descripcionPrincipal, COUNT(*) as cantidad " +
                "FROM EXPEDIENTE_NUEVO " +
                "WHERE patologiaPrevia IS NOT NULL " +
                "  AND patologiaPrevia != '' " +
                "  AND patologiaPrevia != 'Ninguna' " +
                "GROUP BY patologiaPrevia " +
                "ORDER BY cantidad DESC " +
                "LIMIT 5"; 
                
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

            for (Map<String, Object> diagnostico : diagnosticos) {
                int frecuenciaAbsoluta = (int) diagnostico.get("frecuenciaAbsoluta");
                double frecuenciaRelativa = totalMuestra > 0 ? (double) frecuenciaAbsoluta / totalMuestra : 0;
                double porcentaje = frecuenciaRelativa * 100;
                
                diagnostico.put("frecuenciaRelativa", frecuenciaRelativa);
                diagnostico.put("porcentaje", porcentaje);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("diagnosticos", diagnosticos);
            response.put("totalMuestra", totalMuestra);
            
            ctx.status(200).json(response);
        } catch (Exception e) {
            ctx.status(500).json("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // ==========================================
    // C. Evolución (Para que las rutas no fallen)
    // ==========================================
    public static void obtenerEvolucion(Context ctx) {
        try {
            int idPaciente = Integer.parseInt(ctx.pathParam("idPaciente"));
            String sql = "SELECT m.fechaMedicion, m.pesoKg, m.porcentajeGrasa " +
                        "FROM MEDICION m " +
                        "JOIN CITA c ON m.idCita = c.idCita " +
                        "WHERE c.idPaciente = ? ORDER BY m.fechaMedicion ASC";
            
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

            Map<String, Object> analisis = calcularTasaCambio(mediciones);
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
    // Funciones Auxiliares
    // ==========================================
    private static Map<String, Integer> calcularDistribucionEdades(List<Integer> edades) {
        Map<String, Integer> distribucion = new HashMap<>();
        distribucion.put("18-25", 0);
        distribucion.put("26-35", 0);
        distribucion.put("36-45", 0);
        distribucion.put("46-55", 0);
        distribucion.put("56+", 0);

        for (int edad : edades) {
            if (edad >= 18 && edad <= 25) distribucion.put("18-25", distribucion.get("18-25") + 1);
            else if (edad >= 26 && edad <= 35) distribucion.put("26-35", distribucion.get("26-35") + 1);
            else if (edad >= 36 && edad <= 45) distribucion.put("36-45", distribucion.get("36-45") + 1);
            else if (edad >= 46 && edad <= 55) distribucion.put("46-55", distribucion.get("46-55") + 1);
            else if (edad >= 56) distribucion.put("56+", distribucion.get("56+") + 1);
        }
        return distribucion;
    }

    private static double calcularMedia(List<Integer> valores) {
        if (valores.isEmpty()) return 0;
        double suma = 0;
        for (int valor : valores) suma += valor;
        return suma / valores.size();
    }

    private static double calcularDesviacionEstandar(List<Integer> valores, double media) {
        if (valores.isEmpty()) return 0;
        double sumaDiferenciasCuadradas = 0;
        for (int valor : valores) {
            double diferencia = valor - media;
            sumaDiferenciasCuadradas += diferencia * diferencia;
        }
        return Math.sqrt(sumaDiferenciasCuadradas / valores.size());
    }

    private static Map<String, Object> calcularTasaCambio(List<Map<String, Object>> mediciones) {
        Map<String, Object> analisis = new HashMap<>();
        if (mediciones.isEmpty()) {
            analisis.put("tasaCambioPeso", 0);
            analisis.put("tasaCambioGrasa", 0);
            analisis.put("tendencia", "Sin datos");
            return analisis;
        }
        Map<String, Object> primera = mediciones.get(0);
        Map<String, Object> ultima = mediciones.get(mediciones.size() - 1);

        float pesoInicial = (float) primera.get("pesoKg");
        float pesoFinal = (float) ultima.get("pesoKg");
        float grasaInicial = (float) primera.get("porcentajeGrasa");
        float grasaFinal = (float) ultima.get("porcentajeGrasa");

        float tasaCambioPeso = pesoFinal - pesoInicial;
        float tasaCambioGrasa = grasaFinal - grasaInicial;

        String tendencia;
        if (tasaCambioPeso < -0.5) tendencia = "Pérdida de peso significativa";
        else if (tasaCambioPeso > 0.5) tendencia = "Ganancia de peso";
        else tendencia = "Estable";

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