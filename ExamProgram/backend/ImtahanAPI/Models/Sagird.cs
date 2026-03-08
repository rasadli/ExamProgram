using System.ComponentModel.DataAnnotations;

namespace ImtahanAPI.Models
{
    public class Sagird
    {
        [Key]
        [Range(1, int.MaxValue)]
        public int Nomresi { get; set; }

        [Required, StringLength(30)]
        public string Adi { get; set; } = string.Empty;

        [Required, StringLength(30)]
        public string Soyadi { get; set; } = string.Empty;

        [Range(1, 12)]
        public int Sinif { get; set; }

        public decimal? OrtalamaQiymet { get; set; }
    }
}
