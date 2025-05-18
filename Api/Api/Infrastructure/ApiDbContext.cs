using Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api.Infrastructure;

public class ApiDbContext(DbContextOptions<ApiDbContext> options): DbContext(options)
{
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasKey(user => user.Id);
        modelBuilder.Entity<User>()
            .Property(user => user.Id)
            .ValueGeneratedOnAdd();
        modelBuilder.Entity<User>()
            .HasIndex(user => user.Email)
            .IsUnique();
            
        base.OnModelCreating(modelBuilder);
    }
}