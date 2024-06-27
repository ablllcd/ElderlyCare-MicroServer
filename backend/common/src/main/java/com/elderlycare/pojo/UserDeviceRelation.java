package com.elderlycare.pojo;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDeviceRelation {
    @TableField(value = "acct_id")
    private int acctID;
    @TableField(value = "device_id")
    private String deviceID;
}
