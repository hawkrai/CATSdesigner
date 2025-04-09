using Microsoft.EntityFrameworkCore.Migrations;

namespace Entities.Migrations
{
    public partial class AddUniqueConstraintsToGroupChats : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_GroupChats_SubjectId",
                table: "GroupChats");

            migrationBuilder.CreateIndex(
                name: "IX_GroupChats_SubjectId_GroupId_Unique_StudentGroup",
                table: "GroupChats",
                columns: new[] { "SubjectId", "GroupId" },
                unique: true,
                filter: "[GroupId] IS NOT NULL AND [IsStudentGroup] = 1");

            migrationBuilder.CreateIndex(
                name: "IX_GroupChats_SubjectId_Unique_SubjectGroup",
                table: "GroupChats",
                column: "SubjectId",
                unique: true,
                filter: "[GroupId] IS NULL AND [IsSubjectGroup] = 1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_GroupChats_SubjectId_GroupId_Unique_StudentGroup",
                table: "GroupChats");

            migrationBuilder.DropIndex(
                name: "IX_GroupChats_SubjectId_Unique_SubjectGroup",
                table: "GroupChats");

            migrationBuilder.CreateIndex(
                name: "IX_GroupChats_SubjectId",
                table: "GroupChats",
                column: "SubjectId");
        }
    }
}
