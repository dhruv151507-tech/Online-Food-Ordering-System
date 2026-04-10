package com.example.demo.service;

import com.example.demo.model.Order;
import com.example.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
                .filter(o -> o.getStatus().equals("Pending"))
                .count();
    }
}