package com.elderlycare.pojo;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Role {
    @TableField(value = "acct_id")
    private Integer acctID;
    @TableField(value = "role_name")
    private String roleName;
}
