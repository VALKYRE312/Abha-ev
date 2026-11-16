package com.abhaenterprise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * ABHA Enterprise Backend Application
 * 
 * Main entry point for the Spring Boot application.
 * This application provides REST APIs for the ABHA Enterprise
 * electric vehicle commerce and business management platform.
 * 
 * @author ABHA Enterprise Dev Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaRepositories
@EnableJpaAuditing
public class AbhaEnterpriseApplication {

    public static void main(String[] args) {
        SpringApplication.run(AbhaEnterpriseApplication.class, args);
    }
}
