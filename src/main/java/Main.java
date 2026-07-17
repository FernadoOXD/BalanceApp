import io.javalin.Javalin;
import routes.CitaRoutes;
import routes.DiagnosticoRoutes;
import routes.EncuestaRoutes;
import routes.ExpedienteNuevoRoutes;
import routes.ExpedienteSeguimientoRoutes;
import routes.PacienteRoutes;
import routes.TratamientoRoutes;

public class Main {
    public static void main(String[] args) {
        Javalin app = Javalin.create(config -> {
            config.bundledPlugins.enableCors(cors -> cors.addRule(it -> it.anyHost()));
        }).start(5000);

        // Llamamos al método registrar que acabamos de simplificar
        PacienteRoutes.registrar(app);
        CitaRoutes.registrar(app);
        EncuestaRoutes.registrar(app);
        DiagnosticoRoutes.registrar(app);
        ExpedienteNuevoRoutes.registrar(app);
        TratamientoRoutes.registrar(app);
        ExpedienteSeguimientoRoutes.registrar(app);
    }
}