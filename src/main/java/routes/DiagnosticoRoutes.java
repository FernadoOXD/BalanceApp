package routes;

import controllers.DiagnosticoController;
import io.javalin.Javalin;

public class DiagnosticoRoutes {
    public static void registrar(Javalin app) {
        app.post("/api/diagnostico", DiagnosticoController::crearDiagnostico);
        app.get("/api/diagnostico", DiagnosticoController::obtenerTodos);
        app.put("/api/diagnostico/{id}", DiagnosticoController::actualizarDiagnostico);
        app.delete("/api/diagnostico/{id}", DiagnosticoController::eliminarDiagnostico);
    }
}