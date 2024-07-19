using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace LifeCom.Server.Users
{
    public class UserRequest
    {
        public string username { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
        private Regex passwordRegex = new Regex("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
        public string email { get; set; } = string.Empty;

        private Exception? _e = null;


        [JsonIgnore]
        public Exception? e
        {
            get => _e; 
            private set => _e = value;
        }

        [JsonConstructor]
        public UserRequest(string username, string password, string email)
        {
            this.username = username != null ? username : string.Empty;
            this.password = password;
            this.email = email != null ? email : string.Empty;
            if (username == string.Empty)
                e = new Exception("Username in request is empty");
            if(email == string.Empty)
                e = new Exception("Email in request is empty");
            if(password == string.Empty)
                e = new Exception("Password in request is empty");
            if (passwordRegex.IsMatch(password))
                e = new Exception("Password too weak");

        }

    }
}
