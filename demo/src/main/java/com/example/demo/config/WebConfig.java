package com.example.demo.config;

import java.io.File;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String userHome = System.getProperty("user.home");
        String uploadDir = userHome + File.separator + "foodOrderingSystem" + File.separator + "uploads" + File.separator;

        String fileUri = "file:///" + uploadDir.replace("\\", "/");

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(fileUri)
                .setCachePeriod(3600)
                .resourceChain(true);
    }
}
