namespace LifeCom.Server.Users.Images
{
    public class Image
    {
        public int Id { get; set; }
        public string name { get; set; } = "";
        public int size { get; set; } = 0;
        public byte[] data { get; set; } = [];

        public required int userId { get; set; }
        public User user { get; set; }

        public void Set(IFormFile file, User owner)
        {
            userId = owner.Id;
            name = file.Name;
            using (MemoryStream steam = new MemoryStream())
            {
                file.CopyTo(steam);
                data = steam.ToArray();
            }
            user = owner;
            size = data.Length;
        }

        public void Copy(Image image)
        {
            name = image.name;
            data = image.data;
            size = data.Length;
        }

    }
}
