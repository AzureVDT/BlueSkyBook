    package vn.edu.iuh.fit.controllers;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import vn.edu.iuh.fit.dto.CustomerDTO;
    import vn.edu.iuh.fit.models.Customer;
    import vn.edu.iuh.fit.services.CustomerServices;

    import java.util.Optional;

    @RestController
    @RequestMapping("/api/v1/customer")
    @CrossOrigin(origins = "http://localhost:5173")
    public class CustomerController {

        @Autowired
        private CustomerServices customerServices;

        @GetMapping("/{id}")
        public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable int id) {
            Optional<CustomerDTO> customerDTO = customerServices.getCustomerById(id);
            return customerDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        }

        @PostMapping("/create")
        public ResponseEntity<CustomerDTO> addCustomer(@RequestBody Customer customer) {
            CustomerDTO customerDTO = new CustomerDTO();
            customerDTO.setId(customer.getId());
            customerDTO.setName(customer.getName());
            customerDTO.setEmail(customer.getEmail());
            customerDTO.setPhone(customer.getPhone());
            customerDTO.setAvatar(customer.getAvatar());
            customerDTO.setAddress(customer.getAddress());
            CustomerDTO createdCustomer = customerServices.addCustomer(customerDTO, customer.getPassword());
            return ResponseEntity.ok(createdCustomer);
        }

        @PutMapping("/{id}/update")
        public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable int id, @RequestBody CustomerDTO customerDTO) {
            customerDTO.setId(id);
            CustomerDTO updatedCustomer = customerServices.updateCustomer(customerDTO);
            return ResponseEntity.ok(updatedCustomer);
        }

        @PutMapping("/{id}/update/password")
        public ResponseEntity<Void> updatePassword(@PathVariable int id, @RequestBody String newPassword) {
            customerServices.updatePassword(id, newPassword);
            return ResponseEntity.ok().build();
        }
    }