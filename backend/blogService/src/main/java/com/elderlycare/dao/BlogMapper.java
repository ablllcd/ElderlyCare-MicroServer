package com.elderlycare.dao;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.elderlycare.pojo.Blog;
import com.elderlycare.pojo.Responses.BlogResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
//@TableName("blog_table")
public interface BlogMapper extends BaseMapper<Blog> {
    public BlogResponse getBlogAndUser(@Param("blogID") Integer blogID);

    public List<BlogResponse> getBlogUserList();

    public List<BlogResponse> searchBlogUserList(@Param("searchKey") String searchKey);
}

