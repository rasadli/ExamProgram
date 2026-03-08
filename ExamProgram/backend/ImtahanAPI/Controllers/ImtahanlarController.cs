using ImtahanAPI.Models;
using ImtahanAPI.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ImtahanAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImtahanlarController : ControllerBase
    {
        private readonly IImtahanRepository _repository;

        public ImtahanlarController(IImtahanRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var imtahanlar = await _repository.GetAllAsync();
            return Ok(imtahanlar);
        }

        [HttpGet("ders/{kod}")]
        public async Task<IActionResult> GetByDers(string kod)
        {
            var imtahanlar = await _repository.GetByDersAsync(kod);
            return Ok(imtahanlar);
        }

        [HttpGet("sagird/{nomre:int}")]
        public async Task<IActionResult> GetBySagird(int nomre)
        {
            var imtahanlar = await _repository.GetBySagirdAsync(nomre);
            return Ok(imtahanlar);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Imtahan imtahan)
        {
            if (imtahan.Qiymet < 1 || imtahan.Qiymet > 5)
                return BadRequest("Qiymət 1 ilə 5 arasında olmalıdır.");

            var result = await _repository.CreateAsync(imtahan);
            if (!result.Success) return BadRequest(result.Error);

            return Created(string.Empty, imtahan);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Imtahan imtahan)
        {
            if (imtahan.Qiymet < 1 || imtahan.Qiymet > 5)
                return BadRequest("Qiymət 1 ilə 5 arasında olmalıdır.");

            var result = await _repository.UpdateAsync(imtahan);
            if (!result.Success) return BadRequest(result.Error);

            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(
            [FromQuery] string dersKodu,
            [FromQuery] int sagirdNomresi,
            [FromQuery] string tarix)
        {
            if (!DateTime.TryParse(tarix, out var parsedTarix))
                return BadRequest("Tarix formatı yanlışdır. Gözlənilən format: yyyy-MM-dd");

            var deleted = await _repository.DeleteAsync(dersKodu, sagirdNomresi, parsedTarix);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
