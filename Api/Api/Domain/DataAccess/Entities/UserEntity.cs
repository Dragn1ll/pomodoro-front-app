namespace Api.Domain.DataAccess.Entities;

public class UserEntity
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }

    public ICollection<TaskEntity> Tasks { get; set; }
}