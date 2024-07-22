using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeCom.Server.Migrations
{
    /// <inheritdoc />
    public partial class addrefreshtoken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Chat",
                newName: "name");

            migrationBuilder.AddColumn<DateTime>(
                name: "RefreshExpirationTime",
                table: "Users",
                type: "datetime2",
                nullable: false,
                defaultValue: DateTime.UtcNow.AddDays(7));

            migrationBuilder.AddColumn<string>(
                name: "RefreshToken",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RefreshExpirationTime",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "RefreshToken",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Chat",
                newName: "Name");
        }
    }
}
