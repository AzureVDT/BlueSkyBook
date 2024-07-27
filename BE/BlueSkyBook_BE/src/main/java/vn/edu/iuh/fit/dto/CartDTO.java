package vn.edu.iuh.fit.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private int bookId;
    private String name;
    private double price;
    private int quantity;
    private int availableQuantity;
    private String thumbnail;
}
