package com.stockmanagement.infrastructure.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Database configuration using HikariCP connection pool
 * Thread-safe Singleton pattern with eager initialization
 * PostgreSQL Configuration
 */
public class DatabaseConfig {
    // Eager initialization ensures thread safety
    private static final DatabaseConfig instance = new DatabaseConfig();
    private final HikariDataSource dataSource;

    private DatabaseConfig() {
        Properties props = loadProperties();
        HikariConfig config = new HikariConfig();
        
        config.setJdbcUrl(props.getProperty("db.url", "jdbc:postgresql://localhost:5433/cti_ecommerce"));
        config.setUsername(props.getProperty("db.username", "cti_user"));
        config.setPassword(props.getProperty("db.password", "cti_password_dev"));
        config.setDriverClassName(props.getProperty("db.driver", "org.postgresql.Driver"));

        // Connection pool settings
        config.setMaximumPoolSize(Integer.parseInt(props.getProperty("db.pool.size", "10")));
        config.setMinimumIdle(Integer.parseInt(props.getProperty("db.pool.min.idle", "2")));
        config.setConnectionTimeout(Long.parseLong(props.getProperty("db.connection.timeout", "30000")));
        config.setIdleTimeout(Long.parseLong(props.getProperty("db.idle.timeout", "600000")));
        config.setMaxLifetime(Long.parseLong(props.getProperty("db.max.lifetime", "1800000")));
        
        // Performance settings for PostgreSQL
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        config.addDataSourceProperty("ApplicationName", "cti-stock-management");

        this.dataSource = new HikariDataSource(config);
    }

    private Properties loadProperties() {
        Properties props = new Properties();
        try (InputStream input = getClass().getClassLoader()
                .getResourceAsStream("database.properties")) {
            if (input != null) {
                props.load(input);
            }
        } catch (IOException e) {
            System.err.println("Could not load database.properties, using defaults");
        }
        return props;
    }

    /**
     * Get singleton instance - thread-safe
     */
    public static DatabaseConfig getInstance() {
        return instance;
    }

    public DataSource getDataSource() {
        return dataSource;
    }

    public void close() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
        }
    }
}
