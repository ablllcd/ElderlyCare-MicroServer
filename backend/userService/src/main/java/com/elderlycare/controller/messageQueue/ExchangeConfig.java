package com.elderlycare.controller.messageQueue;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ExchangeConfig {
    @Bean
    public FanoutExchange createFanoutExchange() {
        return new FanoutExchange("userservice.fanout");
    }

    @Bean
    public Queue Queue1() {
        return new Queue("userservice.queue1");
    }

    @Bean
    public Queue Queue2() {
        return new Queue("userservice.queue2");
    }


    @Bean
    public Binding bindQueue1(Queue Queue1, FanoutExchange createFanoutExchange) {
        return BindingBuilder.bind(Queue1).to(createFanoutExchange);
    }

    @Bean
    public Binding bindQueue2(Queue Queue2, FanoutExchange createFanoutExchange) {
        return BindingBuilder.bind(Queue2).to(createFanoutExchange);
    }
}
