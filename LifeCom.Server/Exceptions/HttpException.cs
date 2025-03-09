namespace LifeCom.Server.Exceptions
{
    public class HttpException : Exception
    {
        public HttpException(int code, string? message = null)
        {
            StatusCode = code;
            if (message != null)
                ErrorMessage = message;
            else
            {
                switch (StatusCode)
                {

                    case 401:
                        ErrorMessage = "Unauthorized";
                        break;
                    case 403:
                        ErrorMessage = "Forbidden";
                        break;
                    case 404:
                        ErrorMessage = "Not found";
                        break;
                    default:
                        ErrorMessage = "Bad request";
                        break;
                }
            }
        }

        public int StatusCode { get; }
        public string? ErrorMessage { get; }

    }
}
