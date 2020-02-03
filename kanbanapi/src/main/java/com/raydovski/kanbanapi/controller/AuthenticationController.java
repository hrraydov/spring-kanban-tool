package com.raydovski.kanbanapi.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import com.raydovski.kanbanapi.dto.Credentials;
import com.raydovski.kanbanapi.dto.UserDto;
import com.raydovski.kanbanapi.entity.User;
import com.raydovski.kanbanapi.security.DatabaseAuthenticationProvider;
import com.raydovski.kanbanapi.security.JwtTokenProvider;
import com.raydovski.kanbanapi.security.TokenType;
import com.raydovski.kanbanapi.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import springfox.documentation.annotations.ApiIgnore;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Resource
    private DatabaseAuthenticationProvider authenticationProvider;
    @Resource
    private JwtTokenProvider tokenProvider;
    @Resource
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> auth(@RequestBody @Valid Credentials credentials) {
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(credentials.getEmail(),
                credentials.getPassword());
        Authentication authenticated = authenticationProvider.authenticate(auth);
        TokenType tokenType = TokenType.ACCESS;
        String token = tokenProvider.createToken(authenticated, tokenType);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody @Valid Credentials credentials) {
        return ResponseEntity.ok(this.userService.create(credentials));
    }

    @GetMapping(value = "/info")
    public ResponseEntity<UserDto> getUserInfo(@ApiIgnore Authentication authentication) {
        User loggedInUser = this.userService.getUserFromAuthentication(authentication);
        return ResponseEntity.ok(this.userService.convertToDto(loggedInUser));
    }

}
