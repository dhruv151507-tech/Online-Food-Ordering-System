package com.example.demo.controller;

import com.example.demo.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class DashboardController {

    @Autowired
    private DashboardService service;
//ADMIN DASHBOARD
    @GetMapping
    public Map<String, Object> getDashboard() {

        Map<String, Object> data = new HashMap<>();

        data.put("totalOrders", service.getTotalOrders());
        data.put("totalRevenue", service.getTotalRevenue());
        data.put("pendingOrders", service.getPendingOrders());

        return data;
    }
}