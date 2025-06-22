using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Api.Domain.DataAccess.Entities;
using Microsoft.IdentityModel.Tokens;

namespace Api.Pipeline;

public class JwtWorker
{
    public string? CreateJwtToken(UserEntity user)
    {
        var securityKey = new SymmetricSecurityKey("secretkeysecretkeysecretkeysecretkeysecretkeysecretkey"u8.ToArray());
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}