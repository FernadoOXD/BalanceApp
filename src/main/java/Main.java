import io.javalin.Javalin;
import routes.CitaRoutes;
import routes.ConfiguracionRoutes;
import routes.DiagnosticoRoutes;
import routes.EncuestaRoutes;
import routes.EstadisticasRoutes;
import routes.ExpedienteNuevoRoutes;
import routes.ExpedienteSeguimientoRoutes;
import routes.MedicionRoutes;
import routes.MenuRoutes;
import routes.PacienteRoutes;
import routes.TratamientoRoutes;

public class Main {

    public static void main(String[] args) {

        // Inicialización del servidor con CORS totalmente abierto a cualquier dominio
        Javalin app = Javalin.create(config -> {
            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(it -> {
                    // Refleja el origen del cliente (permite ddns.net, abrdns.com, vercel, localhost, etc.)
                    it.reflectClientOrigin();
                    it.allowCredentials = true;
                });
            });
        }).start(5000);

        // Registro de todas tus rutas
        PacienteRoutes.registrar(app);
        CitaRoutes.registrar(app);
        DiagnosticoRoutes.registrar(app);
        EncuestaRoutes.registrar(app);
        ExpedienteNuevoRoutes.registrar(app);
        ExpedienteSeguimientoRoutes.registrar(app);
        TratamientoRoutes.registrar(app);
        MedicionRoutes.registrar(app);
        MenuRoutes.registrar(app);
        ConfiguracionRoutes.registrar(app);
        EstadisticasRoutes.registrar(app);

        System.out.println("Servidor iniciado en el puerto 5000 con CORS totalmente habilitado.");
    }
}