package vn.edu.iuh.fit.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vn.edu.iuh.fit.dto.CustomerDTO;
import vn.edu.iuh.fit.models.Customer;
import vn.edu.iuh.fit.repositories.CustomerRepository;
import vn.edu.iuh.fit.services.AuthServices;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthServices {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public Customer login(String email, String password) {
        return customerRepository.findByEmailAndPassword(email, password)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
    }

    @Override
    public Customer signup(String name, String email, String password) {
        Customer customer = new Customer(name, email, null, null, password);
        customer = customerRepository.save(customer);
        return customer;
    }

    private CustomerDTO convertToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setAvatar(customer.getAvatar());
        dto.setAddress(customer.getAddress());
        return dto;
    }
}