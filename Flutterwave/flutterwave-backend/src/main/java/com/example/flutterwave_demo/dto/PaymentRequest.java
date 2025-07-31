package com.example.flutterwave_demo.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private String tx_ref;
    private String amount;
    private String currency;
    private String redirect_url;
    private String customer_email;
    private String payment_method_id;
    private String customer_id;
    private String reference;
}