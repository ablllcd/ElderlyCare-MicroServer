package com.elderlycare.service.openfeign;

import com.elderlycare.pojo.Account;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient("Login-Server")
public interface RemoteAccountService {
    @RequestMapping("/user/account")
    public Account accountInfo(@RequestParam("id") int userID);
}
