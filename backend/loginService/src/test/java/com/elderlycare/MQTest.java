package com.elderlycare;

import com.elderlycare.pojo.UserBasicInfo;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class MQTest {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    public void sendTest() {
        rabbitTemplate.convertAndSend("Simple.queue", "hello simple queue");
    }

    @Test
    public void fanoutTest() {
        rabbitTemplate.convertAndSend("cc.fanout", null, "hello fanout queue");
    }

    @Test
    public void object2JsonTest() {
        UserBasicInfo userBasicInfo = new UserBasicInfo();
        userBasicInfo.setAcctID(9988);
        rabbitTemplate.convertAndSend("cc.fanout", null, userBasicInfo);
    }
}
