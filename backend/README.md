# ABHA Enterprise Backend

Spring Boot REST API for ABHA Enterprise platform.

## Prerequisites

- Java 24 JDK
- Maven 3.9+
- PostgreSQL 15+ (or Neon account)
- Firebase project with service account

## Quick Start

### 1. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your actual credentials
nano .env
```

### 2. Configure Application

```bash
# Copy example config
cp src/main/resources/application.yml.example src/main/resources/application.yml

# Edit application.yml with your settings
nano src/main/resources/application.yml
```

### 3. Setup Firebase

1. Download Firebase service account JSON from Firebase Console
2. Save it as `firebase-service-account.json` in backend root
3. Update `FIREBASE_SERVICE_ACCOUNT_PATH` in `.env`

### 4. Run Database Migrations

```bash
mvn flyway:migrate
```

### 5. Build and Run

```bash
# Build
mvn clean package

# Run
mvn spring-boot:run

# Or run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Application will start on `http://localhost:8080`

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api-docs

## Project Structure

```
src/main/java/com/abhaenterprise/
├── AbhaEnterpriseApplication.java    # Main application class
├── common/                            # Common utilities and base classes
├── config/                            # Configuration classes
├── security/                          # Security and authentication
├── users/                             # User management module
├── customers/                         # Customer module
├── products/                          # Product catalogue module
├── inventory/                         # Inventory management
├── orders/                            # Order processing
├── finance/                           # Finance and loans
└── crm/                              # CRM module

src/main/resources/
├── application.yml                    # Main configuration
├── banner.txt                         # Startup banner
└── db/migration/                     # Flyway migration scripts
```

## Development

### Running Tests

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=YourTestClass

# Run with coverage
mvn clean verify
```

### Code Style

- Use constructor injection
- Follow Spring Boot best practices
- Write comprehensive tests
- Use DTOs, never expose entities
- Validate all inputs

### Database Migrations

```bash
# Create new migration
# Create file: V{version}__{description}.sql
# Example: V1.8__add_customer_notes.sql

# Apply migrations
mvn flyway:migrate

# Check migration status
mvn flyway:info

# Repair if needed
mvn flyway:repair
```

## Profiles

- `dev`: Development profile (verbose logging, H2 console)
- `test`: Test profile (H2 in-memory database)
- `prod`: Production profile (optimized settings)

## Health Checks

- Health: http://localhost:8080/actuator/health
- Metrics: http://localhost:8080/actuator/metrics
- Info: http://localhost:8080/actuator/info

## Troubleshooting

### Port already in use
```bash
# Change port in application.yml or use environment variable
PORT=8081 mvn spring-boot:run
```

### Database connection failed
- Check DATABASE_URL, USERNAME, PASSWORD in .env
- Ensure PostgreSQL is running
- Check network/firewall settings

### Firebase authentication not working
- Verify firebase-service-account.json path
- Check FIREBASE_PROJECT_ID matches your project
- Ensure service account has correct permissions

## License

Proprietary - ABHA Enterprise © 2026
