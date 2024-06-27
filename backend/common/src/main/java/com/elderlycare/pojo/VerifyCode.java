package com.elderlycare.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class VerifyCode {
    @TableId(type=IdType.AUTO)
    Integer id;
    String email;
    String code;
    @TableField(value = "created_at")
    LocalDateTime createdAt;
    @TableField(value = "expire_at")
    LocalDateTime expireAt;

    public VerifyCode(String email, String code, LocalDateTime createdAt, LocalDateTime expireAt) {
        this.email = email;
        this.code = code;
        this.createdAt = createdAt;
        this.expireAt = expireAt;
    }
}
