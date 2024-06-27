package com.elderlycare.pojo;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@TableName("medicine_intake")
public class Intake {
    int medicineId;
    boolean intake;
    String time;
}
