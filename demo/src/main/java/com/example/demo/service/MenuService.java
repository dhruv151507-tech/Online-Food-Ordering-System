package com.example.demo.service;

import com.example.demo.model.Menu;
import com.example.demo.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuService {

    @Autowired
    private MenuRepository menuRepository;

    // ✅ Get all menu items
    public List<Menu> getAllMenuItems() {
        return menuRepository.findAll();
    }

    // ✅ Get single item by ID
    public Menu getMenuItemById(Long id) {
        Optional<Menu> item = menuRepository.findById(id);
        return item.orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
    }

    // ✅ Add new menu item
    public Menu addMenuItem(Menu menu) {
        return menuRepository.save(menu);
    }

    // ✅ Update existing item
    public Menu updateMenuItem(Long id, Menu updatedMenu) {
        Menu existing = getMenuItemById(id);

        existing.setName(updatedMenu.getName());
        existing.setPrice(updatedMenu.getPrice());
        existing.setCategory(updatedMenu.getCategory());
        existing.setImageUrl(updatedMenu.getImageUrl());
        existing.setDescription(updatedMenu.getDescription());

        return menuRepository.save(existing);
    }

    // ✅ Delete menu item
    public void deleteMenuItem(Long id) {
        Menu existing = getMenuItemById(id);
        menuRepository.delete(existing);
    }

    // ✅ Get items by category (extra feature ⭐)
    public List<Menu> getItemsByCategory(String category) {
        return menuRepository.findByCategory(category);
    }
}