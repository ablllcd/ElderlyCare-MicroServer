package com.elderlycare.service.healthManagement;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.elderlycare.mapper.healthManagement.UserHealthInfoMapper;
import com.elderlycare.pojo.Account;
import com.elderlycare.pojo.Requests.HistoryHealthInfoRequest;
import com.elderlycare.pojo.Requests.InsertHealthInfoRequest;
import com.elderlycare.pojo.UserHealthInfo;
import com.elderlycare.service.userManagement.UserDeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

@Service
public class UserHealthService {
    @Autowired
    UserHealthInfoMapper userHealthInfoMapper;
    @Autowired
    UserDeviceService userDeviceService;

    List<UserHealthInfo> healthInfoCache = new ArrayList<>();
    final int CACHE_THRESHOLD = 100;

    public List<UserHealthInfo> getHistoryHealthInfo(UserDetails user, HistoryHealthInfoRequest request){
        String type = request.getType();
        String startTime = request.getStartTime();
        String endTime = request.getEndTime();
        Account account = (Account) user;
        Integer id = account.getId();

        // string 时间转为 localdate 时间
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss:SSS");
        LocalDateTime st = LocalDateTime.parse(startTime, formatter);
        LocalDateTime et = LocalDateTime.parse(endTime, formatter);
        // 将时间范围拓展为整点
        st = st.withMinute(0).withSecond(0).withNano(0);
        et = et.withMinute(0).withSecond(0).withNano(0);

        // 创建返回类型
        List<UserHealthInfo> infos;

        // 判断类别
        if(type.equals("avgHour")){
            infos = userHealthInfoMapper.getAvgHours(id, st, et);
            // 处理每小时的数据
            processDateTime(infos,st, et,60, "yyyyMMddHH");
        } else if (type.equals("avgDay")) {
            infos = userHealthInfoMapper.getAvgDays(id, st, et);
            processAvgDays(infos,st,et);
        }  else if (type.equals("avgMonth")) {
            infos = userHealthInfoMapper.getAvgMonths(id, st, et);
            processAvgMonths(infos,st, et);
        } else {
            throw new RuntimeException("unknown type");
        }
        return infos;
    }

    public UserHealthInfo getCurrentHealthInfo(UserDetails user){
        Account account = (Account) user;
        Integer id = account.getId();

        //先检查用户是否有设备，没有设备返回空数据
        ArrayList<String> devices = userDeviceService.getDeviceByUser(user);
        if (devices.size() == 0){
            UserHealthInfo userHealthInfo = new UserHealthInfo();
            userHealthInfo.setAcctID(id);
            userHealthInfo.setOxygen(null);
            userHealthInfo.setTemperature(null);
            userHealthInfo.setHeartRate(null);
            return userHealthInfo;
        }

        QueryWrapper<UserHealthInfo> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("acct_id",id);
        queryWrapper.orderByDesc("timestamp");
        queryWrapper.last("LIMIT 1");

        UserHealthInfo userHealthInfo = userHealthInfoMapper.selectOne(queryWrapper);
        return userHealthInfo;
    }

    public void receiveHealthInfo(InsertHealthInfoRequest infoRequest){
        // 1. 查找设备匹配的用户
        int useID = userDeviceService.getUserByDevice(infoRequest.getDeviceID());

        // 2. 存储该用户的健康信息
        UserHealthInfo userHealthInfo = new UserHealthInfo(useID, infoRequest.getTimestamp(), infoRequest.getHeartRate(),
                infoRequest.getTemperature(), infoRequest.getOxygen());
        // 先缓存
        healthInfoCache.add(userHealthInfo);
        // 数量够了再一次性插入
        if (healthInfoCache.size()>=CACHE_THRESHOLD){
           userHealthInfoMapper.insertBatch(healthInfoCache);
           healthInfoCache.clear();
        }
    }

    private void processDateTime(List<UserHealthInfo> infoList,
                                    LocalDateTime startTime,LocalDateTime endTime,
                                    int interval, String pattern){

        ListIterator<UserHealthInfo> iterator = infoList.listIterator();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
        // 遍历查询的时间区间
        while (startTime.isBefore(endTime)){
            // 如果数组到头了，直接添加空对象到查询的终止时间
            if(!iterator.hasNext()){
                UserHealthInfo userHealthInfo = new UserHealthInfo();
                userHealthInfo.setTimestamp(startTime.format(formatter));
                iterator.add(userHealthInfo);
                startTime = startTime.plusMinutes(interval);
                continue;
            }
            UserHealthInfo info = iterator.next();
            LocalDateTime currentTime = LocalDateTime.parse(info.getTimestamp(), formatter);
            // 如果发现某个间隔的时间不存在，则插入一个空对象
            if(!currentTime.isEqual(startTime)){
                UserHealthInfo userHealthInfo = new UserHealthInfo();
                userHealthInfo.setTimestamp(startTime.format(formatter));
                iterator.previous();
                iterator.add(userHealthInfo);
            }
            startTime = startTime.plusMinutes(interval);
        }
    }

    private void processAvgDays(List<UserHealthInfo> infoList,
                             LocalDateTime startTime, LocalDateTime endTime){
        // 时间类型处理
        // LocalDateTime(精确类型) -> DateTime(日期类型)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String startDayStr = startTime.format(formatter);
        String endDayStr = endTime.format(formatter);
        LocalDate startDay = LocalDate.parse(startDayStr, formatter);
        LocalDate endDay = LocalDate.parse(endDayStr, formatter);

        ListIterator<UserHealthInfo> iterator = infoList.listIterator();

        // 接下来的流程和之前一样
        // 只不过时间类型变成了按天比较
        while (startDay.isBefore(endDay) || startDay.isEqual(endDay)){
            if(!iterator.hasNext()){
                UserHealthInfo userHealthInfo = new UserHealthInfo();
                userHealthInfo.setTimestamp(startDay.format(formatter));
                iterator.add(userHealthInfo);
                startDay = startDay.plusDays(1);
                continue;
            }
            UserHealthInfo info = iterator.next();
            LocalDate currentDay = LocalDate.parse(info.getTimestamp(), formatter);
            if(!currentDay.isEqual(startDay)){
                UserHealthInfo userHealthInfo = new UserHealthInfo();
                userHealthInfo.setTimestamp(startDay.format(formatter));
                iterator.previous();
                iterator.add(userHealthInfo);
            }
            startDay = startDay.plusDays(1);
        }
    }

    private void processAvgMonths(List<UserHealthInfo> infoList,
                                LocalDateTime startTime, LocalDateTime endTime){
        // 时间类型处理
        // LocalDateTime(精确类型) -> YearMonth(年月类型)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMM");
        String startMonthStr = startTime.format(formatter);
        String endMonthStr = endTime.format(formatter);
        YearMonth startMonth = YearMonth.parse(startMonthStr, formatter);
        YearMonth endMonth = YearMonth.parse(endMonthStr, formatter);

        ListIterator<UserHealthInfo> iterator = infoList.listIterator();

        // 接下来的流程和之前一样
        // 只不过时间类型变成了按月比较
        while (startMonth.isBefore(endMonth) || startMonth.equals(endMonth)){
            if(!iterator.hasNext()){
                UserHealthInfo userHealthInfo = new UserHealthInfo();
                userHealthInfo.setTimestamp(startMonth.format(formatter));
                iterator.add(userHealthInfo);
                startMonth = startMonth.plusMonths(1);
                continue;
            }
            UserHealthInfo info = iterator.next();
            YearMonth currentMonth = YearMonth.parse(info.getTimestamp(), formatter);
            if(!currentMonth.equals(startMonth)){
                UserHealthInfo userHealthInfo = new UserHealthInfo();
                userHealthInfo.setTimestamp(startMonth.format(formatter));
                iterator.previous();
                iterator.add(userHealthInfo);
            }
            startMonth = startMonth.plusMonths(1);
        }
    }

    // 辅助方法，定时清理缓存
    @Scheduled(fixedRate = 5000)
    public void pushCache(){
        if(!healthInfoCache.isEmpty()){
            userHealthInfoMapper.insertBatch(healthInfoCache);
            healthInfoCache.clear();
        }
    }

}
