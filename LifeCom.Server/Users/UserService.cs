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

        public bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
