import io.javalin.Javalin;
import routes.CitaRoutes;
import routes.DiagnosticoRoutes;
import routes.EncuestaRoutes;
import routes.ExpedienteNuevoRoutes;
import routes.ExpedienteSeguimientoRoutes;
import routes.MedicionRoutes;
import routes.MenuRoutes;
import routes.PacienteRoutes;
import routes.TratamientoRoutes;
import routes.ConfiguracionRoutes;
import routes.EstadisticasRoutes;

public class Main {
    public static void main(String[] args) {
        
        // Inicialización del servidor con CORS configurado para producción y pruebas locales
        Javalin app = Javalin.create(config -> {
            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(it -> {
                    // Permite peticiones desde el frontend oficial desplegado
                    it.allowHost("balance-app-frontend.vercel.app");
                    // Permite peticiones locales desde la extensión Live Server de VS Code (puerto 5500)
                    it.allowHost("http://localhost:5500");
                    it.allowHost("http://127.0.0.1:5500");
                    // Permite peticiones locales adicionales (puerto 5501)
                    it.allowHost("http://localhost:5501");
                    it.allowHost("http://127.0.0.1:5501");
<<<<<<< HEAD
                    
=======
>>>>>>> d87cf5703ec693fa2c3c1b47923e124d054bc0e8
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
        
        System.out.println("Servidor iniciado en el puerto 5000 con CORS habilitado para Vercel y Live Server (Local).");
    }
}