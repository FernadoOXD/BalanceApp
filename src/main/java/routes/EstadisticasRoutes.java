package routes;

import controllers.EstadisticasController;
import io.javalin.Javalin;

public class EstadisticasRoutes {
    public static void registrar(Javalin app) {
        // Rutas para estadísticas del dashboard clínico
        app.get("/api/estadisticas/demografia", EstadisticasController::obtenerDemografia);
        app.get("/api/estadisticas/diagnosticos", EstadisticasController::obtenerDiagnosticos);
        app.get("/api/estadisticas/evolucion/{idPaciente}", EstadisticasController::obtenerEvolucion);
    }
}
