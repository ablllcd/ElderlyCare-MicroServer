package com.elderlycare.utils;

import com.elderlycare.mapper.healthManagement.UserHealthInfoMapper;
import com.elderlycare.pojo.UserHealthInfo;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

public class GenerateDataUtils {

    public static void generateHealthInfo(int userID,
                                          UserHealthInfoMapper userHealthInfoMapper,
                                          String startTime,
                                          int interval,
                                          int intervalNumber){
        Random random = new Random();
        UserHealthInfo userHealthInfo = new UserHealthInfo();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss:SSS");
        LocalDateTime st = LocalDateTime.parse(startTime, formatter);

        for (int i = 0; i < intervalNumber; i++) {
            // 生成随机数据
            userHealthInfo.setAcctID(userID);
            userHealthInfo.setTimestamp(st.plusMinutes(interval*i).toString());
            userHealthInfo.setHeartRate(60+random.nextFloat()*40);
            userHealthInfo.setOxygen(93+random.nextFloat()*7);
            userHealthInfo.setTemperature(36+random.nextFloat()*2);

            userHealthInfoMapper.insert(userHealthInfo);
        }
    }
}
