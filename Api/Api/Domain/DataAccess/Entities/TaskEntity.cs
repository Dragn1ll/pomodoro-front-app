namespace Api.Domain.DataAccess.Entities;

public class TaskEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime AddedAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public int TimeSpent { get; set; }
    public bool IsCompleted { get; set; }

    public int UserId { get; set; }
    public UserEntity User { get; set; }
}