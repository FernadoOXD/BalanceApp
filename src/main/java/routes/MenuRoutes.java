package routes;

import controllers.MenuController;
import io.javalin.Javalin;

public class MenuRoutes {
    public static void registrar(Javalin app) {
        app.post("/api/menu", MenuController::crearMenu);
        app.get("/api/menu", MenuController::obtenerTodos);
        app.put("/api/menu/{id}", MenuController::actualizarMenu);
        app.delete("/api/menu/{id}", MenuController::eliminarMenu);
    }
}