namespace SneakerAPI.Models
{
    public class Address
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public string Label { get; set; } = "";        // vd: "Nhà", "Công ty"
        public string FullAddress { get; set; } = "";
        public string ReceiverName { get; set; } = "";
        public string ReceiverPhone { get; set; } = "";
        public bool IsDefault { get; set; } = false;
    }
}
