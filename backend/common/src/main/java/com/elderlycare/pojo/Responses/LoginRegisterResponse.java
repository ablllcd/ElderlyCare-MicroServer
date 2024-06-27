package com.elderlycare.pojo.Responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRegisterResponse {
    int status;
    String msg;
    String token;
}
