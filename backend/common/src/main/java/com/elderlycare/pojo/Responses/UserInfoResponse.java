package com.elderlycare.pojo.Responses;

import com.elderlycare.pojo.Account;
import com.elderlycare.pojo.UserBasicInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoResponse {
    Account account;
    UserBasicInfo userBasicInfo;
}
