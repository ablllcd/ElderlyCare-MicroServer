package com.elderlycare.mapper.openfeign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.ArrayList;

@FeignClient("User-Server")
public interface RemoteUserDeviceService {
    @GetMapping("/user/device")
    public ArrayList<String> getDevice(@RequestHeader("userID") int userID);

    @GetMapping("/user/info/device")
    public int getUserByDevice(@RequestHeader("deviceID") String deviceID);
}
