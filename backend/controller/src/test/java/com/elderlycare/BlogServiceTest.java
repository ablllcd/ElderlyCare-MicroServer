package com.elderlycare;

import com.elderlycare.service.BlogManagement.BlogService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest()
public class BlogServiceTest {
    @Autowired
    BlogService blogService;

    @Test
    public void pageTest() {
        blogService.getBlogHomePage(18, 0, 0);
    }

}
