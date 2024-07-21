package vn.edu.iuh.fit.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

/**
 * @author VoDinhThong
 * @description doing task
 * @update 7/20/2024
 * @since 7/20/2024
 */
@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "name", nullable = false, columnDefinition = "VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String name;
    private String email;
    private String phone;
    private String avatar;
    @Column(name = "address", columnDefinition = "VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String address;
    private String password;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Order> orders;

    public Customer(String name, String email, String phone, String avatar, String password) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.avatar = avatar;
        this.password = password;
    }

}