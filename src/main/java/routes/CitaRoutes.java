package routes;

import controllers.CitaController;
import io.javalin.Javalin;

public class CitaRoutes {
    public static void registrar(Javalin app) {
        // Rutas para la gestión de citas
        app.post("/api/cita", CitaController::agendarCita);
        app.get("/api/cita", CitaController::obtenerTodas);
        app.get("/api/cita/fecha", CitaController::obtenerCitasPorFecha);
        app.put("/api/cita/{id}", CitaController::actualizarCita);
        app.delete("/api/cita/{id}", CitaController::eliminarCita);
        app.patch("/api/cita/{id}/cancelar", CitaController::cancelarCita);
        app.patch("/api/cita/{id}/concluir", CitaController::concluirCita);
    }
}