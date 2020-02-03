package com.raydovski.kanbanapi.security;

import javax.annotation.Resource;
import javax.persistence.EntityNotFoundException;

import com.raydovski.kanbanapi.entity.User;
import com.raydovski.kanbanapi.service.UserService;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseAuthenticationProvider implements AuthenticationProvider {

    @Resource
    private UserService userService;
    @Resource
    private PasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String name = authentication.getName();
        String password = String.valueOf(authentication.getCredentials());
        try {
            User user = userService.get(name);
            if (!passwordEncoder.matches(password, user.getPassword())) {
                throw new BadCredentialsException("Password for user " + name + " does not match");
            }
            return new UsernamePasswordAuthenticationToken(user, null);
        } catch (EntityNotFoundException e) {
            throw new UsernameNotFoundException("Username " + name + " not found");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }

}
