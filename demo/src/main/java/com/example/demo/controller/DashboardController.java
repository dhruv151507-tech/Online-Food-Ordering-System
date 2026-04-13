package com.example.demo.controller;

import com.example.demo.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class DashboardController {

    @Autowired
    private DashboardService service;
// get dashboard analytics
    @GetMapping
    public Map<String, Object> getDashboard() {
        return service.getDashboardAnalytics();
    }
// get total orders
    @GetMapping("/analytics/total-orders")
    public long getTotalOrders() {
        return service.getTotalOrders();
    }
// get total orders per day
    @GetMapping("/analytics/orders-per-day")
    public List<Map<String, Object>> getOrdersPerDay() {
        return service.getOrdersPerDay();
    }
// get most ordered items
    @GetMapping("/analytics/most-ordered-items")
    public List<Map<String, Object>> getMostOrderedItems() {
        return service.getMostOrderedItems();
    }
}
