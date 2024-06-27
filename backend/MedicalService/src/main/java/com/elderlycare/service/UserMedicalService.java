package com.elderlycare.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.elderlycare.mapper.IntakeMapper;
import com.elderlycare.mapper.MedicineMapper;
import com.elderlycare.pojo.Intake;
import com.elderlycare.pojo.Medicine;
import com.elderlycare.pojo.MedicineIntake;
import com.elderlycare.pojo.Requests.MultiTimeMedicineRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserMedicalService {
    @Autowired
    MedicineMapper medicineMapper;
    @Autowired
    IntakeMapper intakeMapper;

    public void addMedicine(int userID, MultiTimeMedicineRequest medicineRequest) {

        // 时间数组映射为多条数据并插入
        List<Medicine> medicineList = new ArrayList<>();
        for (String startTime : medicineRequest.getStartTimes()) {
            Medicine medicine = new Medicine();
            medicine.setUserId(userID);
            medicine.setMedicineName(medicineRequest.getMedicineName());
            medicine.setMedicineType(medicineRequest.getMedicineType());
            medicine.setStartTime(startTime);
            medicine.setFrequency(medicineRequest.getFrequency());
            medicine.setAmount(medicineRequest.getAmount());
            medicineList.add(medicine);
        }

        medicineMapper.insertBatch(medicineList);
    }

    public List<MultiTimeMedicineRequest> getAllMedicine(int userID) {

        // 获取该用户的所有药品记录，并将相同药品不同start time的记录合并在一起
        List<MultiTimeMedicineRequest> responses = medicineMapper.selectAllMedicines(userID);
        return responses;
    }

    public void deleteMedicineWithMultiTime(int userID, MultiTimeMedicineRequest multiTimeMedicineRequest) {

        // 删除该药品的所有时间提醒
        for (String startTime : multiTimeMedicineRequest.getStartTimes()) {
            QueryWrapper<Medicine> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("acct_id", userID)
                    .eq("medicine_name", multiTimeMedicineRequest.getMedicineName())
                    .eq("medicine_type", multiTimeMedicineRequest.getMedicineType())
                    .eq("start_time", startTime)
                    .eq("frequency", multiTimeMedicineRequest.getFrequency())
                    .eq("amount", multiTimeMedicineRequest.getAmount());
            // 删除该药品对应的intake记录
            Medicine medicine = medicineMapper.selectOne(queryWrapper);
            deleteIntake(medicine.getMedicineId());
            // 删除药品
            medicineMapper.delete(queryWrapper);
        }
    }

    public void deleteSingleMedicineTime(int userID, Medicine medicine) {

        QueryWrapper<Medicine> deleteQuery = new QueryWrapper<>();
        deleteQuery.eq("acct_id", userID)
                .eq("medicine_name", medicine.getMedicineName())
                .eq("medicine_type", medicine.getMedicineType())
                .eq("start_time", medicine.getStartTime())
                .eq("frequency", medicine.getFrequency())
                .eq("amount", medicine.getAmount());
        // 删除该药品对应的intake记录
        Medicine res = medicineMapper.selectOne(deleteQuery);
        deleteIntake(res.getMedicineId());
        // 删除药品
        medicineMapper.delete(deleteQuery);
    }

    public void deleteIntake(int medicineID) {
        QueryWrapper<Intake> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("medicine_id", medicineID);
        intakeMapper.delete(queryWrapper);
    }

    public void addMedicineIntake(int userID, MedicineIntake medicineIntake) {

        // 先查询药品ID
        QueryWrapper<Medicine> queryMedicineID = new QueryWrapper<>();
        queryMedicineID.eq("acct_id", userID)
                .eq("medicine_name", medicineIntake.getMedicineName())
                .eq("medicine_type", medicineIntake.getMedicineType())
                .eq("start_time", medicineIntake.getStartTime())
                .eq("frequency", medicineIntake.getFrequency())
                .eq("amount", medicineIntake.getAmount());
        Medicine medicine = medicineMapper.selectOne(queryMedicineID);

        // 利用药品ID插入intake信息
        Intake intake = new Intake();
        intake.setMedicineId(medicine.getMedicineId());
        intake.setIntake(medicineIntake.isIntake());
        intake.setTime(medicineIntake.getTime());

        intakeMapper.insert(intake);
    }

    public ArrayList<MedicineIntake> getMedicineIntakeByTime(int userID, String currentDate) {

        // 创建响应类
        ArrayList<MedicineIntake> responses = new ArrayList<>();

        // 获取用户所有药物
        QueryWrapper<Medicine> queryAllMedicines = new QueryWrapper<>();
        queryAllMedicines.eq("acct_id", userID);
        List<Medicine> medicines = medicineMapper.selectList(queryAllMedicines);

        for (Medicine medicine : medicines) {
            // 1. 判断该药品今日是否需要服用
            // 转换start time 为日期类型
            String startTime = medicine.getStartTime();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime startDT = LocalDateTime.parse(startTime, formatter);
            LocalDate startDate = startDT.toLocalDate();
            // 转换currentDate 为日期类型
            DateTimeFormatter formatter2 = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate curDate = LocalDate.parse(currentDate, formatter2);
            // 计算相差天数；和用药频率进行比较
            Period between = Period.between(startDate, curDate);
            int days = between.getDays();
            int frequency = medicine.getFrequency();
            if (days % frequency == 0 && days >= 0) {
                // 2. 通过的为今日需要服用的药，进一步判断该药今日是否已经服用
                MedicineIntake response = new MedicineIntake();
                response.setMedicineName(medicine.getMedicineName());
                response.setMedicineType(medicine.getMedicineType());
                response.setStartTime(medicine.getStartTime());
                response.setFrequency(medicine.getFrequency());
                response.setAmount(medicine.getAmount());

                // 获取该药最近一次用药记录
                QueryWrapper<Intake> queryIntakeById = new QueryWrapper<>();
                queryIntakeById.eq("medicine_id", medicine.getMedicineId())
                        .orderByDesc("time");
                Intake intake = intakeMapper.selectOne(queryIntakeById);

                // 如果intake为空，则今日需要服用
                if (intake == null) {
                    response.setIntake(false);
                } else {
                    // intake不为空，则判断服用日期是否为今日
                    String intakeTime = intake.getTime();
                    LocalDate intakeDate = LocalDateTime.parse(intakeTime, formatter).toLocalDate();
                    if (intakeDate.isEqual(curDate)) {
                        // 服用日期为今天，今日无需服用
                        response.setIntake(true);
                        response.setTime(intakeTime);
                    } else {
                        //服用日期不为今日，今日需要服用
                        response.setIntake(false);
                    }
                }
                responses.add(response);
            }
        }
        return responses;
    }
}
