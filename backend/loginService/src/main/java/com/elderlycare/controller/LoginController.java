package com.elderlycare.controller;

import com.elderlycare.pojo.Account;
import com.elderlycare.pojo.Responses.LoginRegisterResponse;
import com.elderlycare.pojo.RoleType;
import com.elderlycare.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
public class LoginController {
    @Autowired
    LoginService loginService;

    @RequestMapping("/user/login")
    public LoginRegisterResponse login(@RequestBody Account account) {
        return loginService.login(account);
    }

    @RequestMapping("/user/register")
    public LoginRegisterResponse register(@RequestBody Account account, HttpServletRequest request) {
        return loginService.register(account, RoleType.User);
    }

    @RequestMapping("/user/register/confirm")
    public String confirm(@RequestParam("code") String token) {
        return loginService.confirm(token);
    }


}
