package com.elderlycare.utils;

import java.util.Date;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.elderlycare.handler.exceptions.LoginRegisterException;

public class JwtUtils {
    private static final long EXPIRE_TIME = 24 * 60 * 60 * 1000;//默认24小时
    //私钥
    private static final String SECRET_KEY = "privateKey";

    public static String generateToken(String subject) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + EXPIRE_TIME);

        String token = JWT.create()
                .withSubject(subject)
                .withIssuedAt(now)
                .withExpiresAt(expirationDate)
                .sign(Algorithm.HMAC256(SECRET_KEY));
        return token;
    }

    public static String parserToken(String token) {
        try {
            DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC256(SECRET_KEY))
                    .build()
                    .verify(token);
            String subject = decodedJWT.getSubject();
            return subject;
        } catch (Exception e) {
            // 验证失败
            throw new LoginRegisterException("Token wrong or expired",7);
        }
    }

    public static void main(String[] args) {
        String s = generateToken("nihao");
        System.out.println(s);
        String s1 = parserToken(s);
        System.out.println(s1);
    }
}
