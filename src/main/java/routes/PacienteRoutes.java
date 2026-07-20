package routes;

import controllers.PacienteController;
import io.javalin.Javalin;

public class PacienteRoutes {
    
    public static void registrar(Javalin app) {
        
        app.post("/api/paciente", PacienteController::crearPaciente); 
        app.post("/api/paciente/login", PacienteController::login); 
        app.get("/api/paciente", PacienteController::obtenerTodos);
        app.put("/api/paciente/{id}", PacienteController::actualizarPaciente);
        app.delete("/api/paciente/settings/{id}", PacienteController::eliminarPaciente);
    }
}