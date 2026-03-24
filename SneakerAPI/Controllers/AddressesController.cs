using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SneakerAPI.Data;
using SneakerAPI.Models;

namespace SneakerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AddressesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AddressesController(AppDbContext context) { _context = context; }

        // GET api/addresses/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var list = await _context.Addresses
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.IsDefault)
                .ToListAsync();
            return Ok(list);
        }

        // POST api/addresses
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AddressDto dto)
        {
            // Nếu địa chỉ mới là default, bỏ default các địa chỉ cũ
            if (dto.IsDefault)
            {
                var existing = await _context.Addresses.Where(a => a.UserId == dto.UserId).ToListAsync();
                existing.ForEach(a => a.IsDefault = false);
            }

            var address = new Address
            {
                UserId = dto.UserId,
                Label = dto.Label,
                FullAddress = dto.FullAddress,
                ReceiverName = dto.ReceiverName,
                ReceiverPhone = dto.ReceiverPhone,
                IsDefault = dto.IsDefault
            };
            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();
            return Ok(address);
        }

        // PUT api/addresses/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AddressDto dto)
        {
            var address = await _context.Addresses.FindAsync(id);
            if (address == null) return NotFound();

            if (dto.IsDefault)
            {
                var existing = await _context.Addresses.Where(a => a.UserId == address.UserId && a.Id != id).ToListAsync();
                existing.ForEach(a => a.IsDefault = false);
            }

            address.Label = dto.Label;
            address.FullAddress = dto.FullAddress;
            address.ReceiverName = dto.ReceiverName;
            address.ReceiverPhone = dto.ReceiverPhone;
            address.IsDefault = dto.IsDefault;
            await _context.SaveChangesAsync();
            return Ok(address);
        }

        // DELETE api/addresses/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var address = await _context.Addresses.FindAsync(id);
            if (address == null) return NotFound();
            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xoá địa chỉ." });
        }
    }

    public class AddressDto
    {
        public int UserId { get; set; }
        public string Label { get; set; } = "";
        public string FullAddress { get; set; } = "";
        public string ReceiverName { get; set; } = "";
        public string ReceiverPhone { get; set; } = "";
        public bool IsDefault { get; set; } = false;
    }
}
