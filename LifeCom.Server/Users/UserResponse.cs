namespace LifeCom.Server.Users
{
    public class UserResponse
    {
        public int id {  get; set; }
        public string username { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;

        public UserResponse(User user)
        {
            username = user.username;
            email = user.email;
            id = user.Id;
        }
    }
}
