# ImtahanProqrami – Full-stack Exam Management

Orta məktəb şagirdlərinin imtahan nəticələrinin qeydiyyatı üçün tam stack veb tətbiq.

**Stack:** ASP.NET Core 8 · Dapper · MS SQL Server · Angular 17 · TypeScript

---

## Tələblər

| Alət | Versiya |
|------|---------|
| .NET SDK | 8.0+ |
| Node.js | 18+ |
| MS SQL Server | 2019+ və ya SQL Express |
| SSMS (optional) | istənilən |

---

## Quraşdırma və İşə Salma

### 1. Verilənlər Bazası

SSMS-də **New Query** açın, `setup.sql` faylının içindəkiləri yapışdırıb **Execute** edin.

Və ya terminal ilə:
```bash
sqlcmd -S RASHAD\SQLEXPRESS -d master -i setup.sql
```

> `setup.sql` avtomatik yaradır: database, cədvəllər, stored procedure-lər və test məlumatları (4 dərs, 6 şagird, 10 imtahan).

---

### 2. Connection String

`ExamProgram/backend/ImtahanAPI/appsettings.json` faylında server adını öz SQL Server instansiyanıza uyğun dəyişin:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_PC_NAME\\SQLEXPRESS;Database=ImtahanProqrami;Trusted_Connection=True;TrustServerCertificate=True"
}
```

**Ümumi server adları:**

| Quraşdırma növü | Server adı |
|-----------------|-----------|
| SQL Express | `YOUR_PC_NAME\SQLEXPRESS` |
| SQL Developer/Standard | `localhost` |
| SQL LocalDB | `(localdb)\MSSQLLocalDB` |

> SSMS-i açanda "Server name" sahəsindəki dəyər sizin server adınızdır.

---

### 3. Backend

```bash
cd ExamProgram/backend/ImtahanAPI
dotnet restore
dotnet run
```

- API: `http://localhost:5000/api`
- Swagger: `http://localhost:5000/swagger`

---

### 4. Frontend

Yeni terminal açın (backend-i bağlamayın):

```bash
cd ExamProgram/frontend/imtahan-ui
npm install
npm start
```

- UI: `http://localhost:4200`

---

## Layihə Strukturu

```
ExamProgram.slnx
setup.sql
README.md
ExamProgram/
  backend/
    ImtahanAPI/          # ASP.NET Core 8 Web API
      Controllers/       # DerslerController, SagirdlerController, ImtahanlarController
      Data/              # DapperContext
      Models/            # Ders, Sagird, Imtahan
      Repositories/      # Interface + Implementation
      Program.cs
      appsettings.json
  frontend/
    imtahan-ui/          # Angular 17 standalone
      src/app/
        components/      # dashboard, dersler, sagirdler, imtahanlar
        models/          # TypeScript interfaces
        services/        # ApiService, NotificationService
```

---

## API Endpointlər

| Method | URL | Açıqlama |
|--------|-----|---------|
| GET | `/api/dersler` | Bütün dərslər (filterlə) |
| POST | `/api/dersler` | Yeni dərs |
| PUT | `/api/dersler/{kod}` | Dərsi yenilə |
| DELETE | `/api/dersler/{kod}` | Dərsi sil |
| GET | `/api/sagirdler` | Bütün şagirdlər (orta qiymətlə) |
| POST | `/api/sagirdler` | Yeni şagird |
| PUT | `/api/sagirdler/{nomre}` | Şagirdi yenilə |
| DELETE | `/api/sagirdler/{nomre}` | Şagirdi sil |
| GET | `/api/imtahanlar` | Bütün imtahanlar |
| GET | `/api/imtahanlar/ders/{kod}` | Dərslərə görə filter |
| GET | `/api/imtahanlar/sagird/{nomre}` | Şagirdə görə filter |
| POST | `/api/imtahanlar` | Yeni imtahan |
| PUT | `/api/imtahanlar` | İmtahanı yenilə |
| DELETE | `/api/imtahanlar` | İmtahanı sil |

---

## Biznes Qaydaları

- Şagirdin sinfi dərsin sinfi ilə uyğun gəlməlidir — əks halda API `400` qaytarır
- Qiymət yalnız `1–5` arasında qəbul edilir
- Hər şagird üçün orta qiymət avtomatik hesablanır
