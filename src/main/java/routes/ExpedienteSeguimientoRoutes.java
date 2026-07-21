package routes;

import controllers.ExpedienteSeguimientoController;
import io.javalin.Javalin;

public class ExpedienteSeguimientoRoutes {
    public static void registrar(Javalin app) {
        app.post("/api/seguimiento", ExpedienteSeguimientoController::crearSeguimiento);
        app.get("/api/seguimiento/expediente/{idExpediente}", ExpedienteSeguimientoController::obtenerPorExpediente);
    }
}