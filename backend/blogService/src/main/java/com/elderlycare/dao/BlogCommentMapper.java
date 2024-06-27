package com.elderlycare.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.elderlycare.pojo.BlogComment;
import com.elderlycare.pojo.Responses.CommentResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BlogCommentMapper extends BaseMapper<BlogComment> {
    public List<CommentResponse> getDetailedCommentByBlog(@Param("blogID") int blogID);
}
