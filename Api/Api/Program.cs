using Api.Domain.Abstractions;
using Api.Domain.DataAccess;
using Api.Domain.DataAccess.Entities;
using Api.Pipeline;
using Api.Records;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            RequireExpirationTime = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                "secretkeysecretkeysecretkeysecretkeysecretkeysecretkey"u8.ToArray()),
            RequireAudience = false,
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<JwtWorker>();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Timer API", 
        Version = "v1",
        Description = "API for task tracking application"
    });
    c.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
    {
        Description = "This is a JWT bearer authentication scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = JwtBearerDefaults.AuthenticationScheme
                },
                Scheme = JwtBearerDefaults.AuthenticationScheme,
                Name = JwtBearerDefaults.AuthenticationScheme,
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
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

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

var userGroup = app.MapGroup("user");

userGroup.MapPost("/register", async (RegisterUserRequest request, AppDbContext apiDbContext, IPasswordHasher passwordHasher) =>
{
    await apiDbContext.Users.AddAsync(new UserEntity
    {
        Email = request.Email,
        PasswordHash = passwordHasher.HashPassword(request.Password)
    });
    await apiDbContext.SaveChangesAsync();
}).WithSummary("Register user");

userGroup.MapPost("/login", async (LoginUserRequest request, 
    AppDbContext apiDbContext, 
    IPasswordHasher passwordHasher,
    JwtWorker jwtWorker) =>
{
    var user = await apiDbContext.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
    if (user == null)
        return Results.NotFound();
    if (!passwordHasher.VerifyHashedPassword(user.PasswordHash, request.Password))
        return Results.BadRequest("wrong password");
    return Results.Ok(new
    {
        Token = jwtWorker.CreateJwtToken(user)
    });
}).WithSummary("Login user");


app.UseHttpsRedirection();
app.MapControllers();
app.Run();