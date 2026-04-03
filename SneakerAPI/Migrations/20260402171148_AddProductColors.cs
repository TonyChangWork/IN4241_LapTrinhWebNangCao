using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SneakerAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddProductColors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Color1Image",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Color1Name",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Color2Image",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Color2Name",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Color3Image",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Color3Name",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Color4Image",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Color4Name",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color1Image",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Color1Name",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Color2Image",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Color2Name",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Color3Image",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Color3Name",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Color4Image",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Color4Name",
                table: "Products");
        }
    }
}
