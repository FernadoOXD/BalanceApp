package config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {

    // Método auxiliar que ya tienes
    private static String getEnv(String key, String defaultValue) {
        String value = System.getenv(key);
        return (value != null && !value.trim().isEmpty()) ? value : defaultValue;
    }

    // Agrega aquí tu método para conectar a RDS
    public static Connection getConnection() throws SQLException {
        String url = "jdbc:mysql://databalanceapp.crxmy6eeuel8.us-east-1.rds.amazonaws.com:3306/databalanceapp?useSSL=true";
        String user = "admin";
        String password = "TU_CONTRASEÑA_DE_RDS"; // Pon aquí la contraseña real de tu base en AWS
        
        return DriverManager.getConnection(url, user, password);
    }
}
