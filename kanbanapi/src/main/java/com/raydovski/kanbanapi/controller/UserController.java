package com.raydovski.kanbanapi.controller;

import java.util.List;

import com.raydovski.kanbanapi.dto.UserDto;
import com.raydovski.kanbanapi.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.Authorization;;

@RestController
@RequestMapping(path = "/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Search users by email")
    public List<UserDto> searchByEmail(@RequestParam(required = true) String email) {
        return this.userService.searchByEmail(email);
    }
}