using ImtahanAPI.Models;
using ImtahanAPI.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ImtahanAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SagirdlerController : ControllerBase
    {
        private readonly ISagirdRepository _repository;

        public SagirdlerController(ISagirdRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? ad, [FromQuery] string? soyad, [FromQuery] int? nomre)
        {
            var sagirdler = await _repository.GetAllAsync(ad, soyad, nomre);
            return Ok(sagirdler);
        }

        [HttpGet("{nomre:int}")]
        public async Task<IActionResult> GetById(int nomre)
        {
            var sagird = await _repository.GetByIdAsync(nomre);
            if (sagird == null) return NotFound();
            return Ok(sagird);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Sagird sagird)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _repository.CreateAsync(sagird);
            if (!created) return BadRequest("Şagird əlavə edilə bilmədi.");

            return CreatedAtAction(nameof(GetById), new { nomre = sagird.Nomresi }, sagird);
        }

        [HttpPut("{nomre:int}")]
        public async Task<IActionResult> Update(int nomre, [FromBody] Sagird sagird)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var updated = await _repository.UpdateAsync(nomre, sagird);
            if (!updated) return NotFound();

            return NoContent();
        }

        [HttpDelete("{nomre:int}")]
        public async Task<IActionResult> Delete(int nomre)
        {
            var deleted = await _repository.DeleteAsync(nomre);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
