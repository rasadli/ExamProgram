/* Database creation */
IF DB_ID('ImtahanProqrami') IS NULL
BEGIN
    CREATE DATABASE ImtahanProqrami;
END
GO

USE ImtahanProqrami;
GO

/* Tables */
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Dersler')
BEGIN
    CREATE TABLE Dersler
    (
        DersKodu CHAR(3) PRIMARY KEY,
        DersAdi NVARCHAR(30) NOT NULL,
        Sinif INT NOT NULL CHECK (Sinif BETWEEN 1 AND 12),
        MuellimAdi NVARCHAR(20) NOT NULL,
        MuellimSoyadi NVARCHAR(20) NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Sagirdler')
BEGIN
    CREATE TABLE Sagirdler
    (
        Nomresi INT PRIMARY KEY,
        Adi NVARCHAR(30) NOT NULL,
        Soyadi NVARCHAR(30) NOT NULL,
        Sinif INT NOT NULL CHECK (Sinif BETWEEN 1 AND 12)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Imtahanlar')
BEGIN
    CREATE TABLE Imtahanlar
    (
        DersKodu CHAR(3) NOT NULL REFERENCES Dersler(DersKodu),
        SagirdNomresi INT NOT NULL REFERENCES Sagirdler(Nomresi),
        ImtahanTarixi DATETIME2 NOT NULL,
        Qiymet INT NOT NULL CHECK (Qiymet BETWEEN 1 AND 5),
        CONSTRAINT PK_Imtahanlar PRIMARY KEY (DersKodu, SagirdNomresi, ImtahanTarixi)
    );
END
GO

/* Stored procedures */
IF OBJECT_ID('sp_DersElave', 'P') IS NOT NULL DROP PROCEDURE sp_DersElave;
GO
CREATE PROCEDURE sp_DersElave
    @DersKodu CHAR(3),
    @DersAdi NVARCHAR(30),
    @Sinif INT,
    @MuellimAdi NVARCHAR(20),
    @MuellimSoyadi NVARCHAR(20)
AS
BEGIN
    INSERT INTO Dersler (DersKodu, DersAdi, Sinif, MuellimAdi, MuellimSoyadi)
    VALUES (@DersKodu, @DersAdi, @Sinif, @MuellimAdi, @MuellimSoyadi);
END
GO

IF OBJECT_ID('sp_DersYenile', 'P') IS NOT NULL DROP PROCEDURE sp_DersYenile;
GO
CREATE PROCEDURE sp_DersYenile
    @DersKodu CHAR(3),
    @DersAdi NVARCHAR(30),
    @Sinif INT,
    @MuellimAdi NVARCHAR(20),
    @MuellimSoyadi NVARCHAR(20)
AS
BEGIN
    UPDATE Dersler
    SET DersAdi = @DersAdi,
        Sinif = @Sinif,
        MuellimAdi = @MuellimAdi,
        MuellimSoyadi = @MuellimSoyadi
    WHERE DersKodu = @DersKodu;
END
GO

IF OBJECT_ID('sp_DersSil', 'P') IS NOT NULL DROP PROCEDURE sp_DersSil;
GO
CREATE PROCEDURE sp_DersSil
    @DersKodu CHAR(3)
AS
BEGIN
    DELETE FROM Dersler WHERE DersKodu = @DersKodu;
END
GO

IF OBJECT_ID('sp_SagirdElave', 'P') IS NOT NULL DROP PROCEDURE sp_SagirdElave;
GO
CREATE PROCEDURE sp_SagirdElave
    @Nomresi INT,
    @Adi NVARCHAR(30),
    @Soyadi NVARCHAR(30),
    @Sinif INT
AS
BEGIN
    INSERT INTO Sagirdler (Nomresi, Adi, Soyadi, Sinif)
    VALUES (@Nomresi, @Adi, @Soyadi, @Sinif);
END
GO

IF OBJECT_ID('sp_SagirdYenile', 'P') IS NOT NULL DROP PROCEDURE sp_SagirdYenile;
GO
CREATE PROCEDURE sp_SagirdYenile
    @Nomresi INT,
    @Adi NVARCHAR(30),
    @Soyadi NVARCHAR(30),
    @Sinif INT
AS
BEGIN
    UPDATE Sagirdler
    SET Adi = @Adi,
        Soyadi = @Soyadi,
        Sinif = @Sinif
    WHERE Nomresi = @Nomresi;
END
GO

IF OBJECT_ID('sp_SagirdSil', 'P') IS NOT NULL DROP PROCEDURE sp_SagirdSil;
GO
CREATE PROCEDURE sp_SagirdSil
    @Nomresi INT
AS
BEGIN
    DELETE FROM Sagirdler WHERE Nomresi = @Nomresi;
END
GO

IF OBJECT_ID('sp_ImtahanElave', 'P') IS NOT NULL DROP PROCEDURE sp_ImtahanElave;
GO
CREATE PROCEDURE sp_ImtahanElave
    @DersKodu CHAR(3),
    @SagirdNomresi INT,
    @ImtahanTarixi DATETIME2,
    @Qiymet INT
AS
BEGIN
    INSERT INTO Imtahanlar (DersKodu, SagirdNomresi, ImtahanTarixi, Qiymet)
    VALUES (@DersKodu, @SagirdNomresi, @ImtahanTarixi, @Qiymet);
END
GO

IF OBJECT_ID('sp_ImtahanYenile', 'P') IS NOT NULL DROP PROCEDURE sp_ImtahanYenile;
GO
CREATE PROCEDURE sp_ImtahanYenile
    @DersKodu CHAR(3),
    @SagirdNomresi INT,
    @ImtahanTarixi DATETIME2,
    @Qiymet INT
AS
BEGIN
    UPDATE Imtahanlar
    SET Qiymet = @Qiymet
    WHERE DersKodu = @DersKodu
      AND SagirdNomresi = @SagirdNomresi
      AND ImtahanTarixi = @ImtahanTarixi;
END
GO

IF OBJECT_ID('sp_ImtahanSil', 'P') IS NOT NULL DROP PROCEDURE sp_ImtahanSil;
GO
CREATE PROCEDURE sp_ImtahanSil
    @DersKodu CHAR(3),
    @SagirdNomresi INT,
    @ImtahanTarixi DATETIME2
AS
BEGIN
    DELETE FROM Imtahanlar
    WHERE DersKodu = @DersKodu
      AND SagirdNomresi = @SagirdNomresi
      AND ImtahanTarixi = @ImtahanTarixi;
END
GO

/* Seed data */
SET NOCOUNT ON;

IF NOT EXISTS (SELECT 1 FROM Dersler WHERE DersKodu = 'MAT')
    INSERT INTO Dersler VALUES ('MAT', N'Riyaziyyat', 9, N'Kamran', N'Huseynov');
IF NOT EXISTS (SELECT 1 FROM Dersler WHERE DersKodu = 'FIZ')
    INSERT INTO Dersler VALUES ('FIZ', N'Fizika', 9, N'Aygun', N'Mehdiyeva');
IF NOT EXISTS (SELECT 1 FROM Dersler WHERE DersKodu = 'KIM')
    INSERT INTO Dersler VALUES ('KIM', N'Kimya', 10, N'Teymur', N'Quliyev');
IF NOT EXISTS (SELECT 1 FROM Dersler WHERE DersKodu = 'TAR')
    INSERT INTO Dersler VALUES ('TAR', N'Tarix', 8, N'Rena', N'Qafarova');

IF NOT EXISTS (SELECT 1 FROM Sagirdler WHERE Nomresi = 101)
    INSERT INTO Sagirdler VALUES (101, N'Elvin', N'Əliyev', 9);
IF NOT EXISTS (SELECT 1 FROM Sagirdler WHERE Nomresi = 102)
    INSERT INTO Sagirdler VALUES (102, N'Aysel', N'Məmmədova', 9);
IF NOT EXISTS (SELECT 1 FROM Sagirdler WHERE Nomresi = 103)
    INSERT INTO Sagirdler VALUES (103, N'Orxan', N'Sadiqov', 10);
IF NOT EXISTS (SELECT 1 FROM Sagirdler WHERE Nomresi = 104)
    INSERT INTO Sagirdler VALUES (104, N'Ləman', N'Babayev', 8);
IF NOT EXISTS (SELECT 1 FROM Sagirdler WHERE Nomresi = 105)
    INSERT INTO Sagirdler VALUES (105, N'Nurlan', N'Rzayev', 9);
IF NOT EXISTS (SELECT 1 FROM Sagirdler WHERE Nomresi = 106)
    INSERT INTO Sagirdler VALUES (106, N'Amina', N'Quliyeva', 10);

IF NOT EXISTS (SELECT 1 FROM Imtahanlar WHERE DersKodu='MAT' AND SagirdNomresi=101 AND ImtahanTarixi='2025-05-20')
    INSERT INTO Imtahanlar VALUES ('MAT', 101, '2025-05-20', 5);
IF NOT EXISTS (SELECT 1 FROM Imtahanlar WHERE DersKodu='MAT' AND SagirdNomresi=102 AND ImtahanTarixi='2025-05-20')
    INSERT INTO Imtahanlar VALUES ('MAT', 102, '2025-05-20', 4);
IF NOT EXISTS (SELECT 1 FROM Imtahanlar WHERE DersKodu='FIZ' AND SagirdNomresi=101 AND ImtahanTarixi='2025-06-15')
    INSERT INTO Imtahanlar VALUES ('FIZ', 101, '2025-06-15', 3);
IF NOT EXISTS (SELECT 1 FROM Imtahanlar WHERE DersKodu='FIZ' AND SagirdNomresi=105 AND ImtahanTarixi='2025-06-15')
    INSERT INTO Imtahanlar VALUES ('FIZ', 105, '2025-06-15', 5);
IF NOT EXISTS (SELECT 1 FROM Imtahanlar WHERE DersKodu='KIM' AND SagirdNomresi=103 AND ImtahanTarixi='2025-04-18')
    INSERT INTO Imtahanlar VALUES ('KIM', 103, '2025-04-18', 4);
IF NOT EXISTS (SELECT 1 FROM Imtahanlar WHERE DersKodu='KIM' AND SagirdNomresi=106 AND ImtahanTarixi='2025-11-02')
    INSERT INTO Imtahanlar VALUES ('KIM', 106, '2025-11-02', 3);
IF NOT EXISTS (SELECT 1 FROM Imtahanlar WHERE DersKodu='TAR' AND SagirdNomresi=104 AND ImtahanTarixi='2025-03-30')
    INSERT INTO Imtahanlar VALUES ('TAR', 104, '2025-03-30', 5);
IF NOT EXISTS (SELECT 1 FROM Imtahanlar WHERE DersKodu='MAT' AND SagirdNomresi=105 AND ImtahanTarixi='2025-12-10')
    INSERT INTO Imtahanlar VALUES ('MAT', 105, '2025-12-10', 2);
IF NOT EXISTS (SELECT 1 FROM Imtahanlar WHERE DersKodu='KIM' AND SagirdNomresi=103 AND ImtahanTarixi='2026-02-10')
    INSERT INTO Imtahanlar VALUES ('KIM', 103, '2026-02-10', 5);
IF NOT EXISTS (SELECT 1 FROM Imtahanlar WHERE DersKodu='FIZ' AND SagirdNomresi=102 AND ImtahanTarixi='2025-09-05')
    INSERT INTO Imtahanlar VALUES ('FIZ', 102, '2025-09-05', 4);
GO
