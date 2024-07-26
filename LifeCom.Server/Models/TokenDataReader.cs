using System.Security.Claims;

namespace LifeCom.Server.Models
{
    public class TokenDataReader
    {
        public static int? TryReadId(ClaimsIdentity? identity)
        {
            if (identity == null)
                return null;
            string? idString = identity.FindFirst("id")?.Value;
            if (idString == null)
                return null;
            return int.Parse(idString);
        }
    }
}
