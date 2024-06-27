package com.elderlycare.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.elderlycare.pojo.Medicine;
import com.elderlycare.pojo.Requests.MultiTimeMedicineRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MedicineMapper extends BaseMapper<Medicine> {

    void insertBatch(@Param("list") List<Medicine> medicines);

    List<MultiTimeMedicineRequest> selectAllMedicines(@Param("uid") Integer uid);
}
