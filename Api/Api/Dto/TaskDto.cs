using Api.Domain.DataAccess.Entities;

namespace Api.Dto;

public class TaskDto(TaskEntity task)
{
    public int Id { get; set; } = task.Id;
    public int UserId { get; set; } = task.UserId;
    public string Name { get; set; } = task.Name;
    public string Description { get; set; } = task.Description;
    public DateTime AddedAt { get; set; } = task.AddedAt;
    public DateTime? StartedAt { get; set; } = task.StartedAt;
    public int TimeSpent { get; set; } = task.TimeSpent;
    public bool IsCompleted { get; set; } = task.IsCompleted;
}