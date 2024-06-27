package com.elderlycare;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.elderlycare.mapper.healthManagement.UserHealthInfoMapper;
import com.elderlycare.pojo.UserHealthInfo;
import com.elderlycare.service.healthManagement.UserHealthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@SpringBootTest()
public class InsertData {
    @Autowired
    UserHealthService userHealthService;
    @Autowired
    UserHealthInfoMapper userHealthInfoMapper;

    // 模拟并插入最新的健康信息
    @Test
    public void updateUserInfo() throws InterruptedException {
        while (true){
            // 设置用户ID
            int userID = 18;

            // 获取最新的数据
            QueryWrapper<UserHealthInfo> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("acct_id",userID);
            queryWrapper.orderByDesc("timestamp");
            queryWrapper.last("LIMIT 1");
            UserHealthInfo userHealthInfo = userHealthInfoMapper.selectOne(queryWrapper);

            // 时间戳增加15分钟
            String timestampStr = userHealthInfo.getTimestamp();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime localDateTime = LocalDateTime.parse(timestampStr, formatter);
            localDateTime = localDateTime.plusMinutes(15);
            userHealthInfo.setTimestamp(localDateTime.toString());

            // 构建健康数据
            Random random = new Random();
            userHealthInfo.setHeartRate(80+random.nextFloat()*3);
            userHealthInfo.setOxygen(96+random.nextFloat());
            userHealthInfo.setTemperature(36.8f+random.nextFloat()*0.2f);

            // 插入数据
            userHealthInfoMapper.insert(userHealthInfo);

            // 暂停1秒
            Thread.sleep(5000);
        }
    }
}
