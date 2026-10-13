using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Dtos
{
    public class CreateTaskDto
    {
        [Required(ErrorMessage = "Название обязательно")]
        [StringLength(200, MinimumLength = 1, ErrorMessage = "Название должно быть от 1 до 200 символов")]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000, ErrorMessage = "Описание не должно превышать 1000 символов")]
        public string? Description { get; set; }

        public DateTime? DueDate { get; set; }
    }
}