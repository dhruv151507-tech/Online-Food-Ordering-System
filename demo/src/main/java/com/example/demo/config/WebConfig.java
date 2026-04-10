package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.io.File;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Get the uploads directory path
        String userHome = System.getProperty("user.home");
        String uploadDir = userHome + File.separator + "foodOrderingSystem" + File.separator + "uploads" + File.separator;
        
        // Convert to proper file URI format for Windows
        String fileUri = "file:///" + uploadDir.replace("\\", "/");
        
        // Map /uploads/** to the actual file system directory
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(fileUri)
                .setCachePeriod(3600)
                .resourceChain(true);
    }
}
