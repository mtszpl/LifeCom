using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using LifeCom.Server.Data;

namespace LifeCom.Server.Chats
{
    public class ChatsController : Controller
    {
        private readonly LifeComContext _context;

        public ChatsController(LifeComContext context)
        {
            _context = context;
        }
    }
}
