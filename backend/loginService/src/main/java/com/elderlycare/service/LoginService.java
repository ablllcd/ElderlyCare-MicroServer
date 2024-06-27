package com.elderlycare.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.elderlycare.handler.exceptions.LoginRegisterException;
import com.elderlycare.mapper.AccountMapper;
import com.elderlycare.mapper.RoleMapper;
import com.elderlycare.mapper.UserInfoMapper;
import com.elderlycare.mapper.VerifyCodeMapper;
import com.elderlycare.pojo.*;
import com.elderlycare.pojo.Responses.LoginRegisterResponse;
import com.elderlycare.utils.EmailUtils;
import com.elderlycare.utils.JwtUtils;
import com.elderlycare.utils.NetUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class LoginService {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private VerifyCodeMapper verifyCodeMapper;
    @Autowired
    private RoleMapper roleMapper;
    @Autowired
    private EmailUtils emailUtils;
    @Autowired
    private UserInfoMapper userInfoMapper;

    public LoginRegisterResponse login(Account userInput) {
        // 用户验证
        UsernamePasswordAuthenticationToken AuthenticationToken =
                new UsernamePasswordAuthenticationToken(userInput.getUsername(), userInput.getPassword());
        Authentication authenticate = authenticationManager.authenticate(AuthenticationToken);
        // 认证没通过
        if (Objects.isNull(authenticate)) {
            throw new RuntimeException("Login fail");
        }
        // 认证通过:根据userID生成和返回jwt
        Account account = (Account) authenticate.getPrincipal();
        String id = account.getId().toString();
        String jwt = JwtUtils.generateToken(id);

        return new LoginRegisterResponse(0, "login success", jwt);
    }

    public LoginRegisterResponse register(Account registerRequest, RoleType roleType) {
        // 1. 查找邮箱或用户是否存在
        String email = registerRequest.getEmail();
        String accountName = registerRequest.getAccountName();

        QueryWrapper<Account> wrapper = new QueryWrapper<>();
//        wrapper.eq("email",email).or().eq("account_name",accountName);
        // 查找邮箱
        wrapper.eq("email", email);
        List<Account> accounts = accountMapper.selectList(wrapper);
        if (!accounts.isEmpty()) {
            throw new LoginRegisterException("Email already exists", 1);
        }
        // 查找账号
        wrapper.clear();
        wrapper.eq("account_name", accountName);
        accounts = accountMapper.selectList(wrapper);
        if (!accounts.isEmpty()) {
            throw new LoginRegisterException("Account name already exists", 9);
        }


        // 2. 创建用户
        // 密码加密
        String password = registerRequest.getPassword();
        String encodedPassword = bCryptPasswordEncoder.encode(password);
        // 创建新用户并存储
        Account newAccount = new Account();
        newAccount.setAccountName(accountName);
        newAccount.setEmail(email);
        newAccount.setPassword(encodedPassword);
        accountMapper.insert(newAccount);
        // 存储用户对应的角色
        Role role = new Role();
        role.setAcctID(newAccount.getId());
        role.setRoleName(roleType.toString());
        roleMapper.insert(role);

        // 3. 创建验证码
        String code = EmailUtils.generateUniqueVerificationCode(email);
        VerifyCode verifyCode = new VerifyCode(
                email, code,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(15));
        verifyCodeMapper.insert(verifyCode);

        // 4. 发送连接
        String hostAddress;
        try {
            hostAddress = NetUtils.getLocalHostExactAddress().getHostAddress();
        } catch (Exception e) {
            throw new LoginRegisterException("can not fetch server ip address", 10);
        }
        String link = "http://" + hostAddress + ":890/user/register/confirm?code=" + code;
        emailUtils.send(newAccount.getEmail(),
                EmailUtils.buildEmail("user", link));

        return new LoginRegisterResponse(0, "Register Success", null);
    }

    public String confirm(String token) {
        // 1. 查找token及其对应的邮箱
        QueryWrapper<VerifyCode> codeQueryWrapper = new QueryWrapper<>();
        codeQueryWrapper.eq("code", token);
        VerifyCode verifyCode = verifyCodeMapper.selectOne(codeQueryWrapper);
        if (verifyCode == null) {
            throw new LoginRegisterException("Wrong verify code", 2);
        }
        // 2. 判断是token是否过期
        if (verifyCode.getExpireAt().isBefore(LocalDateTime.now())) {
            // 过期则删除账号
            String email = verifyCode.getEmail();
            QueryWrapper<Account> accountQueryWrapper = new QueryWrapper<>();
            accountQueryWrapper.eq("email", email);
            accountMapper.delete(accountQueryWrapper);
            throw new LoginRegisterException("Verify code expired", 3);
        }
        // 3. 根据邮箱将用户enable了
        String email = verifyCode.getEmail();
        UpdateWrapper<Account> codeUpdateWrapper = new UpdateWrapper<>();
        codeUpdateWrapper.eq("email", email).set("enabled", true);
        accountMapper.update(codeUpdateWrapper);

        // 4. 存储用户默认信息
        codeUpdateWrapper.clear();
        codeUpdateWrapper.eq("email", email);
        Account account = accountMapper.selectOne(codeUpdateWrapper);
        UserBasicInfo userBasicInfo = new UserBasicInfo();
        userBasicInfo.setAcctID(account.getId());
        userBasicInfo.setPicturePath("default.png");
        userInfoMapper.insert(userBasicInfo);

        return "Account is activated";
    }

    public Account getAccountInfo(int userID) {
        return accountMapper.getAccountAndRoleByID(userID);
    }
}
