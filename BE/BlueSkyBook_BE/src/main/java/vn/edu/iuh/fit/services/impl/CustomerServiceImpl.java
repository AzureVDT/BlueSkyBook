package vn.edu.iuh.fit.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.dto.CustomerDTO;
import vn.edu.iuh.fit.models.Customer;
import vn.edu.iuh.fit.repositories.CustomerRepository;
import vn.edu.iuh.fit.services.CustomerServices;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerServices {

    @Autowired
    private CustomerRepository customerRepository;


    @Override
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<CustomerDTO> getCustomerById(int id) {
        return customerRepository.findById(id).map(this::convertToDTO);
    }

    @Override
    public CustomerDTO addCustomer(CustomerDTO customerDTO, String password) {
        Customer customer = convertToEntity(customerDTO);
        customer.setPassword(password); // Set password
        customer = customerRepository.save(customer);
        return convertToDTO(customer);
    }

    @Override
    public CustomerDTO updateCustomer(CustomerDTO customerDTO) {
        Optional<Customer> existingCustomerOpt = customerRepository.findById(customerDTO.getId());
        if (existingCustomerOpt.isPresent()) {
            Customer existingCustomer = existingCustomerOpt.get();
            existingCustomer.setName(customerDTO.getName());
            existingCustomer.setEmail(customerDTO.getEmail());
            existingCustomer.setPhone(customerDTO.getPhone());
            existingCustomer.setAvatar(customerDTO.getAvatar());
            existingCustomer.setAddress(customerDTO.getAddress());
            // The password remains unchanged
            customerRepository.save(existingCustomer);
            return convertToDTO(existingCustomer);
        } else {
            // Handle the case where the customer doesn't exist
            throw new RuntimeException("Customer not found with id: " + customerDTO.getId());
        }
    }


    @Override
    public void deleteCustomer(int id) {
        customerRepository.deleteById(id);
    }

    private CustomerDTO convertToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setAvatar(customer.getAvatar());
        dto.setAddress(customer.getAddress());
        dto.setRole(customer.getRole());
        return dto;
    }

    private Customer convertToEntity(CustomerDTO dto) {
        Customer customer = new Customer();
        customer.setId(dto.getId());
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setAvatar(dto.getAvatar());
        customer.setAddress(dto.getAddress());
        customer.setRole(dto.getRole());
        return customer;
    }
    @Override
    public void updatePassword(int id, String newPassword) {
        Optional<Customer> customerOptional = customerRepository.findById(id);
        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            customer.setPassword(newPassword);
            customerRepository.save(customer);
        }
    }
}