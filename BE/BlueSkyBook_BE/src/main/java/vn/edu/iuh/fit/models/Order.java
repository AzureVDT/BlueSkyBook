package vn.edu.iuh.fit.models;

import jakarta.persistence.*;

/**
 * @author VoDinhThong
 * @description doing task
 * @update 7/20/2024
 * @since 7/20/2024
 */
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id", nullable = false, unique = true)
    private int id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(name = "order_date", nullable = false)
    private String orderDate;

}
