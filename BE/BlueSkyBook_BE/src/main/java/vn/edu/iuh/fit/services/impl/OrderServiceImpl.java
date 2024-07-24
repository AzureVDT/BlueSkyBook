package vn.edu.iuh.fit.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.dto.OrderDTO;
import vn.edu.iuh.fit.dto.OrderDetailDTO;
import vn.edu.iuh.fit.models.Book;
import vn.edu.iuh.fit.models.Customer;
import vn.edu.iuh.fit.models.Order;
import vn.edu.iuh.fit.models.OrderDetail;
import vn.edu.iuh.fit.repositories.BookRepository;
import vn.edu.iuh.fit.repositories.CustomerRepository;
import vn.edu.iuh.fit.repositories.OrderDetailRepository;
import vn.edu.iuh.fit.repositories.OrderRepository;
import vn.edu.iuh.fit.services.OrderServices;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderServices {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BookRepository bookRepository;

    @Override
    public List<Order> getOrdersByCustomerId(int customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    @Override
    public Order createOrder(OrderDTO orderDTO) {
        Customer customer = customerRepository.findById(orderDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setPaymentMethod(orderDTO.getPaymentMethod());
        order.setPaymentStatus(orderDTO.getPaymentStatus());

        // Save the order first
        Order savedOrder = orderRepository.save(order);

        List<OrderDetail> orderDetails = new ArrayList<>();
        for (OrderDetailDTO orderDetailDTO : orderDTO.getOrderDetails()) {
            Book book = bookRepository.findById(orderDetailDTO.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));
            if (book.getAvailableQuantity() < orderDetailDTO.getQuantity()) {
                throw new RuntimeException("Insufficient stock for book: " + book.getBookname());
            }
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(savedOrder);  // Use the saved order
            orderDetail.setBook(book);
            orderDetail.setQuantity(orderDetailDTO.getQuantity());
            orderDetail = orderDetailRepository.save(orderDetail);
            orderDetails.add(orderDetail);

            // Decrease the available quantity of the book
            book.setAvailableQuantity(book.getAvailableQuantity() - orderDetailDTO.getQuantity());
            bookRepository.save(book);
        }

        // Update the saved order with the order details
        savedOrder.setOrderDetails(orderDetails);
        return orderRepository.save(savedOrder);
    }

    @Override
    public void deleteAllOrders() {
        List<Order> orders = orderRepository.findAll();
        for (Order order : orders) {
            for (OrderDetail orderDetail : order.getOrderDetails()) {
                Book book = orderDetail.getBook();
                book.setAvailableQuantity(book.getAvailableQuantity() + orderDetail.getQuantity());
                bookRepository.save(book);
            }
        }
        orderRepository.deleteAll();
    }

    @Override
    public void deleteOrder(int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        for (OrderDetail orderDetail : order.getOrderDetails()) {
            Book book = orderDetail.getBook();
            book.setAvailableQuantity(book.getAvailableQuantity() + orderDetail.getQuantity());
            bookRepository.save(book);
        }
        orderRepository.deleteById(orderId);
    }

    @Override
    public List<OrderDetail> getOrderDetailsByOrderId(int orderId) {
        return orderDetailRepository.findByOrderId(orderId);
    }

    @Override
    public OrderDetail updateOrderDetailQuantity(int orderDetailId, int quantity) {
        OrderDetail orderDetail = orderDetailRepository.findById(orderDetailId)
                .orElseThrow(() -> new RuntimeException("OrderDetail not found"));
        Book book = orderDetail.getBook();
        int oldQuantity = orderDetail.getQuantity();
        int quantityDifference = quantity - oldQuantity;

        if (book.getAvailableQuantity() < quantityDifference) {
            throw new RuntimeException("Insufficient stock for book: " + book.getBookname());
        }

        orderDetail.setQuantity(quantity);
        book.setAvailableQuantity(book.getAvailableQuantity() - quantityDifference);
        bookRepository.save(book);
        return orderDetailRepository.save(orderDetail);
    }

    @Override
    public OrderDetail addOrderDetailToOrder(int orderId, OrderDetailDTO orderDetailDTO) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Book book = bookRepository.findById(orderDetailDTO.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        if (book.getAvailableQuantity() < orderDetailDTO.getQuantity()) {
            throw new RuntimeException("Insufficient stock for book: " + book.getBookname());
        }

        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setOrder(order);
        orderDetail.setBook(book);
        orderDetail.setQuantity(orderDetailDTO.getQuantity());
        orderDetail = orderDetailRepository.save(orderDetail);

        // Decrease the available quantity of the book
        book.setAvailableQuantity(book.getAvailableQuantity() - orderDetailDTO.getQuantity());
        bookRepository.save(book);

        return orderDetail;
    }

    @Override
    public void deleteAllOrdersByCustomerId(int customerId) {
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        for (Order order : orders) {
            for (OrderDetail orderDetail : order.getOrderDetails()) {
                Book book = orderDetail.getBook();
                book.setAvailableQuantity(book.getAvailableQuantity() + orderDetail.getQuantity());
                bookRepository.save(book);
            }
        }
        orderRepository.deleteAll(orders);
    }

    @Override
    public void deleteOrderDetail(int orderDetailId) {
        OrderDetail orderDetail = orderDetailRepository.findById(orderDetailId)
                .orElseThrow(() -> new RuntimeException("OrderDetail not found"));
        Book book = orderDetail.getBook();
        book.setAvailableQuantity(book.getAvailableQuantity() + orderDetail.getQuantity());
        bookRepository.save(book);
        orderDetailRepository.deleteById(orderDetailId);
    }
}
