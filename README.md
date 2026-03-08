## ImtahanProqrami – Full-stack Exam Management

### 1) Verilənlər bazası
1. SQL Server açın (SSMS və ya sqlcmd).
2. Repo kökündəki setup.sql faylını işə salın:
   sqlcmd -S localhost -d master -i setup.sql

### 2) Backend (ASP.NET Core 8 + Dapper)
```
cd ExamProgram/backend/ImtahanAPI
dotnet restore
dotnet run
```
API: http://localhost:5000/api  
Swagger: http://localhost:5000/swagger

### 3) Frontend (Angular 17)
```
cd ExamProgram/frontend/imtahan-ui
npm install
npm start
```
UI: http://localhost:4200

### Qeyd
- Şagirdin sinfi dərsin sinfi ilə uyğun gəlmirsə API 400 qaytarır.
- Qiymət yalnız 1–5 arasında qəbul edilir.
