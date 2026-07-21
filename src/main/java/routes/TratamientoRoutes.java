package routes;

import controllers.TratamientoController;
import io.javalin.Javalin;

public class TratamientoRoutes {
    public static void registrar(Javalin app) {
        app.post("/api/tratamiento", TratamientoController::crearTratamiento);
        app.get("/api/tratamiento", TratamientoController::obtenerTodos);
        app.put("/api/tratamiento/{id}", TratamientoController::actualizarTratamiento);
        
        // Rutas para tus modales
        app.put("/api/tratamiento/{id}/menu", TratamientoController::actualizarMenu);
        app.put("/api/tratamiento/{id}/ejercicio", TratamientoController::actualizarEjercicio);
        
        app.delete("/api/tratamiento/{id}", TratamientoController::eliminarTratamiento);
    }
}