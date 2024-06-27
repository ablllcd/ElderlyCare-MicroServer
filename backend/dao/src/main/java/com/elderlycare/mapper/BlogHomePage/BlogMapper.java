package com.elderlycare.mapper.BlogHomePage;


import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.elderlycare.pojo.*;
import com.elderlycare.pojo.Responses.BlogResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.io.Serializable;
import java.util.List;

@Mapper
//@TableName("blog_table")
public interface BlogMapper extends BaseMapper<Blog> {
    public BlogResponse getBlogAndUser(@Param("blogID") Integer blogID);

    public List<BlogResponse> getBlogUserList();

    public List<BlogResponse> searchBlogUserList(@Param("searchKey") String searchKey);
}

