package com.elderlycare;

import com.elderlycare.mapper.LoginRegister.AccountMapper;
import com.elderlycare.mapper.LoginRegister.RoleMapper;
import com.elderlycare.mapper.healthManagement.UserHealthInfoMapper;
import com.elderlycare.pojo.UserHealthInfo;
import com.elderlycare.service.userManagement.UserDeviceService;
import com.elderlycare.utils.EmailUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;

@SpringBootTest()
public class ConnectionTest {
    @Autowired
    AccountMapper accountMapper;
    @Autowired
    RoleMapper roleMapper;
    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    EmailUtils emailUtils;
    @Autowired
    UserHealthInfoMapper userHealthInfoMapper;
    @Autowired
    UserDeviceService userDeviceService;


    @Test
    public void timeTest3(){
        List<UserHealthInfo> infos;
        String startTime = "2002-01-01 00:00:00:000";
        String endTime = "2002-01-02 00:00:00:000";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss:SSS");
        LocalDateTime st = LocalDateTime.parse(startTime, formatter);
        LocalDateTime et = LocalDateTime.parse(endTime, formatter);

        infos = userHealthInfoMapper.getAvgHours(18, st, et);
    }



    public static void main(String[] args) {
        String time = "2024-04-02T22:39:10.746850+08:00";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String startDya = LocalDateTime.now().format(formatter);
        LocalDate date = LocalDate.parse(startDya,formatter);
        System.out.println(date);
//        System.out.println(st);
    }
}
