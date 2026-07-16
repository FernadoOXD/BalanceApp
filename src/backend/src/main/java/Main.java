import io.javalin.Javalin;
import routes.PacienteRoutes;

public class Main {
    public static void main(String[] args) {
        Javalin app = Javalin.create(config -> {
            config.bundledPlugins.enableCors(cors -> cors.addRule(it -> it.anyHost()));
        }).start(5000);

        app.routes(() -> {
            PacienteRoutes.getRoutes();
        });
    }
}