using ImtahanAPI.Models;
using ImtahanAPI.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ImtahanAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DerslerController : ControllerBase
    {
        private readonly IDersRepository _repository;

        public DerslerController(IDersRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? ad, [FromQuery] string? muellim, [FromQuery] int? sinif)
        {
            var dersler = await _repository.GetAllAsync(ad, muellim, sinif);
            return Ok(dersler);
        }

        [HttpGet("{kod}")]
        public async Task<IActionResult> GetById(string kod)
        {
            var ders = await _repository.GetByIdAsync(kod);
            if (ders == null) return NotFound();
            return Ok(ders);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Ders ders)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _repository.CreateAsync(ders);
            if (!created) return BadRequest("Dərs əlavə edilə bilmədi.");

            return CreatedAtAction(nameof(GetById), new { kod = ders.DersKodu }, ders);
        }

        [HttpPut("{kod}")]
        public async Task<IActionResult> Update(string kod, [FromBody] Ders ders)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var updated = await _repository.UpdateAsync(kod, ders);
            if (!updated) return NotFound();

            return NoContent();
        }

        [HttpDelete("{kod}")]
        public async Task<IActionResult> Delete(string kod)
        {
            var deleted = await _repository.DeleteAsync(kod);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
