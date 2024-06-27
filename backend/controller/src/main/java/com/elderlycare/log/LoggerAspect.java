package com.elderlycare.log;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggerAspect {
    @Pointcut("execution(* com.elderlycare.controller.*.*(..))")
    public void controllerPointcut() {}

    @Before("controllerPointcut()")
    public void logBefore(JoinPoint joinPoint) {
        // 根据类信息创建logger
        Class<?> aClass = joinPoint.getTarget().getClass();
        Logger logger = LoggerFactory.getLogger(aClass);
        // 获取调用的方法和参数信息
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        Class<?>[] parameterTypes = ((MethodSignature) joinPoint.getSignature()).getParameterTypes();
        StringBuilder parameterInfo = new StringBuilder();
        for (int i = 0; i < args.length; i++) {
            if (i > 0) {
                parameterInfo.append(", ");
            }
            parameterInfo.append(parameterTypes[i].getSimpleName())
                    .append(": ")
                    .append(args[i]);
        }
        // 日志输出
        logger.info("Method = "+ methodName+ " || Args = " + parameterInfo);
    }
}
