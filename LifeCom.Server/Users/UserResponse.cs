namespace LifeCom.Server.Users
{
    public class UserResponse
    {
        public int id {  get; set; }
        public string username { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public byte[] profilePic { get; set; } = [];

        public UserResponse(User user)
        {
            id = user.Id;
            username = user.username;
            email = user.email;
            profilePic = user.profilePic;
        }
    }
}
