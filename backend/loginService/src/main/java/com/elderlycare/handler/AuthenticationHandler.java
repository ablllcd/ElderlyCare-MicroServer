package com.elderlycare.handler;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONWriter;
import com.elderlycare.pojo.Responses.LoginRegisterResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Component
public class AuthenticationHandler implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) throws IOException, ServletException {
        httpServletResponse.setContentType("application/json");
        PrintWriter writer = httpServletResponse.getWriter();
        LoginRegisterResponse error = new LoginRegisterResponse();

        if (e instanceof InsufficientAuthenticationException) {
            // 用户未登录
            error.setStatus(6);
            error.setMsg("User not login");
        } else if (e instanceof BadCredentialsException) {
            error.setStatus(8);
            error.setMsg("Wrong account name or password");
        } else {
            // 对于GlobalExcpetionHandler没有考虑到的异常的统一处理
            error.setStatus(-1);
            error.setMsg(e.getMessage());
        }

        String jsonString = JSON.toJSONString(error, JSONWriter.Feature.WriteMapNullValue);
        writer.print(jsonString);

    }
}