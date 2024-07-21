package vn.edu.iuh.fit.services;

import vn.edu.iuh.fit.dto.CustomerDTO;

import java.util.Optional;

public interface AuthServices {
    Optional<CustomerDTO> login(String email, String password);
    CustomerDTO signup(String name, String email, String password);
}
