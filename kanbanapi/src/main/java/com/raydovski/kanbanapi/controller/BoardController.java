package com.raydovski.kanbanapi.controller;

import java.util.List;

import javax.validation.Valid;

import com.raydovski.kanbanapi.dto.BoardDto;
import com.raydovski.kanbanapi.entity.User;
import com.raydovski.kanbanapi.service.BoardService;
import com.raydovski.kanbanapi.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.Authorization;
import springfox.documentation.annotations.ApiIgnore;

@RestController
@RequestMapping(path = "/boards")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @Autowired
    private UserService userService;

    @GetMapping
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Get boards")
    public List<BoardDto> get(@ApiIgnore Authentication authentication) {
        User loggedInUser = this.userService.get(authentication.getName());
        return this.boardService.getOwnerOfOrMemberOf(loggedInUser.getId());
    }

    @GetMapping("/{id}")
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Get board")
    @PreAuthorize(value = "@boardService.isOwner(#authentication.getName(), #id) or @boardService.isMember(#authentication.getName(), #id)")
    public BoardDto get(@PathVariable Long id, @ApiIgnore Authentication authentication) {
        return this.boardService.get(id);
    }

    @PostMapping
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Create board")
    public ResponseEntity<BoardDto> get(@RequestBody @Valid BoardDto boardDto,
                                        @ApiIgnore Authentication authentication) {
        User loggedInUser = this.userService.getUserFromAuthentication(authentication);
        boardDto.getOwners().add(this.userService.convertToDto(loggedInUser));
        return ResponseEntity.ok(this.boardService.create(boardDto));
    }

    @PutMapping("/{id}")
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Edit board")
    @PreAuthorize(value = "@boardService.isOwner(#authentication.getName(), #id) or @boardService.isMember(#authentication.getName(), #id)")
    public ResponseEntity<BoardDto> edit(@PathVariable Long id, @RequestBody @Valid BoardDto boardDto,
                                         @ApiIgnore Authentication authentication) {
        User loggedInUser = this.userService.get(authentication.getName());
        boardDto.getOwners().add(this.userService.convertToDto(loggedInUser));
        return ResponseEntity.ok(this.boardService.edit(id, boardDto));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Delete board")
    @PreAuthorize(value = "@boardService.isOwner(#authentication.getName(), #id) or @boardService.isMember(#authentication.getName(), #id)")
    public ResponseEntity<?> delete(@PathVariable Long id,
                                    @ApiIgnore Authentication authentication) {
        this.boardService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}