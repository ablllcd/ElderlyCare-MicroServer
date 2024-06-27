package com.elderlycare.pojo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MedicineIntake {
    int medicineId;
    boolean intake;
    String time;
    int userId;
    String medicineName;
    String medicineType;
    String startTime;
    int frequency;
    String amount;
}
