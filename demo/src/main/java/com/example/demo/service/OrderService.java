package com.example.demo.service;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.demo.repository.UserRepository;
import com.example.demo.model.Order;
import com.example.demo.model.OrderItem;
import com.example.demo.model.User;
import com.example.demo.repository.MenuRepository;
import com.example.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
// import com.example.demo.model.User;
import java.util.List;

@Service
public class OrderService {
@Autowired
private UserRepository userRepository;
@Autowired
private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
// checks the role of current logged-in user and return orders accordingly
// getAuthorities() → get roles
// anyMatch() → check if role exists
// "ROLE_ADMIN" → admin check
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> "ROLE_ADMIN".equals(grantedAuthority.getAuthority()));

        if (isAdmin) {
            return orderRepository.findAll();
        }

        return orderRepository.findByUserUsername(username);
    }

    @Autowired
    private MenuRepository menuRepository;
//placeorder and get price summary
   public Order placeOrder(Order order) {
    if (order.getItems() == null || order.getItems().isEmpty()) {
        throw new RuntimeException("Order must contain at least one item");
    }

    double total = 0;

    for (OrderItem item : order.getItems()) {
        if (item.getQuantity() <= 0) {
            throw new RuntimeException("Item quantity must be greater than zero");
        }

        double price = menuRepository.findById(item.getMenuId())
                .orElseThrow(() -> new RuntimeException("Item not found"))
                .getPrice();

        total += price * item.getQuantity();
    }

    order.setTotalPrice(total);
    order.setStatus("Pending");

    //  ADD THIS PART
    String username = SecurityContextHolder.getContext()
            .getAuthentication()
            .getName();

    User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

    order.setUser(user);

    return orderRepository.save(order);
}
//    update order status
    public Order updateOrderStatus(Long id, String status) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);

        return orderRepository.save(order);
    }
//get order by id logic
    public Order getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> "ROLE_ADMIN".equals(grantedAuthority.getAuthority()));

        if (isAdmin || (order.getUser() != null && username.equals(order.getUser().getUsername()))) {
            return order;
        }

        throw new AccessDeniedException("You are not allowed to view this order");
    }
//    delete order
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
    // get total orders per day
    public List<Object[]> getOrdersPerDay() {
    return orderRepository.getOrdersPerDay();
}
}
