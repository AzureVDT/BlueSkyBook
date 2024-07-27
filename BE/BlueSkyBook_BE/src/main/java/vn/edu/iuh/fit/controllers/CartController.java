package vn.edu.iuh.fit.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.dto.CartDTO;
import vn.edu.iuh.fit.models.Cart;
import vn.edu.iuh.fit.services.CartServices;

import java.util.List;

@RestController
@RequestMapping("/api/v1/carts")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    @Autowired
    private CartServices cartService;

    @PostMapping("/save/{customerId}")
    public ResponseEntity<List<Cart>> saveCarts(@PathVariable int customerId, @RequestBody List<Cart> carts) {
        List<Cart> savedCarts = cartService.saveAll(customerId, carts);
        return ResponseEntity.ok(savedCarts);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<CartDTO>> getCartByCustomerId(@PathVariable int customerId) {
        List<CartDTO> carts = cartService.getCartByCustomerId(customerId);
        return ResponseEntity.ok(carts);
    }
}
