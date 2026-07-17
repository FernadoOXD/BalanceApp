package routes;

import controllers.PacienteController;
import io.javalin.Javalin;

public class PacienteRoutes {
    
    public static void registrar(Javalin app) {
        // Registro directo, sin ApiBuilder, sin routes(), sin complicaciones.
        app.post("/api/paciente", PacienteController::crearPaciente);
        app.get("/api/paciente", PacienteController::obtenerTodos);
        app.put("/api/paciente/{id}", PacienteController::actualizarPaciente);
        app.delete("/api/paciente/{id}", PacienteController::eliminarPaciente);
    }
}