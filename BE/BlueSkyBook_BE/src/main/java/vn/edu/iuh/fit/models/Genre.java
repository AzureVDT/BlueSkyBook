package vn.edu.iuh.fit.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * @author VoDinhThong
 * @description doing task
 * @update 7/20/2024
 * @since 7/20/2024
 */
@Entity
@Table(name = "genres")
@Getter
@Setter
@ToString
@NoArgsConstructor
public class Genre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;

    public Genre(String name) {
        this.name = name;
    }
}
