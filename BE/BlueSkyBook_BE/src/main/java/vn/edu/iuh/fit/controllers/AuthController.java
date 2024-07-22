package vn.edu.iuh.fit.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.dto.CustomerDTO;
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
    public ResponseEntity<CustomerDTO> login(@RequestBody Customer customer) {
        Optional<CustomerDTO> customerDTO = authServices.login(customer.getEmail(), customer.getPassword());
        return customerDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/signup")
    public ResponseEntity<CustomerDTO> signup(@RequestBody Customer customer) {
        CustomerDTO createdCustomer = authServices.signup(customer.getName(), customer.getEmail(), customer.getPassword());
        return ResponseEntity.ok(createdCustomer);
    }
}