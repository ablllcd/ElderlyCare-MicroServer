package com.elderlycare.pojo.Requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HistoryHealthInfoRequest {
    private String type;
    private String startTime;
    private String endTime;
}
