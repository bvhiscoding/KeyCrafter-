const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
};
const OrderStatus = {
  PENDING: 'pending', // Đang chờ xác nhận
  CONFIRMED: 'confirmed', // Đã xác nhận
  PROCESSING: 'processing', // Đang xử lý/đóng gói
  SHIPPED: 'shipped', // Đang giao hàng
  DELIVERED: 'delivered', // Đã giao thành công
  CANCELLED: 'cancelled', // Đã hủy
};

// Valid transitions
const OrderStatusTransitions = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};
const PaymentStatus = {
  PENDING: 'pending', // Chờ thanh toán
  PAID: 'paid', // Đã thanh toán
  FAILED: 'failed', // Thanh toán thất bại
  REFUNDED: 'refunded', // Đã hoàn tiền
};
const PaymentMethod = {
  COD: 'cod', // Thanh toán khi nhận hàng
  STRIPE: 'stripe', // Thanh toán qua Stripe
  BANKING: 'banking', // Chuyển khoản ngân hàng
};
const SwitchType = {
  LINEAR: 'linear', // Êm, không có bump
  TACTILE: 'tactile', // Có bump, không tiếng click
  CLICKY: 'clicky', // Có bump và tiếng click
};
const AddressLabel = {
  HOME: 'Nhà',
  OFFICE: 'Công ty',
  OTHER: 'Khác',
};

module.exports = {
  UserRole,
  OrderStatus,
  OrderStatusTransitions,
  PaymentStatus,
  PaymentMethod,
  SwitchType,
  AddressLabel,
};
