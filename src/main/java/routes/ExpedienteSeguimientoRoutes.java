package routes;

import controllers.ExpedienteSeguimientoController;
import io.javalin.Javalin;

public class ExpedienteSeguimientoRoutes {
    public static void registrar(Javalin app) {
        app.post("/api/seguimiento", ExpedienteSeguimientoController::crearSeguimiento);
        app.get("/api/seguimiento", ExpedienteSeguimientoController::obtenerTodos);
        app.put("/api/seguimiento/{id}", ExpedienteSeguimientoController::actualizarSeguimiento);
        app.delete("/api/seguimiento/{id}", ExpedienteSeguimientoController::eliminarSeguimiento);
    }
}