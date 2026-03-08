using System.Data;
using Microsoft.Data.SqlClient;

namespace ImtahanAPI.Data
{
    public class DapperContext
    {
        private readonly string _connectionString;

        public DapperContext(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' tapılmadı.");
        }

        public IDbConnection CreateConnection() => new SqlConnection(_connectionString);
    }
}
