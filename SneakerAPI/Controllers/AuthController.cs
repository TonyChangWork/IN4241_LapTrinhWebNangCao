using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SneakerAPI.Data;
using SneakerAPI.Models;
using System.Security.Cryptography;
using System.Text;

namespace SneakerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // POST api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest(new { message = "Email đã được sử dụng." });

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password),
                Role = "customer"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công!" });
        }

        // POST api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || user.PasswordHash != HashPassword(dto.Password))
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                user = new { user.Id, user.Name, user.Email, user.Role }
            });
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }

    public class RegisterDto
    {
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class LoginDto
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }
}