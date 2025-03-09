using LifeCom.Server.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace LifeCom.Server.Controllers
{
    public class IBaseLifeComController : Controller
    {
        private ActionResult HandleHttpException(HttpException ex)
        {
            switch (ex.StatusCode)
            {
                case 404:
                    return NotFound(ex.ErrorMessage);
                case 403:
                    return Forbid();
                case 401:
                    return Unauthorized(ex.ErrorMessage);
                default:
                    Console.WriteLine($"Unknown error: {ex.StatusCode}");
                    return BadRequest(ex.ErrorMessage);
            }
        }

        protected virtual ActionResult<T> HandleCall<T>(Func<T> action)
        {
            try
            { 
                return Ok(action());
            }
            catch (HttpException ex)
            {
                return HandleHttpException(ex);
            }
        }

        protected async Task<ActionResult<T>> HandleCall<T>(Func<Task<T>> action)
        {
            try
            {
                T result = await action();
                return Ok(result);
            }
            catch (HttpException ex)
            {
                return HandleHttpException(ex);
            }
        }

        protected virtual ActionResult HandleCall(Action action, string? message = null)
        {
            try
            {
                action();
                return Ok(message);
            }
            catch (HttpException ex)
            {
                return HandleHttpException(ex);
            }
        }

        protected async Task<ActionResult> HandleCall(Func<Task> action)
        {
            try
            {
                await action();
                return Ok(action());
            }
            catch (HttpException ex)
            {
                return HandleHttpException(ex);
            }
        }
    }
}
