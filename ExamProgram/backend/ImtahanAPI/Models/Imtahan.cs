using System.ComponentModel.DataAnnotations;

namespace ImtahanAPI.Models
{
    public class Imtahan
    {
        [Required, StringLength(3, MinimumLength = 3)]
        public string DersKodu { get; set; } = string.Empty;

        [Required]
        public int SagirdNomresi { get; set; }

        [Required]
        public DateTime ImtahanTarixi { get; set; }

        [Range(1, 5)]
        public int Qiymet { get; set; }
    }
}
