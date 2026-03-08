using System.ComponentModel.DataAnnotations;

namespace ImtahanAPI.Models
{
    public class Ders
    {
        [Required, StringLength(3, MinimumLength = 3)]
        public string DersKodu { get; set; } = string.Empty;

        [Required, StringLength(30)]
        public string DersAdi { get; set; } = string.Empty;

        [Range(1, 12)]
        public int Sinif { get; set; }

        [Required, StringLength(20)]
        public string MuellimAdi { get; set; } = string.Empty;

        [Required, StringLength(20)]
        public string MuellimSoyadi { get; set; } = string.Empty;
    }
}
