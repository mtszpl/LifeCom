using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeCom.Server.Migrations
{
    /// <inheritdoc />
    public partial class addroles2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "role",
                table: "UserChats",
                type: "int",
                nullable: true,
                defaultValueSql: "USER",
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValueSql: "USER");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "role",
                table: "UserChats",
                type: "int",
                nullable: false,
                defaultValueSql: "USER",
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true,
                oldDefaultValueSql: "USER");
        }
    }
}
