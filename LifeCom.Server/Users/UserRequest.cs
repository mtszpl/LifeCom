using System.Text.Json.Serialization;

namespace LifeCom.Server.Users
{
    public class UserRequest
    {
        public string username { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
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
            this.username = username;
            this.password = password;
            this.email = email;
            if (username == string.Empty && email == string.Empty)
                e = new Exception("Username and email in request are empty");
            if(password == string.Empty)
                e = new Exception("Password in request is empty");

        }

    }
}
