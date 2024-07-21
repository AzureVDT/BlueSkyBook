package vn.edu.iuh.fit.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * @author VoDinhThong
 * @description doing task
 * @update 7/21/2024
 * @since 7/21/2024
 */
@Getter
@Setter
public class CustomerDTO {
    private int id;
    private String name;
    private String email;
    private String phone;
    private String avatar;
    private String address;
}
