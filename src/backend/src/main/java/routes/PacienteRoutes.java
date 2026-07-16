package routes;

import controllers.PacienteController;
import static io.javalin.apibuilder.ApiBuilder.delete;
import static io.javalin.apibuilder.ApiBuilder.get;
import static io.javalin.apibuilder.ApiBuilder.path;
import static io.javalin.apibuilder.ApiBuilder.post;
import static io.javalin.apibuilder.ApiBuilder.put;

public class PacienteRoutes {
    public static void getRoutes() {
        path("/api", () -> {
            path("/paciente", () -> {
                post(PacienteController::crearPaciente);
                get(PacienteController::obtenerTodos);
                put("/{id}", PacienteController::actualizarPaciente);
                delete("/{id}", PacienteController::eliminarPaciente);
            });
        });
    }
}