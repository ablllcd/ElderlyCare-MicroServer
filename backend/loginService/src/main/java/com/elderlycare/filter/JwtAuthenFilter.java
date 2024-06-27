package com.elderlycare.filter;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONWriter;
import com.elderlycare.handler.exceptions.LoginRegisterException;
import com.elderlycare.mapper.AccountMapper;
import com.elderlycare.mapper.RoleMapper;
import com.elderlycare.pojo.Account;
import com.elderlycare.pojo.Responses.LoginRegisterResponse;
import com.elderlycare.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Component
public class JwtAuthenFilter extends OncePerRequestFilter {
    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private RoleMapper roleMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 获取token
        String token = request.getHeader("token");
        // 如果没有token，直接放行，之后的验证filter会处理的
        if (token == null || "".equals(token)) {
            filterChain.doFilter(request, response);
            return;
        }
        // 解析token,去查找对应的account和role
        try {
            String userID = JwtUtils.parserToken(token);
            Account account = accountMapper.getAccountAndRoleByID(Integer.parseInt(userID));

            // 用户信息存入SecurityContextHolder
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(account, null, account.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            // 放行
            filterChain.doFilter(request, response);
        } catch (LoginRegisterException e) {
            // 如果jwt解析失败，直接返回异常
            response.setContentType("application/json");
            PrintWriter writer = response.getWriter();
            LoginRegisterResponse error = new LoginRegisterResponse();
            error.setStatus(e.getStatus());
            error.setMsg(e.getMessage());
            String jsonString = JSON.toJSONString(error, JSONWriter.Feature.WriteMapNullValue);
            writer.print(jsonString);
        }

    }
}
