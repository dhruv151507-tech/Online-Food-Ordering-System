package com.example.demo.repository;

import com.example.demo.model.Order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("""
            SELECT FUNCTION('DATE', o.createdAt), COUNT(o)
            FROM Order o
            GROUP BY FUNCTION('DATE', o.createdAt)
            ORDER BY FUNCTION('DATE', o.createdAt)
            """)
    List<Object[]> getOrdersPerDay();

    @Query("""
            SELECT m.name, SUM(oi.quantity)
            FROM Order o
            JOIN o.items oi
            JOIN Menu m ON m.id = oi.menuId
            GROUP BY m.id, m.name
            ORDER BY SUM(oi.quantity) DESC
            """)
    List<Object[]> getMostOrderedItems();

    List<Order> findByUserUsername(String username);
}
