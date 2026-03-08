using ImtahanAPI.Models;

namespace ImtahanAPI.Repositories
{
    public interface IDersRepository
    {
        Task<IEnumerable<Ders>> GetAllAsync(string? ad, string? muellim, int? sinif);
        Task<Ders?> GetByIdAsync(string kod);
        Task<bool> CreateAsync(Ders ders);
        Task<bool> UpdateAsync(string kod, Ders ders);
        Task<bool> DeleteAsync(string kod);
    }
}
