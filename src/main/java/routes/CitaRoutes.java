package routes;

import controllers.CitaController;
import io.javalin.Javalin;

public class CitaRoutes {
    public static void registrar(Javalin app) {
        // Rutas para la gestión de citas
        app.post("/api/cita", CitaController::agendarCita);
        app.get("/api/cita", CitaController::obtenerTodas);
        app.put("/api/cita/{id}", CitaController::actualizarCita);
        app.delete("/api/cita/{id}", CitaController::eliminarCita);
    }
}