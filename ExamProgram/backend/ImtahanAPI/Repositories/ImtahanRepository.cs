using Dapper;
using ImtahanAPI.Data;
using ImtahanAPI.Models;

namespace ImtahanAPI.Repositories
{
    public class ImtahanRepository : IImtahanRepository
    {
        private readonly DapperContext _context;

        public ImtahanRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Imtahan>> GetAllAsync()
        {
            using var connection = _context.CreateConnection();
            const string sql = "SELECT * FROM Imtahanlar ORDER BY ImtahanTarixi DESC";
            return await connection.QueryAsync<Imtahan>(sql);
        }

        public async Task<IEnumerable<Imtahan>> GetByDersAsync(string dersKodu)
        {
            using var connection = _context.CreateConnection();
            const string sql = "SELECT * FROM Imtahanlar WHERE DersKodu = @DersKodu ORDER BY ImtahanTarixi DESC";
            return await connection.QueryAsync<Imtahan>(sql, new { DersKodu = dersKodu });
        }

        public async Task<IEnumerable<Imtahan>> GetBySagirdAsync(int sagirdNomresi)
        {
            using var connection = _context.CreateConnection();
            const string sql = "SELECT * FROM Imtahanlar WHERE SagirdNomresi = @SagirdNomresi ORDER BY ImtahanTarixi DESC";
            return await connection.QueryAsync<Imtahan>(sql, new { SagirdNomresi = sagirdNomresi });
        }

        public async Task<(bool Success, string? Error)> CreateAsync(Imtahan imtahan)
        {
            using var connection = _context.CreateConnection();

            var sinifDers = await connection.QueryFirstOrDefaultAsync<int?>(
                "SELECT Sinif FROM Dersler WHERE DersKodu = @DersKodu", new { imtahan.DersKodu });
            var sinifSagird = await connection.QueryFirstOrDefaultAsync<int?>(
                "SELECT Sinif FROM Sagirdler WHERE Nomresi = @Nomre", new { Nomre = imtahan.SagirdNomresi });

            if (!sinifDers.HasValue || !sinifSagird.HasValue)
            {
                return (false, "Ders və ya şagird tapılmadı.");
            }

            if (sinifDers.Value != sinifSagird.Value)
            {
                return (false, $"Şagirdin sinifi ({sinifSagird.Value}) dərsin sinifi ({sinifDers.Value}) ilə uyğun gəlmir.");
            }

            var rows = await connection.ExecuteAsync("sp_ImtahanElave", new
            {
                imtahan.DersKodu,
                imtahan.SagirdNomresi,
                imtahan.ImtahanTarixi,
                imtahan.Qiymet
            }, commandType: System.Data.CommandType.StoredProcedure);

            return rows > 0 ? (true, null) : (false, "İmtahan əlavə edilə bilmədi.");
        }

        public async Task<(bool Success, string? Error)> UpdateAsync(Imtahan imtahan)
        {
            using var connection = _context.CreateConnection();

            var sinifDers = await connection.QueryFirstOrDefaultAsync<int?>(
                "SELECT Sinif FROM Dersler WHERE DersKodu = @DersKodu", new { imtahan.DersKodu });
            var sinifSagird = await connection.QueryFirstOrDefaultAsync<int?>(
                "SELECT Sinif FROM Sagirdler WHERE Nomresi = @Nomre", new { Nomre = imtahan.SagirdNomresi });

            if (!sinifDers.HasValue || !sinifSagird.HasValue)
            {
                return (false, "Ders və ya şagird tapılmadı.");
            }

            if (sinifDers.Value != sinifSagird.Value)
            {
                return (false, $"Şagirdin sinifi ({sinifSagird.Value}) dərsin sinifi ({sinifDers.Value}) ilə uyğun gəlmir.");
            }

            var rows = await connection.ExecuteAsync("sp_ImtahanYenile", new
            {
                imtahan.DersKodu,
                imtahan.SagirdNomresi,
                imtahan.ImtahanTarixi,
                imtahan.Qiymet
            }, commandType: System.Data.CommandType.StoredProcedure);

            return rows > 0 ? (true, null) : (false, "İmtahan yenilənmədi.");
        }

        public async Task<bool> DeleteAsync(string dersKodu, int sagirdNomresi, DateTime tarix)
        {
            using var connection = _context.CreateConnection();
            var rows = await connection.ExecuteAsync("sp_ImtahanSil", new
            {
                DersKodu = dersKodu,
                SagirdNomresi = sagirdNomresi,
                ImtahanTarixi = tarix
            }, commandType: System.Data.CommandType.StoredProcedure);

            return rows > 0;
        }
    }
}
