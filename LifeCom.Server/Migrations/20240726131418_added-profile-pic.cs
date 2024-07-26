using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeCom.Server.Migrations
{
    /// <inheritdoc />
    public partial class addedprofilepic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Channel",
                newName: "name");

            migrationBuilder.AddColumn<byte[]>(
                name: "profilePic",
                table: "Users",
                type: "varbinary(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "profilePic",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Channel",
                newName: "Name");
        }
    }
}
