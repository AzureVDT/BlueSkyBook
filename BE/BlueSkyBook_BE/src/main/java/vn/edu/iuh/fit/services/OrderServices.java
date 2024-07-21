package vn.edu.iuh.fit.services;

import vn.edu.iuh.fit.dto.OrderDTO;
import vn.edu.iuh.fit.dto.OrderDetailDTO;
import vn.edu.iuh.fit.models.Order;
import vn.edu.iuh.fit.models.OrderDetail;

import java.util.List;

public interface OrderServices {
    List<Order> getOrdersByCustomerId(int customerId);

    Order createOrder(OrderDTO orderDTO);

    void deleteOrder(int orderId);

    List<OrderDetail> getOrderDetailsByOrderId(int orderId);

    OrderDetail updateOrderDetailQuantity(int orderDetailId, int quantity);

    void deleteOrderDetail(int orderDetailId);

    OrderDetail addOrderDetailToOrder(int orderId, OrderDetailDTO orderDetailDTO);
}
