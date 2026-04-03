export const formatVND = (price) => {
  const amount = Number(price) || 0
  return `${new Intl.NumberFormat("vi-VN").format(Math.round(amount))} đ`
}
