using Api.Domain.DataAccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Timer API", 
        Version = "v1",
        Description = "API for task tracking application"
    });
});

builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseInMemoryDatabase("timer_db"));

builder.Services.AddControllers();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => 
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Timer API v1");
    });
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();