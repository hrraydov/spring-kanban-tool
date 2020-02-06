package com.raydovski.kanbanapi.controller;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.validation.Valid;

import com.raydovski.kanbanapi.dto.TaskDto;
import com.raydovski.kanbanapi.dto.TaskSearchDto;
import com.raydovski.kanbanapi.entity.Attachment;
import com.raydovski.kanbanapi.service.BoardService;
import com.raydovski.kanbanapi.service.TaskService;
import com.raydovski.kanbanapi.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.Authorization;
import springfox.documentation.annotations.ApiIgnore;;

@RestController
@RequestMapping("/boards/{boardId}/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private BoardService boardService;

    @Autowired
    private UserService userService;

    @GetMapping
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Get tasks for board")
    @PreAuthorize(value = "@boardService.isOwner(#authentication.getName(), #boardId) or @boardService.isMember(#authentication.getName(), #boardId)")
    public List<TaskDto> get(@PathVariable Long boardId, TaskSearchDto searchDto,
            @ApiIgnore Authentication authentication) {
        searchDto.setBoardId(boardId);
        return this.taskService.get(searchDto);
    }

    @GetMapping("/{id}")
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Get task for board")
    @PreAuthorize(value = "@boardService.isOwner(#authentication.getName(), #boardId) or @boardService.isMember(#authentication.getName(), #boardId)")
    public TaskDto get(@PathVariable Long boardId, @PathVariable Long id, @ApiIgnore Authentication authentication) {
        return this.taskService.get(boardId, id);
    }

    @PostMapping
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Create task for board")
    @PreAuthorize(value = "@boardService.isOwner(#authentication.getName(), #boardId) or @boardService.isMember(#authentication.getName(), #boardId)")
    public ResponseEntity<TaskDto> create(@PathVariable Long boardId, @RequestBody @Valid TaskDto dto,
            @ApiIgnore Authentication authentication) {
        return ResponseEntity.ok(this.taskService.create(boardId, dto));
    }

    @PutMapping("/{id}")
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Edit task for board")
    @PreAuthorize(value = "@boardService.isOwner(#authentication.getName(), #boardId) or @boardService.isMember(#authentication.getName(), #boardId)")
    public ResponseEntity<TaskDto> edit(@PathVariable Long boardId, @PathVariable Long id,
            @RequestBody @Valid TaskDto boardDto, @ApiIgnore Authentication authentication) {
        return ResponseEntity.ok(this.taskService.edit(id, boardId, boardDto));
    }

    @PostMapping(path = "/{id}/attachments", consumes = { "multipart/form-data" })
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Add attachments to tasks")
    @PreAuthorize(value = "@boardService.isOwner(#authentication.getName(), #boardId) or @boardService.isMember(#authentication.getName(), #boardId)")
    public ResponseEntity<?> addAttachment(@PathVariable Long boardId, @PathVariable Long id,
            @ApiIgnore Authentication authentication, @RequestParam MultipartFile file) {
        System.out.println(file);
        this.taskService.addAttachments(boardId, id, new HashSet<>(Arrays.asList(file)));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/{id}/attachments/{attachmentId}")
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Add attachments to tasks")
    @PreAuthorize(value = "@boardService.isOwner(#authentication.getName(), #boardId) or @boardService.isMember(#authentication.getName(), #boardId)")
    public ResponseEntity<byte[]> addAttachment(@PathVariable Long boardId, @PathVariable Long id,
            @ApiIgnore Authentication authentication, @PathVariable String attachmentId) {
        Attachment a = this.taskService.getAttachment(boardId, id, attachmentId);
        HttpHeaders headers = new HttpHeaders();
        StringBuilder builder = new StringBuilder();
        builder.append("attachment; ").append("filename=").append(a.getName());
        headers.add("Content-Type", MediaType.APPLICATION_OCTET_STREAM_VALUE);
        headers.add("Content-Disposition", builder.toString());
        return new ResponseEntity<byte[]>(a.getData(), headers, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Get task for board")
    @PreAuthorize(value = "@boardService.isOwner(#authentication.getName(), #boardId) or @boardService.isMember(#authentication.getName(), #boardId)")
    public ResponseEntity<?> delete(@PathVariable Long boardId, @PathVariable Long id,
            @ApiIgnore Authentication authentication) {
        this.taskService.delete(boardId, id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}