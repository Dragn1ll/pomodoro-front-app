namespace Api.Domain.Abstractions;

public interface IPasswordHasher
{
    string HashPassword(string password);
    bool VerifyHashedPassword(string passwordHash, string password);
}