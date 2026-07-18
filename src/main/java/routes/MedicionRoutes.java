package routes;

import controllers.MedicionController;
import io.javalin.Javalin;

public class MedicionRoutes {
    public static void registrar(Javalin app) {
        app.post("/api/medicion", MedicionController::crearMedicion);
        app.get("/api/medicion", MedicionController::obtenerTodas);
        app.put("/api/medicion/{id}", MedicionController::actualizarMedicion);
        app.delete("/api/medicion/{id}", MedicionController::eliminarMedicion);
    }
}