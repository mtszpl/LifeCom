using LifeCom.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace LifeCom.Server.Users
{
    public class UserService
    {
        private readonly LifeComContext _context;

        public UserService(LifeComContext context)
        {
            _context = context;
        }

        public User? GetById(int? id) 
        {
            return _context.Users.FirstOrDefault(user => user.Id == id);
        }

        public Task<User?> GetByIdAsync(int? id)
        {
            return _context.Users.FirstOrDefaultAsync(m => m.Id == id);
        }

        public List<User> GetByNamePart(string name)
        {
            return _context.Users.Where(u => u.username.Contains(name)).ToList();
        }

        public ValueTask<User?> FindAsync(int id)
        {
            return _context.Users.FindAsync(id);
        }

        public Task<int> Update(User user)
        {
            _context.Update(user);
            return _context.SaveChangesAsync();
        }

        public Task<int>Remove(User user)
        {
            _context.Users.Remove(user);
            return _context.SaveChangesAsync();
        }

        public User? ChangeUsername(int? id, string newName)
        {
            User? user = GetById(id);
            if (user == null)
                return user;
            user.username = newName;
            //_context.SaveChanges();
            return user;
        }

        public User? ChangeEmail(int? id, string newEmail)
        {
            User? user = GetById(id);
            if (user == null)
                return user;
            user.email = newEmail;
            //_context.SaveChanges();
            return user;
        }

        public bool SetProfilePic(int? userId, IFormFile imageFile)
        {
            User? toChange = GetById(userId);
            if (toChange == null)
                return false;
            using MemoryStream stream = new MemoryStream();
            imageFile.CopyTo(stream);
            byte[] imageByte = stream.ToArray();
            toChange.profilePic = imageByte;
            _context.SaveChanges();
            return true;

        }

        public bool ResetProfilePic(int? userId)
        {
            User? toChange = GetById(userId);
            if(toChange == null)
                return false;
            toChange.profilePic = [];
            _context.SaveChanges();
            return true;
        }

        public bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
