using System.Security.Claims;
using Api.Domain.DataAccess;
using Api.Domain.DataAccess.Entities;
using Api.Records;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
[Route("api/tasks")]
[Authorize]
public class TaskController(AppDbContext context) : ControllerBase
{
    [HttpGet("get")]
    public async Task<ActionResult> GetTasks()
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        
            var tasks = await context.Tasks
                .Where(t => t.UserId == userId)
                .ToListAsync();
        
            return Ok(tasks);
        }
        catch (Exception exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpGet("get/{taskId}")]
    public async Task<ActionResult> GetTask(int taskId)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        
            var task = await context.Tasks
                .FirstOrDefaultAsync(t => t.UserId == userId && t.Id == taskId);
        
            if (task == null) 
                return NotFound();
            
            return Ok(task);

        }
        catch (Exception exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpPost("add")]
    public async Task<ActionResult> AddTask([FromBody] TaskCreateRecord task)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var taskEntity = new TaskEntity
            {
                UserId = userId,
                AddedAt = task.AddedAt,
                Description = task.Description,
                Name = task.Name,
                IsCompleted = task.Completed,
                TimeSpent = task.TimeSpent,
                StartedAt = task.StartedAt,
            };
        
            await context.Tasks.AddAsync(taskEntity);
            await context.SaveChangesAsync();
        
            return Ok();
        }
        catch (Exception exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpPut("update/{taskId}")]
    public async Task<ActionResult> UpdateTask(int taskId, [FromBody] TaskCreateRecord task)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            
            var affectedRows = await context.Tasks
                .Where(t => t.Id == taskId && t.UserId == userId)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(t => t.Description, task.Description)
                    .SetProperty(t => t.Name, task.Name)
                    .SetProperty(t => t.IsCompleted, task.Completed)
                    .SetProperty(t => t.TimeSpent, task.TimeSpent)
                    .SetProperty(t => t.StartedAt, task.StartedAt));
            
            if (affectedRows == 0) 
                return NotFound();
            
            return Ok();
        }
        catch (Exception exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpDelete("delete/{taskId}")]
    public async Task<ActionResult> DeleteTask(int taskId)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var affectedRows = await context.Tasks
                .Where(t => t.UserId == userId && t.Id == taskId)
                .ExecuteDeleteAsync();
            
            if (affectedRows == 0) 
                return NotFound();
            
            return Ok();
        }
        catch (Exception exception)
        {
            return BadRequest(exception.Message);
        }
    }
}