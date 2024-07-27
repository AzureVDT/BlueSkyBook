package vn.edu.iuh.fit.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.dto.CartDTO;
import vn.edu.iuh.fit.models.Cart;
import vn.edu.iuh.fit.repositories.CartRepository;
import vn.edu.iuh.fit.services.CartServices;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author VoDinhThong
 * @description doing task
 * @update 7/27/2024
 * @since 7/27/2024
 */
@Service
public class CartServiceImpl implements CartServices {
    @Autowired
    private CartRepository cartRepository;

    @Override
    public List<Cart> saveAll(int customerId, List<Cart> carts) {
        // Delete all carts for the specified customer
        cartRepository.deleteAll(cartRepository.findByCustomerId(customerId));

        // Set the customerId for each cart and save them
        for (Cart cart : carts) {
            cart.setCustomerId(customerId);
        }
        return cartRepository.saveAll(carts);
    }
    @Override
    public List<CartDTO> getCartByCustomerId(int customerId) {
        List<Cart> carts = cartRepository.findByCustomerId(customerId);
        return carts.stream()
                .map(cart -> new CartDTO(
                        cart.getBookId(),
                        cart.getName(),
                        cart.getPrice(),
                        cart.getQuantity(),
                        cart.getAvailableQuantity(),
                        cart.getThumbnail()
                ))
                .collect(Collectors.toList());
    }
}
