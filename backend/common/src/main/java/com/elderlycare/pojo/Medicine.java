package com.elderlycare.pojo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.ArrayTypeHandler;

import java.util.List;

@Data
@NoArgsConstructor
@TableName("user_medicine")
public class Medicine {
    int medicineId;
    @TableField("acct_id")
    int userId;
    String medicineName;
    String medicineType;
    String startTime;
    int frequency;
    String amount;
}
