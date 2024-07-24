package vn.edu.iuh.fit.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.models.Customer;
import vn.edu.iuh.fit.services.AuthServices;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthServices authServices;

    @PostMapping("/login")
    public Customer login(@RequestBody Customer customer) {
        return authServices.login(customer.getEmail(), customer.getPassword());
    }

    @PostMapping("/signup")
    public ResponseEntity<Customer> signup(@RequestBody Customer customer) {
        Customer createdCustomer = authServices.signup(customer.getName(), customer.getEmail(), customer.getPassword());
        return ResponseEntity.ok(createdCustomer);
    }
}