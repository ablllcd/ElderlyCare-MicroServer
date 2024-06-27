package com.elderlycare.pojo.Requests;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InsertHealthInfoRequest {
    String deviceID;
    String timestamp;
    Float heartRate;
    Float temperature;
    Float oxygen;
}
