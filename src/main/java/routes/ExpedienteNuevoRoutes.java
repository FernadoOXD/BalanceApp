package routes;

import controllers.ExpedienteNuevoController;
import io.javalin.Javalin;

public class ExpedienteNuevoRoutes {
    public static void registrar(Javalin app) {
        app.post("/api/expediente", ExpedienteNuevoController::crearExpediente);
        app.get("/api/expediente", ExpedienteNuevoController::obtenerTodos);
        app.get("/api/expediente/{pacienteId}", ExpedienteNuevoController::obtenerPorPaciente);
        app.put("/api/expediente/{id}", ExpedienteNuevoController::actualizarExpediente);
        app.delete("/api/expediente/{id}", ExpedienteNuevoController::eliminarExpediente);
    }
}