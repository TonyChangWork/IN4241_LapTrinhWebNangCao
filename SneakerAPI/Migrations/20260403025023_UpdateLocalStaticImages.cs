using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SneakerAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLocalStaticImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE Products SET Image = '/images/products/nike-air-force-1.jpg' WHERE Brand = 'Nike';");
            migrationBuilder.Sql("UPDATE Products SET Color1Image = '/images/products/nike-air-force-1.jpg', Color2Image = '/images/products/nike-air-force-1-white.jpg', Color3Image = '/images/products/adidas-ultraboost.jpg' WHERE Brand = 'Nike';");

            migrationBuilder.Sql("UPDATE Products SET Image = '/images/products/adidas-ultraboost.jpg' WHERE Brand = 'Adidas';");
            migrationBuilder.Sql("UPDATE Products SET Color1Image = '/images/products/adidas-ultraboost.jpg', Color2Image = '/images/products/puma-rs-x.jpg' WHERE Brand = 'Adidas';");

            migrationBuilder.Sql("UPDATE Products SET Image = '/images/products/puma-rs-x.jpg' WHERE Brand = 'Puma';");
            migrationBuilder.Sql("UPDATE Products SET Color1Image = '/images/products/puma-rs-x.jpg', Color2Image = '/images/products/nike-air-force-1.jpg' WHERE Brand = 'Puma';");

            migrationBuilder.Sql("UPDATE Products SET Image = '/images/products/jordan-1-retro-high.jpg' WHERE Brand = 'Jordan';");
            migrationBuilder.Sql("UPDATE Products SET Color1Image = '/images/products/jordan-1-retro-high.jpg', Color2Image = '/images/products/jordan-1-chicago.jpg', Color3Image = '/images/products/jordan-1-royal.jpg' WHERE Brand = 'Jordan';");

            migrationBuilder.Sql("UPDATE Products SET Image = '/images/products/nike-air-force-1.jpg' WHERE Image LIKE 'http%';");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Users");
        }
    }
}
