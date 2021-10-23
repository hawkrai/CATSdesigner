
using Microsoft.EntityFrameworkCore.Migrations;

namespace Entities.Migrations
{
    public partial class isUserOnline : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "isOnline",
                table: "Users",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isOnline",
                table: "Users");
        }
    }
}
