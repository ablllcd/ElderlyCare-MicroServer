package com.elderlycare.pojo.Requests;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class MultiTimeMedicineRequest {
    int medicineId;
    int userId;
    String medicineName;
    String medicineType;
    List<String> startTimes;
    int frequency;
    String amount;
}