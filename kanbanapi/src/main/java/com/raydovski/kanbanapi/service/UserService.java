package com.raydovski.kanbanapi.service;

import javax.transaction.Transactional;

import com.raydovski.kanbanapi.dto.Credentials;
import com.raydovski.kanbanapi.dto.UserDto;
import com.raydovski.kanbanapi.entity.User;
import com.raydovski.kanbanapi.repository.UserRepository;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    public User getUserFromAuthentication(Authentication authentication) {
        return this.get(authentication.getName());
    }

    public UserDto create(Credentials credentials) {
        User user = new User();
        user.setEmail(credentials.getEmail());
        user.setPassword(this.passwordEncoder.encode(credentials.getPassword()));
        user = this.userRepository.save(user);
        return this.convertToDto(user);
    }

    public User get(String email) {
        return this.userRepository.findByEmail(email).orElseThrow();
    }

    public User get(Long id) {
        return this.userRepository.findById(id).orElseThrow();
    }

    public UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        BeanUtils.copyProperties(user, dto);
        return dto;
    }

}