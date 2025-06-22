namespace Api.Records;

public record RegisterUserRequest(
    string Email, 
    string Password);