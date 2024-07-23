package vn.edu.iuh.fit.services;

import vn.edu.iuh.fit.dto.CustomerDTO;
import vn.edu.iuh.fit.models.Customer;

import java.util.Optional;

public interface AuthServices {
    Optional<Customer> login(String email, String password);
    Customer signup(String name, String email, String password);
}
