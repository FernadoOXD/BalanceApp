package routes;

import controllers.ConfiguracionController;
import io.javalin.Javalin;

public class ConfiguracionRoutes {
    public static void registrar(Javalin app) {
        app.get("/api/configuracion", ConfiguracionController::obtenerConfiguracion);
        app.post("/api/configuracion", ConfiguracionController::guardarConfiguracion);
    }
}
