package com.elderlycare.controller;

import com.elderlycare.pojo.*;
import com.elderlycare.pojo.Responses.BlogResponse;
import com.elderlycare.service.BlogManagement.BlogService;
import com.github.pagehelper.PageInfo;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
public class BlogController {
    @Autowired
    BlogService blogService;

    @PostMapping("/blog/upload")
    public String blogUpload(@RequestParam(value = "images", required = false) List<MultipartFile> images,
                             @RequestParam("title") String title,
                             @RequestParam("content") String content,
                             @RequestParam("address") String address,
                             @RequestParam("detailedAddress") String detailedAddress,
                             @RequestParam("editTime") String editTimeString,
                             Authentication authentication
    ) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Account account = (Account) userDetails;
        int userId = account.getId();
        // todo: 获取可见度
        // 0：所有人可见 | 其他属性待定
        int visibility = 0;

        // 将字符串解析为 LocalDateTime 对象
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        LocalDateTime editTime = LocalDateTime.parse(editTimeString, formatter);
        // 封装参数, 初始likes为0
        Blog blog = new Blog(null, userId, title, content, address, detailedAddress, editTime, 0, visibility);
        blogService.blogPost(blog, images);

        return "Upload successful";
    }

    @RequestMapping("/blog/delete")
    public String blogDelete(@RequestParam("blogID") int blogID) {
        blogService.blogDelete(blogID);

        return "Delete Success";
    }

    @RequestMapping("blog/specific")
    public BlogResponse blogSpecificOne(@RequestParam("blogID") int blogID, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Account account = (Account) userDetails;
        int userId = account.getId();

        return blogService.getSpecificBlog(userId, blogID);
    }

    @GetMapping("/blog/homepage")
    public PageInfo<BlogResponse> bolgResponse(@Param("pageIndex") int pageIndex,
                                               @Param("pageSize") int pageSize,
                                               Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Account account = (Account) userDetails;
        int userId = account.getId();

        return blogService.getBlogHomePage(userId, pageSize, pageIndex);
    }

    @GetMapping("/blog/search")
    public PageInfo<BlogResponse> bolgResponse(@Param("pageIndex") int pageIndex,
                                               @Param("pageSize") int pageSize,
                                               @Param("searchKey") String searchKey,
                                               Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Account account = (Account) userDetails;
        int userId = account.getId();
        return blogService.blogSearch(pageIndex, pageSize, searchKey, userId);
    }

    @PostMapping("/blog/like")
    public String blogAddLike(@RequestParam("blogID") int blogID,
                              Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Account account = (Account) userDetails;
        int userId = account.getId();

        return blogService.likePost(blogID, userId);
    }

    @PostMapping("/blog/unlike")
    public String blogCancelLike(@RequestParam("blogID") int blogID,
                                 Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Account account = (Account) userDetails;
        int userId = account.getId();

        return blogService.likeDelete(blogID, userId);
    }

    @PostMapping("/blog/comment/add")
    public String addComment(@RequestParam("blogID") int blogID,
                             @RequestParam("comment") String comment,
                             Authentication authentication
    ) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Account account = (Account) userDetails;
        int userId = account.getId();

        blogService.commentPost(userId, blogID, comment);

        return "Add Comment Success";
    }

    @RequestMapping("/blog/comment/delete")
    public String deleteComment(@RequestParam("commentID") int commentID) {
        blogService.commentDelete(commentID);
        return "Delete Comment Success";
    }

    @GetMapping("/image/blog/{imageName}")
    public ResponseEntity<byte[]> getBlogImage(@PathVariable String imageName) {
        return blogService.getBlogImageBytes(imageName);
    }

    @GetMapping("/image/user/{imageName}")
    public ResponseEntity<byte[]> getUserImage(@PathVariable String imageName) {
        return blogService.getUserImageBytes(imageName);
    }

    // 下边是考虑删除的


//    @GetMapping("/blog/search/{n}")
//    public List<Blog> blogSearch(@PathVariable int n) {
//        return blogService.blogSearchService(n);
//    }
//
//
//
//    public static void main(String[] args) {
//    }
}
