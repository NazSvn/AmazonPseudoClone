export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export const addOrder = (order) => {
  orders.unshift(order);
  saveOrderToStorage();
};

const saveOrderToStorage = () => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const getOrder = (orderId) => {
  return orders.find((order) => order.id === orderId);
};
