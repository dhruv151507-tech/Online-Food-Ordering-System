package com.example.demo.service;

import com.example.demo.model.Order;
import com.example.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private OrderRepository orderRepository;

    // Total Orders
    public long getTotalOrders() {
        return orderRepository.count();
    }

    // Total Revenue
    public double getTotalRevenue() {
        List<Order> orders = orderRepository.findAll();

        double total = 0;
        for (Order order : orders) {
            total += order.getTotalPrice();
        }

        return total;
    }

    // Pending Orders
    public long getPendingOrders() {
        return orderRepository.findAll()
                .stream()
                .filter(o -> "Pending".equalsIgnoreCase(o.getStatus()))
                .count();
    }

    public List<Map<String, Object>> getOrdersPerDay() {
        return orderRepository.getOrdersPerDay()
                .stream()
                .map(row -> {
                    Map<String, Object> point = new LinkedHashMap<>();
                    point.put("date", String.valueOf(row[0]));
                    point.put("orders", ((Number) row[1]).longValue());
                    return point;
                })
                .toList();
    }

    public List<Map<String, Object>> getMostOrderedItems() {
        return orderRepository.getMostOrderedItems()
                .stream()
                .map(row -> {
                    Map<String, Object> point = new LinkedHashMap<>();
                    point.put("item", row[0]);
                    point.put("quantity", ((Number) row[1]).longValue());
                    return point;
                })
                .toList();
    }

    public Map<String, Object> getDashboardAnalytics() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("totalOrders", getTotalOrders());
        data.put("totalRevenue", getTotalRevenue());
        data.put("pendingOrders", getPendingOrders());
        data.put("ordersPerDay", getOrdersPerDay());
        data.put("mostOrderedItems", getMostOrderedItems());
        return data;
    }
}
