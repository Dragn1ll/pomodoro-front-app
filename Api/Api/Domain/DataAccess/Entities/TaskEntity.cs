namespace Api.Domain.DataAccess.Entities;

public class TaskEntity
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime StartedAt { get; set; }
    public int Time { get; set; }
    public bool IsCompleted { get; set; }

    public int UserId { get; set; }
    public UserEntity User { get; set; }
}