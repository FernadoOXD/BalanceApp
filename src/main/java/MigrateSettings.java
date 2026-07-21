import config.Database;
import java.sql.Connection;
import java.sql.Statement;

public class MigrateSettings {
    public static void main(String[] args) {
        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement()) {
            
            System.out.println("Creando tabla CONFIGURACION_ESPECIALISTA...");
            String createTable = "CREATE TABLE IF NOT EXISTS `CONFIGURACION_ESPECIALISTA` (" +
                                 "  `idConfiguracion` int AUTO_INCREMENT PRIMARY KEY," +
                                 "  `datosConfiguracion` json NOT NULL" +
                                 ");";
            stmt.executeUpdate(createTable);
            
            System.out.println("Insertando datos por defecto...");
            String insertDefault = "INSERT INTO `CONFIGURACION_ESPECIALISTA` (`datosConfiguracion`) " +
                                   "SELECT '{\"duration\": 60, \"notifications\": true, \"schedule\": [{\"id\": \"lun\", \"day\": \"Lunes\", \"active\": true, \"start\": \"08:00\", \"end\": \"16:00\"}, {\"id\": \"mar\", \"day\": \"Martes\", \"active\": true, \"start\": \"08:00\", \"end\": \"16:00\"}, {\"id\": \"mie\", \"day\": \"Miércoles\", \"active\": true, \"start\": \"08:00\", \"end\": \"16:00\"}, {\"id\": \"jue\", \"day\": \"Jueves\", \"active\": true, \"start\": \"08:00\", \"end\": \"16:00\"}, {\"id\": \"vie\", \"day\": \"Viernes\", \"active\": true, \"start\": \"08:00\", \"end\": \"16:00\"}, {\"id\": \"sab\", \"day\": \"Sábado\", \"active\": true, \"start\": \"08:00\", \"end\": \"14:00\"}]}' " +
                                   "WHERE NOT EXISTS (SELECT 1 FROM `CONFIGURACION_ESPECIALISTA`);";
            stmt.executeUpdate(insertDefault);
            
            System.out.println("¡Migración completada con éxito!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
