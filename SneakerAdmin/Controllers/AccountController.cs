using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SneakerAdmin.Data;

namespace SneakerAdmin.Controllers
{
    public class AccountController : Controller
    {
        private readonly AppDbContext _context;

        public AccountController(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Login() => View();

        [HttpPost]
        public async Task<IActionResult> Login(string email, string password)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var bytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            var hash = Convert.ToBase64String(bytes);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email && u.PasswordHash == hash && u.Role == "admin");

            if (user == null)
            {
                ViewBag.Error = "Email hoặc mật khẩu không đúng, hoặc bạn không có quyền admin.";
                return View();
            }

            HttpContext.Session.SetString("AdminUser", user.Name);
            HttpContext.Session.SetString("AdminEmail", user.Email);
            return RedirectToAction("Index", "Home");
        }

        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login");
        }
    }
}