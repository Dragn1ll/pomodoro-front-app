using Api.Api.Pipeline;
using Api.Domain.Abstractions;
using Api.Domain.Entities;
using Api.Domain.Models;
using Api.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

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
            
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddSwaggerGen(c =>
{
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

builder.Services.AddDbContext<ApiDbContext>(opt =>
{
    opt.UseInMemoryDatabase("ApiDatabase");
});

builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<JwtWorker>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

var userGroup = app.MapGroup("user");

userGroup.MapPost("/register", async (RegisterUserRequest request, ApiDbContext apiDbContext, IPasswordHasher passwordHasher) =>
{
    await apiDbContext.Users.AddAsync(new User
    {
        Email = request.Email,
        PasswordHash = passwordHasher.HashPassword(request.Password)
    });
    await apiDbContext.SaveChangesAsync();
}).WithSummary("Register user");

userGroup.MapPost("/login", async (LoginUserRequest request, 
    ApiDbContext apiDbContext, 
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

userGroup.MapGet("/all", async (ApiDbContext apiDbContext) => 
    await apiDbContext.Users.AsNoTracking().ToListAsync())
    .RequireAuthorization();
app.Run();
