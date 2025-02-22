using Microsoft.EntityFrameworkCore.Migrations;

namespace Entities.Migrations
{
    public partial class ConfigureCascadeDeleteForEntities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_SubjectLecturers_SubjectId",
                table: "SubjectLecturers",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_SubjectGroups_GroupId",
                table: "SubjectGroups",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_SubjectGroups_SubjectId",
                table: "SubjectGroups",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_GroupId",
                table: "Students",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupChats_GroupId",
                table: "GroupChats",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupChats_SubjectId",
                table: "GroupChats",
                column: "SubjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupChats_Groups_GroupId",
                table: "GroupChats",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupChats_Groups_GroupId",
                table: "GroupChats");

            migrationBuilder.DropIndex(
                name: "IX_SubjectLecturers_SubjectId",
                table: "SubjectLecturers");

            migrationBuilder.DropIndex(
                name: "IX_SubjectGroups_GroupId",
                table: "SubjectGroups");

            migrationBuilder.DropIndex(
                name: "IX_SubjectGroups_SubjectId",
                table: "SubjectGroups");

            migrationBuilder.DropIndex(
                name: "IX_Students_GroupId",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_GroupChats_GroupId",
                table: "GroupChats");

            migrationBuilder.DropIndex(
                name: "IX_GroupChats_SubjectId",
                table: "GroupChats");
        }
    }
}
