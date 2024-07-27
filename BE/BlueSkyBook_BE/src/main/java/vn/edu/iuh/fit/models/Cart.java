package vn.edu.iuh.fit.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author VoDinhThong
 * @description doing task
 * @update 7/27/2024
 * @since 7/27/2024
 */
@Entity
@Table(name = "carts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int bookId;
    private String name;
    private double price;
    private int quantity;
    private int availableQuantity;
    private String thumbnail;
    private int customerId;
}
