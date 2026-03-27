package com.busbooking.service;

import com.busbooking.model.User;
import com.busbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if ("ROLE_ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Admin accounts cannot be deleted.");
        }
        userRepository.deleteById(id);
    }
}
