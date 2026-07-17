package routes;

import controllers.TratamientoController;
import io.javalin.Javalin;

public class TratamientoRoutes {
    public static void registrar(Javalin app) {
        app.post("/api/tratamiento", TratamientoController::crearTratamiento);
        app.get("/api/tratamiento", TratamientoController::obtenerTodos);
        app.put("/api/tratamiento/{id}", TratamientoController::actualizarTratamiento);
        app.delete("/api/tratamiento/{id}", TratamientoController::eliminarTratamiento);
    }
}