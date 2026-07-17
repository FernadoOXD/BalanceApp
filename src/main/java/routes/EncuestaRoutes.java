package routes;

import controllers.EncuestaController;
import io.javalin.Javalin;

public class EncuestaRoutes {
    public static void registrar(Javalin app) {
        app.post("/api/encuesta", EncuestaController::crearEncuesta);
        app.get("/api/encuesta", EncuestaController::obtenerTodas);
        app.put("/api/encuesta/{id}", EncuestaController::actualizarEncuesta);
        app.delete("/api/encuesta/{id}", EncuestaController::eliminarEncuesta);
    }
}