package com.elderlycare.controller.messageQueue;

import com.elderlycare.mapper.UserInfoMapper;
import com.elderlycare.pojo.UserBasicInfo;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SpringRabbitListener {
    @Autowired
    UserInfoMapper userInfoMapper;

    @RabbitListener(queues = "Simple.queue")
    public void simpleQueueTest(String msg) {
        System.out.println(msg);
    }

    @RabbitListener(queues = "userservice.queue1")
    public void addUser(UserBasicInfo userBasicInfo) {
        userInfoMapper.insert(userBasicInfo);
    }
}
