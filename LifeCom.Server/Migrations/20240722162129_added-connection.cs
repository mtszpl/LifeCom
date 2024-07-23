using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeCom.Server.Migrations
{
    /// <inheritdoc />
    public partial class addedconnection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChannelUser");

            migrationBuilder.RenameColumn(
                name: "RefreshToken",
                table: "Users",
                newName: "refreshToken");

            migrationBuilder.RenameColumn(
                name: "RefreshExpirationTime",
                table: "Users",
                newName: "refreshExpirationTime");

            migrationBuilder.CreateTable(
                name: "UserChannel",
                columns: table => new
                {
                    userId = table.Column<int>(type: "int", nullable: false),
                    channelId = table.Column<int>(type: "int", nullable: false),
                    connected = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserChannel", x => new { x.channelId, x.userId });
                    table.ForeignKey(
                        name: "FK_UserChannel_Channel_channelId",
                        column: x => x.channelId,
                        principalTable: "Channel",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserChannel_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserChannel_userId",
                table: "UserChannel",
                column: "userId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserChannel");

            migrationBuilder.RenameColumn(
                name: "refreshToken",
                table: "Users",
                newName: "RefreshToken");

            migrationBuilder.RenameColumn(
                name: "refreshExpirationTime",
                table: "Users",
                newName: "RefreshExpirationTime");

            migrationBuilder.CreateTable(
                name: "ChannelUser",
                columns: table => new
                {
                    channelsId = table.Column<int>(type: "int", nullable: false),
                    membersId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChannelUser", x => new { x.channelsId, x.membersId });
                    table.ForeignKey(
                        name: "FK_ChannelUser_Channel_channelsId",
                        column: x => x.channelsId,
                        principalTable: "Channel",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChannelUser_Users_membersId",
                        column: x => x.membersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChannelUser_membersId",
                table: "ChannelUser",
                column: "membersId");
        }
    }
}
