package routes;

import controllers.PacienteController;
import io.javalin.Javalin;

public class PacienteRoutes {
    
    public static void registrar(Javalin app) {
        // 1. Rutas principales de registro y autenticación
        app.post("/api/paciente", PacienteController::crearPaciente); 
        app.post("/api/paciente/login", PacienteController::login); 

        // 2. Rutas generales y específicas de consulta
        app.get("/api/paciente", PacienteController::obtenerTodos);
        app.get("/api/paciente/tratamiento/{id}", PacienteController::obtenerTratamientoPorPaciente);

        // 3. Rutas de modificación y eliminación utilizando {id} de manera segura
        app.put("/api/paciente/{id}", PacienteController::actualizarPaciente);
        app.delete("/api/paciente/{id}", PacienteController::eliminarPaciente);
    }
}