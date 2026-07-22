package config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {

    private static String getEnv(String key, String defaultValue) {
        String value = System.getenv(key);
        return (value != null && !value.trim().isEmpty()) ? value : defaultValue;
    }

    public static Connection getConnection() throws SQLException {
        // Conexión local a la base de datos balanceapp
        String url = "jdbc:mysql://localhost:3306/balanceapp?useSSL=false&allowPublicKeyRetrieval=true";
        String user = "admin";
        String password = "my-fer_510";

        return DriverManager.getConnection(url, user, password);
    }
}
