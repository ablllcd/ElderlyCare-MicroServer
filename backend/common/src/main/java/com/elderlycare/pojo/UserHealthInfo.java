package com.elderlycare.pojo;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserHealthInfo {
    @TableField(value = "acct_id")
    Integer acctID;
//    LocalDateTime timestamp;
    String timestamp;
    @TableField(value = "heart_rate")
    Float heartRate;
    Float temperature;
    Float oxygen;
}
