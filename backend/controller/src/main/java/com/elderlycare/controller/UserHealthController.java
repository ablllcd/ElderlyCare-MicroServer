package com.elderlycare.controller;

import com.elderlycare.mapper.healthManagement.UserHealthInfoMapper;
import com.elderlycare.pojo.Account;
import com.elderlycare.pojo.Requests.HistoryHealthInfoRequest;
import com.elderlycare.pojo.Requests.InsertHealthInfoRequest;
import com.elderlycare.pojo.UserHealthInfo;
import com.elderlycare.service.healthManagement.UserHealthService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class UserHealthController {
    UserHealthService userHealthService;

    //    @PreAuthorize("hasAnyAuthority('User')")
    @RequestMapping("/hello")
    public String hello(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        return "hello: " + userDetails.getUsername();
    }

    @GetMapping("/healthInfo/current")
    public UserHealthInfo currentHealthInfo(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userHealthService.getCurrentHealthInfo(userDetails);
    }

    @GetMapping("/healthInfo/history")
    public List<UserHealthInfo> historyHealthInfo(Authentication authentication,
                                                  @RequestParam("type") String type,
                                                  @RequestParam("startTime") String st,
                                                  @RequestParam("endTime") String et){
        UserDetails userDetails = (UserDetails)authentication.getPrincipal();
        HistoryHealthInfoRequest request = new HistoryHealthInfoRequest(type,st,et);
        return userHealthService.getHistoryHealthInfo(userDetails,request);
    }

    @PostMapping("/healthInfo/esp32Data")
    public void getHealthInfo(@RequestBody InsertHealthInfoRequest infoRequest) {
        userHealthService.receiveHealthInfo(infoRequest);
    }
}
