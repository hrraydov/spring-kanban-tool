package com.raydovski.kanbanapi.controller;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.raydovski.kanbanapi.dto.AttachmentDto;
import com.raydovski.kanbanapi.dto.TaskDto;
import com.raydovski.kanbanapi.dto.TaskHistoryDto;
import com.raydovski.kanbanapi.dto.TaskSearchDto;
import com.raydovski.kanbanapi.dto.UserDto;
import com.raydovski.kanbanapi.entity.Attachment;
import com.raydovski.kanbanapi.entity.TaskHistoryType;
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
        this.taskService.addAttachments(boardId, id, Arrays.asList(file).stream().map(f -> {
            try {
                return AttachmentDto.builder().contentType(f.getContentType()).data(f.getBytes())
                        .name(f.getOriginalFilename()).build();
            } catch (IOException e) {
                e.printStackTrace();
                return null;
            }
        }).collect(Collectors.toSet()));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/{id}/attachments/{attachmentId}")
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Add attachments to tasks")
    @PreAuthorize(value = "@boardService.isOwner(#authentication.getName(), #boardId) or @boardService.isMember(#authentication.getName(), #boardId)")
    public ResponseEntity<byte[]> getAttachment(@PathVariable Long boardId, @PathVariable Long id,
            @ApiIgnore Authentication authentication, @PathVariable String attachmentId) {
        AttachmentDto a = this.taskService.getAttachment(boardId, id, attachmentId);
        HttpHeaders headers = new HttpHeaders();
        StringBuilder builder = new StringBuilder();
        builder.append("attachment; ").append("filename=").append(a.getName());
        headers.add("Content-Type", a.getContentType());
        headers.add("Content-Disposition", builder.toString());
        return new ResponseEntity<byte[]>(a.getData(), headers, HttpStatus.OK);
    }

    @DeleteMapping(path = "/{id}/attachments/{attachmentId}")
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Delete attachment")
    @PreAuthorize(value = "@boardService.isOwner(#authentication.getName(), #boardId) or @boardService.isMember(#authentication.getName(), #boardId)")
    public void deleteAttachment(@PathVariable Long boardId, @PathVariable Long id,
            @ApiIgnore Authentication authentication, @PathVariable String attachmentId) {
        this.taskService.deleteAttachment(boardId, id, attachmentId);
    }

    @DeleteMapping("/{id}")
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Delete task")
    @PreAuthorize(value = "@boardService.isOwner(#authentication.getName(), #boardId) or @boardService.isMember(#authentication.getName(), #boardId)")
    public ResponseEntity<?> delete(@PathVariable Long boardId, @PathVariable Long id,
            @ApiIgnore Authentication authentication) {
        this.taskService.delete(boardId, id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}/history")
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Get history for task")
    @PreAuthorize(value = "@boardService.isOwner(#authentication.getName(), #boardId) or @boardService.isMember(#authentication.getName(), #boardId)")
    public List<TaskHistoryDto> getHistory(@PathVariable Long boardId, @PathVariable Long id,
            @ApiIgnore Authentication authentication, @RequestParam(required = true) TaskHistoryType type) {
        return this.taskService.getHistory(boardId, id, type);
    }

    @GetMapping("/{id}/history/stats")
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Get history for task")
    @PreAuthorize(value = "@boardService.isOwner(#authentication.getName(), #boardId) or @boardService.isMember(#authentication.getName(), #boardId)")
    public Object getHistoryStats(@PathVariable Long boardId, @PathVariable Long id,
            @ApiIgnore Authentication authentication, @RequestParam(required = true) TaskHistoryType type)
            throws JsonProcessingException {
        List<TaskHistoryDto> history = this.taskService.getHistory(boardId, id, type);
        switch (type) {
        case TIME_LOGGED: {
            return history.stream().mapToLong(x -> Long.valueOf(x.getData().toString())).sum();
        }
        case ASSIGNED_TO_CHANGED: {
            Map<String, Long> result = new HashMap<>();
            ObjectMapper mapper = new ObjectMapper();
            for (TaskHistoryDto h : history) {
                result.putIfAbsent(mapper.writeValueAsString(h.getData()), 0L);
                result.compute(mapper.writeValueAsString(h.getData()), (k, v) -> v + 1);
            }
            return result;
        }
        case PHASE_CHANGED: {
            Map<String, Long> result = new HashMap<>();
            ObjectMapper mapper = new ObjectMapper();
            for (TaskHistoryDto h : history) {
                result.putIfAbsent(mapper.writeValueAsString(h.getData()), 0L);
                result.compute(mapper.writeValueAsString(h.getData()), (k, v) -> v + 1);
            }
            return result;
        }
        }
        return null;
    }

    @PostMapping("/{id}/logTime")
    @ApiOperation(authorizations = @Authorization(value = "Bearer"), value = "Get history for task")
    @PreAuthorize(value = "@boardService.isOwner(#authentication.getName(), #boardId) or @boardService.isMember(#authentication.getName(), #boardId)")
    public void logTime(@PathVariable Long boardId, @PathVariable Long id, @ApiIgnore Authentication authentication,
            @RequestBody Long logTime) {
        this.taskService.logTime(boardId, id, logTime);
    }
}