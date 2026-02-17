package com.stockmanagement.infrastructure.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Database configuration using HikariCP connection pool
 * Singleton pattern to ensure single instance
 */
public class DatabaseConfig {
    private static DatabaseConfig instance;
    private final HikariDataSource dataSource;

    private DatabaseConfig() {
        Properties props = loadProperties();
        HikariConfig config = new HikariConfig();
        
        config.setJdbcUrl(props.getProperty("db.url", "jdbc:mysql://localhost:3306/lpa_ecomms"));
        config.setUsername(props.getProperty("db.username", "root"));
        config.setPassword(props.getProperty("db.password", ""));
        config.setDriverClassName(props.getProperty("db.driver", "com.mysql.cj.jdbc.Driver"));
        
        // Connection pool settings
        config.setMaximumPoolSize(Integer.parseInt(props.getProperty("db.pool.size", "10")));
        config.setMinimumIdle(Integer.parseInt(props.getProperty("db.pool.min.idle", "2")));
        config.setConnectionTimeout(Long.parseLong(props.getProperty("db.connection.timeout", "30000")));
        config.setIdleTimeout(Long.parseLong(props.getProperty("db.idle.timeout", "600000")));
        config.setMaxLifetime(Long.parseLong(props.getProperty("db.max.lifetime", "1800000")));
        
        // Performance settings
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        config.addDataSourceProperty("useServerPrepStmts", "true");
        config.addDataSourceProperty("useLocalSessionState", "true");
        config.addDataSourceProperty("rewriteBatchedStatements", "true");
        config.addDataSourceProperty("cacheResultSetMetadata", "true");
        config.addDataSourceProperty("cacheServerConfiguration", "true");
        config.addDataSourceProperty("elideSetAutoCommits", "true");
        config.addDataSourceProperty("maintainTimeStats", "false");
        
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

    public static synchronized DatabaseConfig getInstance() {
        if (instance == null) {
            instance = new DatabaseConfig();
        }
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
