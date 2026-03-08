using ImtahanAPI.Models;

namespace ImtahanAPI.Repositories
{
    public interface IImtahanRepository
    {
        Task<IEnumerable<Imtahan>> GetAllAsync();
        Task<IEnumerable<Imtahan>> GetByDersAsync(string dersKodu);
        Task<IEnumerable<Imtahan>> GetBySagirdAsync(int sagirdNomresi);
        Task<(bool Success, string? Error)> CreateAsync(Imtahan imtahan);
        Task<(bool Success, string? Error)> UpdateAsync(Imtahan imtahan);
        Task<bool> DeleteAsync(string dersKodu, int sagirdNomresi, DateTime tarix);
    }
}
