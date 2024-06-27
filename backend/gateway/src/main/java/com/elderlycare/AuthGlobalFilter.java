package com.elderlycare;

import com.elderlycare.config.AuthPath;
import com.elderlycare.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthGlobalFilter implements GlobalFilter {
    @Autowired
    private AuthPath authPath;

    private AntPathMatcher antPathMatcher = new AntPathMatcher();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        // 1. 根据路径判断是否需要登录验证
        if (isExcludePath(request.getPath().toString())) {
            // 无需登录的路径直接放行
            return chain.filter(exchange);
        }

        // 2. 获取并解析token
        String token;
        String userID;
        try {
            token = request.getHeaders().getFirst("token");
            userID = JwtUtils.parserToken(token);
            System.out.println(userID);
        } catch (Exception e) {
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        }

        // 3. 将解析到的userID传递到后续的微服务中
        ServerWebExchange newExchange = exchange.mutate().
                request(builder -> builder.header("userID", userID))
                .build();

        return chain.filter(newExchange);
    }

    private boolean isExcludePath(String path) {
        for (String excludePathPattern : authPath.getExcludePaths()) {
            if (antPathMatcher.match(excludePathPattern, path)) {
                return true;
            }
        }
        return false;
    }
}
