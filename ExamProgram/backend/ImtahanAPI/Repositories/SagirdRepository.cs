using Dapper;
using ImtahanAPI.Data;
using ImtahanAPI.Models;

namespace ImtahanAPI.Repositories
{
    public class SagirdRepository : ISagirdRepository
    {
        private readonly DapperContext _context;

        public SagirdRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Sagird>> GetAllAsync(string? ad, string? soyad, int? nomre)
        {
            using var connection = _context.CreateConnection();
            var sql = @"SELECT s.Nomresi, s.Adi, s.Soyadi, s.Sinif,
                        AVG(CAST(i.Qiymet AS decimal(10,2))) AS OrtalamaQiymet
                        FROM Sagirdler s
                        LEFT JOIN Imtahanlar i ON i.SagirdNomresi = s.Nomresi
                        WHERE 1=1";

            var parameters = new DynamicParameters();

            if (!string.IsNullOrWhiteSpace(ad))
            {
                sql += " AND s.Adi LIKE @Adi";
                parameters.Add("Adi", $"%{ad}%");
            }

            if (!string.IsNullOrWhiteSpace(soyad))
            {
                sql += " AND s.Soyadi LIKE @Soyadi";
                parameters.Add("Soyadi", $"%{soyad}%");
            }

            if (nomre.HasValue)
            {
                sql += " AND s.Nomresi = @Nomre";
                parameters.Add("Nomre", nomre);
            }

            sql += " GROUP BY s.Nomresi, s.Adi, s.Soyadi, s.Sinif ORDER BY s.Soyadi, s.Adi";
            return await connection.QueryAsync<Sagird>(sql, parameters);
        }

        public async Task<Sagird?> GetByIdAsync(int nomre)
        {
            using var connection = _context.CreateConnection();
            var sql = @"SELECT s.Nomresi, s.Adi, s.Soyadi, s.Sinif,
                        AVG(CAST(i.Qiymet AS decimal(10,2))) AS OrtalamaQiymet
                        FROM Sagirdler s
                        LEFT JOIN Imtahanlar i ON i.SagirdNomresi = s.Nomresi
                        WHERE s.Nomresi = @Nomre
                        GROUP BY s.Nomresi, s.Adi, s.Soyadi, s.Sinif";

            return await connection.QueryFirstOrDefaultAsync<Sagird>(sql, new { Nomre = nomre });
        }

        public async Task<bool> CreateAsync(Sagird sagird)
        {
            using var connection = _context.CreateConnection();
            var rows = await connection.ExecuteAsync("sp_SagirdElave", new
            {
                sagird.Nomresi,
                sagird.Adi,
                sagird.Soyadi,
                sagird.Sinif
            }, commandType: System.Data.CommandType.StoredProcedure);

            return rows > 0;
        }

        public async Task<bool> UpdateAsync(int nomre, Sagird sagird)
        {
            using var connection = _context.CreateConnection();
            var rows = await connection.ExecuteAsync("sp_SagirdYenile", new
            {
                Nomresi = nomre,
                sagird.Adi,
                sagird.Soyadi,
                sagird.Sinif
            }, commandType: System.Data.CommandType.StoredProcedure);

            return rows > 0;
        }

        public async Task<bool> DeleteAsync(int nomre)
        {
            using var connection = _context.CreateConnection();
            var rows = await connection.ExecuteAsync("sp_SagirdSil", new { Nomresi = nomre }, commandType: System.Data.CommandType.StoredProcedure);
            return rows > 0;
        }
    }
}
