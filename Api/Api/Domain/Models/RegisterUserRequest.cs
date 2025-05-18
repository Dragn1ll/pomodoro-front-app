namespace Api.Domain.Models;

public record RegisterUserRequest(
    string Email, 
    string Password);