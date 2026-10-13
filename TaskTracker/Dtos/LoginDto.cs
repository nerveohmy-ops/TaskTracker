using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Dtos
{
    public class LoginDto
    {
        [Required(ErrorMessage = "Email обязателен")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Пароль обязателен")]
        public string Password { get; set; } = string.Empty;
    }
}
