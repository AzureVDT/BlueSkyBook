package vn.edu.iuh.fit.services;

import vn.edu.iuh.fit.dto.CartDTO;
import vn.edu.iuh.fit.models.Cart;

import java.util.List;

public interface CartServices {
    List<Cart> saveAll(int customerId,List<Cart> carts);
    List<CartDTO> getCartByCustomerId(int customerId);
}
