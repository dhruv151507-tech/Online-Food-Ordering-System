package com.example.demo.controller;

import com.example.demo.model.Menu;
import com.example.demo.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin
public class MenuController {

    @Autowired
    private MenuService service;

    // ✅ Get all menu items
    @GetMapping
    public List<Menu> getMenu() {
        return service.getAllMenuItems();
    }

    // ✅ Get single menu item by ID
    @GetMapping("/{id}")
    public Menu getMenuById(@PathVariable Long id) {
        return service.getMenuItemById(id);
    }

    // ✅ Add new menu item (Admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Menu addMenu(@RequestBody Menu menu) {
        return service.addMenuItem(menu);
    }

    // ✅ Update menu item (Admin only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Menu updateMenu(@PathVariable Long id, @RequestBody Menu menu) {
        return service.updateMenuItem(id, menu);
    }

    // ✅ Delete menu item (Admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteMenu(@PathVariable Long id) {
        service.deleteMenuItem(id);
    }

    // ✅ Upload menu item image (Admin only)
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> uploadImage(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        
        if (file.isEmpty()) {
            response.put("error", "No file selected");
            return response;
        }

        try {
            // Create uploads directory using absolute path in user home
            String userHome = System.getProperty("user.home");
            String uploadDir = userHome + File.separator + "foodOrderingSystem" + File.separator + "uploads" + File.separator + "images";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // Save file
            String filePath = uploadDir + File.separator + uniqueFilename;
            File destinationFile = new File(filePath);
            file.transferTo(destinationFile);

            // Return URL path that will be served by WebConfig resource handler
            String imageUrl = "/uploads/images/" + uniqueFilename;
            response.put("imageUrl", imageUrl);
            response.put("success", "true");

            return response;
        } catch (IOException e) {
            response.put("error", "Failed to upload file: " + e.getMessage());
            return response;
        }
    }
}