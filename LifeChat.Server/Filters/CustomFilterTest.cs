using Microsoft.AspNetCore.Mvc.Filters;

namespace LifeChat.Server.Filters
{

    public class CustomFilterTest : ActionFilterAttribute
    {
        public CustomFilterTest() 
        {
            Order = -3000;
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            Console.WriteLine("test, I guess...");
            throw new NotImplementedException();
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            throw new NotImplementedException();
        }
    }
}
