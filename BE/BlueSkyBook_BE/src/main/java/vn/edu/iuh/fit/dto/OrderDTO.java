package vn.edu.iuh.fit.dto;

import lombok.Getter;
import lombok.Setter;
import vn.edu.iuh.fit.enums.PaymentMethod;
import vn.edu.iuh.fit.enums.PaymentStatus;

import java.util.List;

/**
 * @author VoDinhThong
 * @description doing task
 * @update 7/21/2024
 * @since 7/21/2024
 */
@Getter
@Setter
public class OrderDTO {
    private int customerId;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private List<OrderDetailDTO> orderDetails;
}

