using System.ComponentModel.DataAnnotations.Schema;

namespace SneakerAPI.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Brand { get; set; } = "";
        public string Image { get; set; } = "";
        // Product colors: mỗi sản phẩm tối đa 4 màu.
        // Khi chọn màu ở frontend, ảnh sẽ được lấy theo ColorXImage.
        public string? Color1Name { get; set; }
        public string? Color1Image { get; set; }
        public string? Color2Name { get; set; }
        public string? Color2Image { get; set; }
        public string? Color3Name { get; set; }
        public string? Color3Image { get; set; }
        public string? Color4Name { get; set; }
        public string? Color4Image { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal? OldPrice { get; set; }
        public int? DiscountPercent { get; set; }
        public bool IsNew { get; set; } = false;
        public bool IsFeatured { get; set; } = false;
        public int Stock { get; set; } = 0;
        public int ViewCount { get; set; } = 0;
        public int BuyCount { get; set; } = 0;
    }
}