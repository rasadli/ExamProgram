using Dapper;
using ImtahanAPI.Data;
using ImtahanAPI.Models;

namespace ImtahanAPI.Repositories
{
    public class DersRepository : IDersRepository
    {
        private readonly DapperContext _context;

        public DersRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Ders>> GetAllAsync(string? ad, string? muellim, int? sinif)
        {
            using var connection = _context.CreateConnection();
            var sql = "SELECT * FROM Dersler WHERE 1=1";
            var parameters = new DynamicParameters();

            if (!string.IsNullOrWhiteSpace(ad))
            {
                sql += " AND DersAdi LIKE @Ad";
                parameters.Add("Ad", $"%{ad}%");
            }

            if (!string.IsNullOrWhiteSpace(muellim))
            {
                sql += " AND (MuellimAdi LIKE @Muellim OR MuellimSoyadi LIKE @Muellim)";
                parameters.Add("Muellim", $"%{muellim}%");
            }

            if (sinif.HasValue)
            {
                sql += " AND Sinif = @Sinif";
                parameters.Add("Sinif", sinif);
            }

            sql += " ORDER BY DersAdi";
            return await connection.QueryAsync<Ders>(sql, parameters);
        }

        public async Task<Ders?> GetByIdAsync(string kod)
        {
            using var connection = _context.CreateConnection();
            const string sql = "SELECT * FROM Dersler WHERE DersKodu = @DersKodu";
            return await connection.QueryFirstOrDefaultAsync<Ders>(sql, new { DersKodu = kod });
        }

        public async Task<bool> CreateAsync(Ders ders)
        {
            using var connection = _context.CreateConnection();
            var rows = await connection.ExecuteAsync("sp_DersElave", new
            {
                ders.DersKodu,
                ders.DersAdi,
                ders.Sinif,
                ders.MuellimAdi,
                ders.MuellimSoyadi
            }, commandType: System.Data.CommandType.StoredProcedure);

            return rows > 0;
        }

        public async Task<bool> UpdateAsync(string kod, Ders ders)
        {
            using var connection = _context.CreateConnection();
            var rows = await connection.ExecuteAsync("sp_DersYenile", new
            {
                DersKodu = kod,
                ders.DersAdi,
                ders.Sinif,
                ders.MuellimAdi,
                ders.MuellimSoyadi
            }, commandType: System.Data.CommandType.StoredProcedure);

            return rows > 0;
        }

        public async Task<bool> DeleteAsync(string kod)
        {
            using var connection = _context.CreateConnection();
            var rows = await connection.ExecuteAsync("sp_DersSil", new { DersKodu = kod }, commandType: System.Data.CommandType.StoredProcedure);
            return rows > 0;
        }
    }
}
