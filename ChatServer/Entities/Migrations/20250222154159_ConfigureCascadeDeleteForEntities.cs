using Microsoft.EntityFrameworkCore.Migrations;

namespace Entities.Migrations
{
    public partial class ConfigureCascadeDeleteForEntities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropColumn(
            //    name: "Attendance",
            //    table: "Users");

            //migrationBuilder.CreateTable(
            //    name: "Groups",
            //    columns: table => new
            //    {
            //        Id = table.Column<int>(type: "int", nullable: false)
            //            .Annotation("SqlServer:Identity", "1, 1"),
            //        Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //        StartYear = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //        GraduationYear = table.Column<string>(type: "nvarchar(max)", nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Groups", x => x.Id);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Subjects",
            //    columns: table => new
            //    {
            //        Id = table.Column<int>(type: "int", nullable: false)
            //            .Annotation("SqlServer:Identity", "1, 1"),
            //        Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //        ShortName = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //        Color = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //        IsArchive = table.Column<bool>(type: "bit", nullable: false),
            //        IsNeededCopyToBts = table.Column<bool>(type: "bit", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Subjects", x => x.Id);
            //    });

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

            //migrationBuilder.AddForeignKey(
            //    name: "FK_GroupChats_Subjects_SubjectId",
            //    table: "GroupChats",
            //    column: "SubjectId",
            //    principalTable: "Subjects",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Cascade);

            //migrationBuilder.AddForeignKey(
            //    name: "FK_Students_Groups_GroupId",
            //    table: "Students",
            //    column: "GroupId",
            //    principalTable: "Groups",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Cascade);

            //migrationBuilder.AddForeignKey(
            //    name: "FK_SubjectGroups_Groups_GroupId",
            //    table: "SubjectGroups",
            //    column: "GroupId",
            //    principalTable: "Groups",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Cascade);

            //migrationBuilder.AddForeignKey(
            //    name: "FK_SubjectGroups_Subjects_SubjectId",
            //    table: "SubjectGroups",
            //    column: "SubjectId",
            //    principalTable: "Subjects",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Cascade);

            //migrationBuilder.AddForeignKey(
            //    name: "FK_SubjectLecturers_Subjects_SubjectId",
            //    table: "SubjectLecturers",
            //    column: "SubjectId",
            //    principalTable: "Subjects",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupChats_Groups_GroupId",
                table: "GroupChats");

            //migrationBuilder.DropForeignKey(
            //    name: "FK_GroupChats_Subjects_SubjectId",
            //    table: "GroupChats");

            //migrationBuilder.DropForeignKey(
            //    name: "FK_Students_Groups_GroupId",
            //    table: "Students");

            //migrationBuilder.DropForeignKey(
            //    name: "FK_SubjectGroups_Groups_GroupId",
            //    table: "SubjectGroups");

            //migrationBuilder.DropForeignKey(
            //    name: "FK_SubjectGroups_Subjects_SubjectId",
            //    table: "SubjectGroups");

            //migrationBuilder.DropForeignKey(
            //    name: "FK_SubjectLecturers_Subjects_SubjectId",
            //    table: "SubjectLecturers");

            //migrationBuilder.DropTable(
            //    name: "Groups");

            //migrationBuilder.DropTable(
            //    name: "Subjects");

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

            //migrationBuilder.AddColumn<string>(
            //    name: "Attendance",
            //    table: "Users",
            //    type: "nvarchar(max)",
            //    nullable: true);
        }
    }
}
