package vn.edu.iuh.fit.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "bookname", nullable = false, columnDefinition = "VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String bookname;

    @Column(name = "description", columnDefinition = "LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String description;

    @Column(name = "thumbnail")
    private String thumbnail;

    @Column(name = "rating")
    private int rating;

    @Column(name = "price")
    private double price;

    @Column(name = "available_quantity")
    private int availableQuantity;

    @Column(name="is_available")
    private boolean isAvailable;

    @ManyToOne
    @JoinColumn(name = "genre_id")
    private Genre genre;

    public Book(String bookname, String description, String thumbnail, int rating, double price, int availableQuantity, Genre genre) {
        this.bookname = bookname;
        this.description = description;
        this.thumbnail = thumbnail;
        this.rating = rating;
        this.price = price;
        this.availableQuantity = availableQuantity;
        this.genre = genre;
    }
}
