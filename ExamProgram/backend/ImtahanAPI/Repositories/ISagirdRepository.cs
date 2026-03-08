using ImtahanAPI.Models;

namespace ImtahanAPI.Repositories
{
    public interface ISagirdRepository
    {
        Task<IEnumerable<Sagird>> GetAllAsync(string? ad, string? soyad, int? nomre);
        Task<Sagird?> GetByIdAsync(int nomre);
        Task<bool> CreateAsync(Sagird sagird);
        Task<bool> UpdateAsync(int nomre, Sagird sagird);
        Task<bool> DeleteAsync(int nomre);
    }
}
