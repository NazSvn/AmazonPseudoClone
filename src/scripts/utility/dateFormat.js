import dayjs from 'dayjs';

export const dateFormat = (orderTime) => {
  let orderDate = dayjs(orderTime);
  return orderDate.format('dddd, MMMM D');
};
