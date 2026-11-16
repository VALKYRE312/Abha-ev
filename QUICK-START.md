# ABHA ENTERPRISE - QUICK START GUIDE

Get the project running in 5 minutes! 🚀

---

## ✅ CURRENT STATUS

- **Frontend:** ✅ Running at http://localhost:3000
- **Backend:** ⚠️ Ready (needs Java 21 to compile)

---

## 🎯 FRONTEND (Already Running!)

The frontend is currently running and fully functional:

### View the Application
Open your browser: **http://localhost:3000**

### What You Can See
- ✅ Professional homepage with hero section
- ✅ EV category cards
- ✅ Featured vehicles showcase
- ✅ Finance CTA section
- ✅ Customer testimonials
- ✅ Fully responsive navigation

### If Frontend Stopped
```bash
cd frontend
npm run dev
```

---

## 🔧 BACKEND SETUP (Quick Steps)

### Prerequisites
- Java 21 JDK (NOT Java 24)
- Maven 3.9+

### Step 1: Install Java 21
**Windows (with Chocolatey):**
```powershell
choco install openjdk21
```

**Manual Download:**
- Download from: https://adoptium.net/temurin/releases/?version=21
- Install and set JAVA_HOME environment variable

### Step 2: Verify Java Version
```bash
java -version
# Should show: openjdk version "21.x.x"
```

### Step 3: Build Backend
```bash
cd backend
mvn clean install -DskipTests
```

### Step 4: Run Backend
```bash
mvn spring-boot:run
```

### Step 5: Verify Backend Running
- Backend: http://localhost:8080/actuator/health
- API Docs: http://localhost:8080/swagger-ui.html
- H2 Console: http://localhost:8080/h2-console

---

## 📊 BOTH APPLICATIONS RUNNING

Once both are running:

| Application | URL | Status |
|-------------|-----|--------|
| Frontend | http://localhost:3000 | ✅ Running |
| Backend | http://localhost:8080 | ⏳ Pending Start |
| Swagger UI | http://localhost:8080/swagger-ui.html | ⏳ Pending Start |
| H2 Console | http://localhost:8080/h2-console | ⏳ Pending Start |

---

## 🔍 TESTING THE INTEGRATION

### Test Backend Health
```bash
curl http://localhost:8080/actuator/health
```

Expected response:
```json
{
  "status": "UP"
}
```

### Test Product API
```bash
curl http://localhost:8080/api/v1/products
```

---

## 🛠️ COMMON ISSUES & SOLUTIONS

### Issue 1: Backend Won't Compile
**Error:** `Fatal error compiling: java.lang.ExceptionInInitializerError`

**Solution:** 
- You're using Java 24, but project needs Java 21
- Install Java 21 and set as default
- Verify with: `java -version`

### Issue 2: Port 3000 Already in Use
**Solution:**
```bash
# Stop the current process
npx kill-port 3000

# Or run on different port
PORT=3001 npm run dev
```

### Issue 3: Port 8080 Already in Use
**Solution:**
```bash
# Change port in backend/.env
SERVER_PORT=8081

# Or kill existing process on port 8080
```

### Issue 4: Database Connection Error
**Solution:**
- Project uses H2 in-memory database by default
- No additional setup needed
- Check backend/.env for database config

---

## 🎨 FRONTEND FEATURES TO TRY

1. **Homepage**
   - Scroll through all sections
   - Click category cards
   - View featured vehicles
   - Read testimonials

2. **Navigation**
   - Try mobile menu (resize browser)
   - Click navigation links
   - Test search bar

3. **Responsive Design**
   - Resize browser window
   - Check mobile (< 768px)
   - Check tablet (768px - 1024px)
   - Check desktop (> 1024px)

---

## 🔧 DEVELOPMENT WORKFLOW

### Making Changes

**Frontend Changes:**
1. Edit files in `frontend/app/` or `frontend/components/`
2. Save file
3. Browser auto-refreshes (hot reload)
4. See changes instantly

**Backend Changes:**
1. Edit files in `backend/src/main/java/`
2. Save file
3. Spring Boot DevTools auto-reloads
4. Test API endpoint

### Checking Logs

**Frontend Logs:**
- Check terminal where `npm run dev` is running
- Check browser console (F12)

**Backend Logs:**
- Check terminal where `mvn spring-boot:run` is running
- Logs show at INFO level by default

---

## 📁 PROJECT STRUCTURE AT A GLANCE

```
abha/
├── frontend/              ← Next.js Application (Running ✅)
│   ├── app/              ← Pages and layouts
│   ├── components/       ← Reusable components
│   ├── lib/              ← Utilities and config
│   └── package.json
│
├── backend/              ← Spring Boot Application (Ready ⚠️)
│   ├── src/main/java/   ← Java source code
│   ├── src/main/resources/  ← Config and migrations
│   └── pom.xml
│
├── documentation/        ← Technical documentation
│   ├── 01-PROJECT-AUDIT.md
│   ├── 02-DATABASE-SCHEMA.md
│   ├── 03-JPA-ENTITY-SPECIFICATIONS.md
│   └── 04-REST-API-SPECIFICATION.md
│
├── PROGRESS-SUMMARY.md   ← Development progress tracker
├── QUICK-START.md        ← This file
└── README.md             ← Project overview
```

---

## 🎯 NEXT STEPS AFTER SETUP

Once both applications are running:

1. **View the Homepage**
   - Open http://localhost:3000
   - Explore all sections

2. **Check API Documentation**
   - Open http://localhost:8080/swagger-ui.html
   - Browse available endpoints

3. **Test API Integration**
   - Frontend will automatically connect to backend
   - Product listings will load from API

4. **Start Development**
   - Build catalogue page (Task #9)
   - Create product detail page (Task #10)
   - Implement finance calculator (Task #11)

---

## 📞 NEED HELP?

### Documentation
- See `PROGRESS-SUMMARY.md` for detailed status
- Check `documentation/` folder for specs
- Review `README.md` in each folder

### Quick Checks
```bash
# Check if frontend is running
curl http://localhost:3000

# Check if backend is running
curl http://localhost:8080/actuator/health

# Check Node version
node --version  # Should be 20+

# Check Java version
java -version   # Should be 21

# Check Maven version
mvn --version   # Should be 3.9+
```

---

## 🎉 SUCCESS CHECKLIST

- [ ] Frontend running at http://localhost:3000
- [ ] Homepage loads successfully
- [ ] Navigation works (header, footer)
- [ ] Backend compiles without errors
- [ ] Backend starts successfully
- [ ] Health endpoint returns status UP
- [ ] Swagger UI loads
- [ ] Frontend can fetch from backend API

---

**Ready to build amazing features! 🚀**

*Last Updated: November 14, 2026*
