# ABHA ENTERPRISE
## Electric Vehicle Commerce & Business Management Platform

**Version:** 1.0.0  
**Status:** In Development

---

## Overview

ABHA Enterprise is a unified digital platform for electric vehicle dealership operations, combining:
- Customer-facing EV ecommerce website
- EV financing enquiry and application management
- Comprehensive enterprise administration portal
- Inventory and warehouse management
- CRM and business operations

---

## Technology Stack

### Backend
- **Java:** 24
- **Framework:** Spring Boot 3.2.x
- **Database:** PostgreSQL 15+ (Neon managed)
- **ORM:** Hibernate 6.4.x + Spring Data JPA
- **Migrations:** Flyway
- **Authentication:** Firebase Admin SDK
- **Build Tool:** Maven 3.9+

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript 5+
- **Styling:** Tailwind CSS 3+
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Forms:** React Hook Form + Zod

### Infrastructure
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Railway / AWS
- **Database:** Neon PostgreSQL
- **File Storage:** Cloudinary (public) + S3 (private)
- **Authentication:** Firebase Authentication

---

## Project Structure

```
abha-enterprise/
├── frontend/               # Next.js application
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── features/          # Feature-specific modules
│   ├── lib/               # Utilities and configs
│   ├── services/          # API services
│   └── types/             # TypeScript types
│
├── backend/               # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/abhaenterprise/
│   │   │   │   ├── common/
│   │   │   │   ├── security/
│   │   │   │   ├── users/
│   │   │   │   ├── customers/
│   │   │   │   ├── products/
│   │   │   │   ├── inventory/
│   │   │   │   ├── orders/
│   │   │   │   ├── finance/
│   │   │   │   └── crm/
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── db/migration/
│   │   └── test/
│   └── pom.xml
│
└── documentation/         # Architecture & API docs
```

---

## Quick Start

### Prerequisites
- Java 24 JDK
- Node.js 20+ and npm
- PostgreSQL 15+ (or Neon account)
- Maven 3.9+
- Firebase project

### Backend Setup

```bash
cd backend

# Configure environment variables
cp src/main/resources/application.yml.example src/main/resources/application.yml
# Edit application.yml with your database and Firebase credentials

# Run migrations
mvn flyway:migrate

# Start the backend
mvn spring-boot:run
```

Backend will run on `http://localhost:8080`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your API URL and Firebase config

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## Development Guidelines

### Backend
- Follow Spring Boot best practices
- Use constructor injection (no field injection)
- Never expose entities directly - use DTOs
- Validate all inputs with Jakarta Bean Validation
- Implement service-layer transactions
- Use Spring Data JPA for data access
- Write unit tests for services
- Use MapStruct for entity-DTO mapping

### Frontend
- Use TypeScript strictly
- Follow Next.js 14 App Router conventions
- Use Server Components by default
- Use Client Components only when needed
- Implement proper error boundaries
- Use React Hook Form for forms
- Validate with Zod schemas
- Keep components small and focused
- Use shadcn/ui for consistent UI

### Database
- All schema changes via Flyway migrations
- Never modify existing migrations
- Use descriptive migration names
- Test migrations before committing
- Keep migrations reversible where possible

### Security
- Never commit secrets or credentials
- Use environment variables
- Validate all user inputs
- Check permissions at service layer
- Log security-relevant events
- Use parameterized queries
- Sanitize outputs

---

## Environment Variables

### Backend (.env or application.yml)
```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}

firebase:
  credentials: ${FIREBASE_SERVICE_ACCOUNT_PATH}
  project-id: ${FIREBASE_PROJECT_ID}

cloudinary:
  cloud-name: ${CLOUDINARY_CLOUD_NAME}
  api-key: ${CLOUDINARY_API_KEY}
  api-secret: ${CLOUDINARY_API_SECRET}
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

---

## Testing

### Backend
```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=UserServiceTest

# Run with coverage
mvn clean verify
```

### Frontend
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

---

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Backend (Railway)
1. Create new Railway project
2. Connect PostgreSQL database
3. Configure environment variables
4. Deploy from GitHub

---

## API Documentation

- REST API docs: `/documentation/04-REST-API-SPECIFICATION.md`
- OpenAPI/Swagger: `http://localhost:8080/swagger-ui.html` (when backend running)
- Postman collection: Coming soon

---

## Database Schema

- Schema documentation: `/documentation/02-DATABASE-SCHEMA.md`
- ER diagram: `/documentation/02-DATABASE-SCHEMA.md#entity-relationship-diagram`
- Migrations: `/backend/src/main/resources/db/migration/`

---

## Contributing

1. Create feature branch from `develop`
2. Follow code style guidelines
3. Write tests for new features
4. Update documentation
5. Create pull request

---

## License

Proprietary - ABHA Enterprise © 2026

---

## Support

For questions or issues:
- Email: dev@abhaenterprise.com
- Documentation: `/documentation/`

---

**Built with ❤️ for the electric vehicle revolution**
