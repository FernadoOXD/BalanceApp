package config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {
    // Ajusta estos datos con los de tu MySQL local
    private static final String URL = "jdbc:mysql://localhost:3306/balanceapp";
    private static final String USER = "root"; 
    private static final String PASSWORD = "pochitateamo11/12/2005"; 

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}