package com.elderlycare.service.loginRegister;

import com.elderlycare.handler.exceptions.LoginRegisterException;
import com.elderlycare.mapper.LoginRegister.AccountMapper;
import com.elderlycare.pojo.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// 自己实现用户信息查询方法
@Service
public class FetchAcctService implements UserDetailsService {

    @Autowired
    private AccountMapper accountMapper;

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        // 查询用户信息
        Account account = accountMapper.getAccountAndRoleByAccount(s);
        // 如果用户不存在，抛出异常
        if(account==null){
            throw new LoginRegisterException("Account or password is wrong",4);
        }

        return account;
    }
}
