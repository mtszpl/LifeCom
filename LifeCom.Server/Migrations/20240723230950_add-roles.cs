using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeCom.Server.Migrations
{
    /// <inheritdoc />
    public partial class addroles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatUser");

            migrationBuilder.DropTable(
                name: "UserChannel");

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

            migrationBuilder.CreateTable(
                name: "UserChats",
                columns: table => new
                {
                    userId = table.Column<int>(type: "int", nullable: false),
                    chatId = table.Column<int>(type: "int", nullable: false),
                    role = table.Column<int>(type: "int", nullable: false, defaultValueSql: "USER")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserChats", x => new { x.chatId, x.userId });
                    table.ForeignKey(
                        name: "FK_UserChats_Chat_chatId",
                        column: x => x.chatId,
                        principalTable: "Chat",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserChats_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChannelUser_membersId",
                table: "ChannelUser",
                column: "membersId");

            migrationBuilder.CreateIndex(
                name: "IX_UserChats_userId",
                table: "UserChats",
                column: "userId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChannelUser");

            migrationBuilder.DropTable(
                name: "UserChats");

            migrationBuilder.CreateTable(
                name: "ChatUser",
                columns: table => new
                {
                    chatsId = table.Column<int>(type: "int", nullable: false),
                    membersId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatUser", x => new { x.chatsId, x.membersId });
                    table.ForeignKey(
                        name: "FK_ChatUser_Chat_chatsId",
                        column: x => x.chatsId,
                        principalTable: "Chat",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChatUser_Users_membersId",
                        column: x => x.membersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserChannel",
                columns: table => new
                {
                    channelId = table.Column<int>(type: "int", nullable: false),
                    userId = table.Column<int>(type: "int", nullable: false),
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
                name: "IX_ChatUser_membersId",
                table: "ChatUser",
                column: "membersId");

            migrationBuilder.CreateIndex(
                name: "IX_UserChannel_userId",
                table: "UserChannel",
                column: "userId");
        }
    }
}
