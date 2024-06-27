package com.elderlycare.controller;

import com.elderlycare.pojo.Requests.HistoryHealthInfoRequest;
import com.elderlycare.pojo.Requests.InsertHealthInfoRequest;
import com.elderlycare.pojo.UserHealthInfo;
import com.elderlycare.service.UserHealthService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class UserHealthController {
    UserHealthService userHealthService;

    @GetMapping("/healthInfo/current")
    public UserHealthInfo currentHealthInfo(@RequestHeader("userID") int userID) {
        return userHealthService.getCurrentHealthInfo(userID);
    }

    @GetMapping("/healthInfo/history")
    public List<UserHealthInfo> historyHealthInfo(@RequestHeader("userID") int userID,
                                                  @RequestParam("type") String type,
                                                  @RequestParam("startTime") String st,
                                                  @RequestParam("endTime") String et) {
        HistoryHealthInfoRequest request = new HistoryHealthInfoRequest(type, st, et);
        return userHealthService.getHistoryHealthInfo(userID, request);
    }

    @PostMapping("/healthInfo/esp32Data")
    public void getHealthInfo(@RequestBody InsertHealthInfoRequest infoRequest) {
        userHealthService.receiveHealthInfo(infoRequest);
    }
}
