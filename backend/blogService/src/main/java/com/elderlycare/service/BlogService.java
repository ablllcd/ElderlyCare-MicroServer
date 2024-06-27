package com.elderlycare.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.elderlycare.dao.BlogCommentMapper;
import com.elderlycare.dao.BlogImageMapper;
import com.elderlycare.dao.BlogMapper;
import com.elderlycare.dao.BlogUserLikeMapper;
import com.elderlycare.pojo.Blog;
import com.elderlycare.pojo.BlogComment;
import com.elderlycare.pojo.BlogImage;
import com.elderlycare.pojo.BlogUserLike;
import com.elderlycare.pojo.Responses.BlogResponse;
import com.elderlycare.pojo.Responses.CommentResponse;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BlogService {
    @Autowired
    BlogMapper blogMapper;
    @Autowired
    BlogImageMapper blogImageMapper;
    @Autowired
    BlogCommentMapper blogCommentMapper;
    @Autowired
    BlogUserLikeMapper blogUserLikeMapper;

    @Value("${my.custom.blogImageBasePath}")
    private String basicBlogImageDir;
    @Value("${my.custom.userImageBasePath}")
    private String basicUserImageDir;
    @Value("${my.custom.localIP}")
    private String ipAddress;
    @Value("${server.port}")
    private String port;

    ArrayList<Integer> preBlog = new ArrayList<>();

    // 添加一个blog
    public void blogPost(Blog blog, List<MultipartFile> images) {
        // MySQL存储blog表的基本信息
        blogMapper.insert(blog);
        int blogID = blog.getBlogID();

        // 图片存储
        if (images != null) {
            int imageIndex = 0;
            for (MultipartFile image : images) {
                // 图片名作为图片的标识，结构为： blogID-imageIndex.png
                imageIndex++;
                // 本地存储blog内的图片
                String filename = blogID + "-" + imageIndex + ".png";
                File newFile = new File(basicBlogImageDir + filename);
                try {
                    image.transferTo(newFile);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                // MySQL存储blog-image的映射关系
                BlogImage blogImage = new BlogImage(blogID, filename);
                blogImageMapper.insert(blogImage);
            }
        }
    }

    // 用户删除一条blog
    public void blogDelete(Integer blogID) {
        // 1. 查询blog的图片
        QueryWrapper<BlogImage> blogImageQueryWrapper = new QueryWrapper<>();
        blogImageQueryWrapper.eq("blog_id", blogID);
        List<BlogImage> blogImages = blogImageMapper.selectList(blogImageQueryWrapper);
        // 1.1 删除blog图片的数据库记录
        blogImageMapper.delete(blogImageQueryWrapper);

        // 1.2 删除实际图片
        for (BlogImage blogImage : blogImages) {
            String imageName = blogImage.getImageName();
            File newFile = new File(basicBlogImageDir + imageName);
            newFile.delete();
        }

        // 2. 删除blog的评论
        QueryWrapper<BlogComment> blogCommentQueryWrapper = new QueryWrapper<>();
        blogCommentQueryWrapper.eq("blog_id", blogID);
        blogCommentMapper.delete(blogCommentQueryWrapper);

        // 3. 删除用户点赞
        QueryWrapper<BlogUserLike> blogUserLikeQueryWrapper = new QueryWrapper<>();
        blogUserLikeQueryWrapper.eq("blog_id", blogID);
        blogUserLikeMapper.delete(blogUserLikeQueryWrapper);

        // 删除blog
        blogMapper.deleteById(blogID);
    }

    // 用户在blog下发表一条评论
    public void commentPost(int userID, int blogID, String comment) {
        BlogComment blogComment = new BlogComment(null, blogID, userID, comment);
        blogCommentMapper.insert(blogComment);
    }

    public void commentDelete(int commentID) {
        blogCommentMapper.deleteById(commentID);
    }

    // 用户在blog下点赞
    public String likePost(int blogID, int userID) {
        long startTime, query1Time, query2Time, query3Time;

        // 判断用户是否以及点过赞了， 如果点赞过了则不操作
        QueryWrapper<BlogUserLike> blogUserLikeQueryWrapper = new QueryWrapper<>();
        blogUserLikeQueryWrapper.eq("user_id", userID).eq("blog_id", blogID);
        BlogUserLike liked = blogUserLikeMapper.selectOne(blogUserLikeQueryWrapper);
        if (liked != null) {
            return "Blog is already liked!";
        }

        // 根据blogID查询blog，使其like+1
        UpdateWrapper<Blog> blogUpdateWrapper = new UpdateWrapper<>();
        blogUpdateWrapper.eq("blog_id", blogID).setSql("likes = likes + 1");
        blogMapper.update(blogUpdateWrapper);


        // 记录用户点赞行为
        BlogUserLike blogUserLike = new BlogUserLike(null, userID, blogID);
        blogUserLikeMapper.insert(blogUserLike);

        return "user add one like";
    }

    // 用户在blog下取消点赞
    public String likeDelete(int blogID, int userID) {
        // 判断用户是否以及点过赞了， 如果没有点赞过了则不操作
        QueryWrapper<BlogUserLike> blogUserLikeQueryWrapper = new QueryWrapper<>();
        blogUserLikeQueryWrapper.eq("user_id", userID).eq("blog_id", blogID);
        BlogUserLike liked = blogUserLikeMapper.selectOne(blogUserLikeQueryWrapper);
        if (liked == null) {
            return "Blog is not liked!";
        }

        //  根据blogID查询blog，使其like-1
        UpdateWrapper<Blog> blogUpdateWrapper = new UpdateWrapper<>();
        blogUpdateWrapper.eq("blog_id", blogID).setSql("likes = likes - 1");
        blogMapper.update(blogUpdateWrapper);

        // 删除用户点赞行为
        blogUserLikeMapper.delete(blogUserLikeQueryWrapper);

        return "user cancel one like";
    }

    // blog主页分页获取blog
    public PageInfo<BlogResponse> getBlogHomePage(int userID, int pageSize, int pageIndex) {
        // 1. 分页查询
        PageHelper.startPage(pageIndex, pageSize);
        List<BlogResponse> blogList = blogMapper.getBlogUserList();
        PageInfo<BlogResponse> blogPageInfo = new PageInfo<>(blogList);

        // 2. 获取用户点赞信息,并存储为set来方便查找
        QueryWrapper<BlogUserLike> blogUserLikeQueryWrapper = new QueryWrapper<>();
        blogUserLikeQueryWrapper.eq("user_id", userID);
        List<BlogUserLike> userLikeList = blogUserLikeMapper.selectList(blogUserLikeQueryWrapper);
        Set<Integer> likedBlogs = userLikeList.stream().map(i -> i.getBlogID()).collect(Collectors.toSet());

        List<BlogResponse> basicBlogs = blogPageInfo.getList();
        // 处理每个blog
        for (BlogResponse basicBlog : basicBlogs) {
            // 3 将分页后的blog添加图片信息
            Integer blogID = basicBlog.getBlogID();
            // 3.1 获取图片信息
            QueryWrapper<BlogImage> blogImageQueryWrapper = new QueryWrapper<>();
            blogImageQueryWrapper.eq("blog_id", blogID);
            List<BlogImage> blogImages = blogImageMapper.selectList(blogImageQueryWrapper);

            // 3.2 将图片名转为图片uri路径
            List<String> imageList = new ArrayList<>();
            for (BlogImage blogImage : blogImages) {
                String imageName = blogImage.getImageName();
                String imageURI = imageNameToURI(ipAddress, port, "/image/blog/", imageName);
                imageList.add(imageURI);
            }
            basicBlog.setBlogImageList(imageList);

            // 3.3 作者图片名转URI
            String imgName = basicBlog.getUserProfileURI();
            String realURI = imageNameToURI(ipAddress, port, "/image/user/", imgName);
            basicBlog.setUserProfileURI(realURI);

            // 4. 判断用户是否点赞了该blog
            if (likedBlogs.contains(blogID)) {
                basicBlog.setLiked(true);
            } else {
                basicBlog.setLiked(false);
            }
        }

        blogPageInfo.setList(basicBlogs);
        return blogPageInfo;
    }

    // 点击某个blog来获取详情页
    public BlogResponse getSpecificBlog(int userID, int blogID) {
        // 多表联查来获取： blog信息， 作者信息， 评论信息， 评论发布者信息

        // 0. 获取blog和作者信息
        BlogResponse blogResponse = blogMapper.getBlogAndUser(blogID);
        // 0.1 作者图片名转URI
        String imgName = blogResponse.getUserProfileURI();
        String realURI = imageNameToURI(ipAddress, port, "/image/user/", imgName);
        blogResponse.setUserProfileURI(realURI);

        // 1. 获取图片信息
        QueryWrapper<BlogImage> blogImageQueryWrapper = new QueryWrapper<>();
        blogImageQueryWrapper.eq("blog_id", blogID);
        List<BlogImage> blogImages = blogImageMapper.selectList(blogImageQueryWrapper);

        // 1.1 将图片名转为图片uri路径
        List<String> imageList = new ArrayList<>();
        for (BlogImage blogImage : blogImages) {
            String imageName = blogImage.getImageName();
            String imageURI = imageNameToURI(ipAddress, port, "/image/blog/", imageName);
            imageList.add(imageURI);
        }
        blogResponse.setBlogImageList(imageList);

        // 2. 获取评论信息
        List<CommentResponse> commentList = blogCommentMapper.getDetailedCommentByBlog(blogID);
        // 2.1 将评论者的图片名转为URI
        for (CommentResponse commentResponse : commentList) {
            String userImageName = commentResponse.getUserImage();
            String imageURI = imageNameToURI(ipAddress, port, "/image/user/", userImageName);
            commentResponse.setUserImage(imageURI);
        }
        blogResponse.setCommentList(commentList);

        // 3. 获取用户点赞信息,并存储为set来方便查找
        QueryWrapper<BlogUserLike> blogUserLikeQueryWrapper = new QueryWrapper<>();
        blogUserLikeQueryWrapper.eq("user_id", userID);
        List<BlogUserLike> userLikeList = blogUserLikeMapper.selectList(blogUserLikeQueryWrapper);
        Set<Integer> likedBlogs = userLikeList.stream().map(i -> i.getBlogID()).collect(Collectors.toSet());

        if (likedBlogs.contains(blogID)) {
            blogResponse.setLiked(true);
        } else {
            blogResponse.setLiked(false);
        }

        return blogResponse;
    }

    // 根据用户输入搜索blog,
    public PageInfo<BlogResponse> blogSearch(int pageIndex, int pageSize, String searchKey, int userID) {
        // 1. 分页+模糊搜索
        PageHelper.startPage(pageIndex, pageSize);
        List<BlogResponse> blogResponseList = blogMapper.searchBlogUserList(searchKey);
        PageInfo<BlogResponse> blogPageInfo = new PageInfo<>(blogResponseList);

        // 2. 获取用户点赞信息,并存储为set来方便查找
        QueryWrapper<BlogUserLike> blogUserLikeQueryWrapper = new QueryWrapper<>();
        blogUserLikeQueryWrapper.eq("user_id", userID);
        List<BlogUserLike> userLikeList = blogUserLikeMapper.selectList(blogUserLikeQueryWrapper);
        Set<Integer> likedBlogs = userLikeList.stream().map(i -> i.getBlogID()).collect(Collectors.toSet());

        // 3 将分页后的blog添加图片信息
        List<BlogResponse> basicBlogs = blogPageInfo.getList();
        for (BlogResponse basicBlog : basicBlogs) {
            Integer blogID = basicBlog.getBlogID();
            // 3.1 获取图片信息
            QueryWrapper<BlogImage> blogImageQueryWrapper = new QueryWrapper<>();
            blogImageQueryWrapper.eq("blog_id", blogID);
            List<BlogImage> blogImages = blogImageMapper.selectList(blogImageQueryWrapper);

            // 3.2 将图片名转为图片uri路径
            List<String> imageList = new ArrayList<>();
            for (BlogImage blogImage : blogImages) {
                String imageName = blogImage.getImageName();
                String imageURI = imageNameToURI(ipAddress, port, "/image/blog/", imageName);
                imageList.add(imageURI);
            }
            basicBlog.setBlogImageList(imageList);

            // 3.3 作者图片名转URI
            String imgName = basicBlog.getUserProfileURI();
            String realURI = imageNameToURI(ipAddress, port, "/image/user/", imgName);
            basicBlog.setUserProfileURI(realURI);

            // 4. 判断用户是否点赞了该blog
            if (likedBlogs.contains(blogID)) {
                basicBlog.setLiked(true);
            } else {
                basicBlog.setLiked(false);
            }
        }

        return blogPageInfo;
    }

    // 辅助功能，根据图像名返回图像二进制数据
    public ResponseEntity<byte[]> getBlogImageBytes(String imageName) {
        Path path = Paths.get(basicBlogImageDir + imageName);
        try {
            byte[] imageBytes = Files.readAllBytes(path);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    public ResponseEntity<byte[]> getUserImageBytes(String imageName) {
        Path path = Paths.get(basicUserImageDir + imageName);
        try {
            byte[] imageBytes = Files.readAllBytes(path);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    // 辅助功能
    public String imageNameToURI(String ipAddress, String port, String methodPath, String imageName) {
        return ipAddress + ":" + port + methodPath + imageName;
    }


}
