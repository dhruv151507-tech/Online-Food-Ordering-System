package com.example.demo.controller;

import com.example.demo.model.Order;
import com.example.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@CrossOrigin
public class OrderController {

    @Autowired
    private OrderService service;
// place orders
    @PostMapping
    public Order placeOrder(@RequestBody Order order) {
        return service.placeOrder(order);
    }
// get all orders for user and admin
    @GetMapping
    public List<Order> getAllOrders() {
        return service.getAllOrders();
    }
// update order status by admin
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable Long id, @RequestParam String status) {
        return service.updateOrderStatus(id, status);
    }
// get order by id
    @GetMapping("/{id}")
    public Order getOrder(@PathVariable Long id) {
        return service.getOrderById(id);
    }
// delete order by admin
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteOrder(@PathVariable Long id) {
        service.deleteOrder(id);
        return "Order deleted successfully";
    }
}