package config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {
    
    // Método auxiliar para leer variables de entorno o usar un valor por defecto
    private static String getEnv(String key, String defaultValue) {
        String value = System.getenv(key);
        return (value != null && !value.trim().isEmpty()) ? value : defaultValue;
    }

    private static final String URL = getEnv("DB_URL", "jdbc:mysql://localhost:3306/balanceapp?useSSL=false&serverTimezone=UTC");
    private static final String USER = getEnv("DB_USER", "root"); 
    
    private static final String PASSWORD = getEnv("DB_PASSWORD", "pochitateamo11/12/2005"); 

    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("Driver de MySQL no encontrado", e);
        }
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}