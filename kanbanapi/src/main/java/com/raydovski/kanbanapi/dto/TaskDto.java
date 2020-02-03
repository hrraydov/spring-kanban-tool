package com.raydovski.kanbanapi.dto;

import java.util.HashSet;
import java.util.Set;

import com.raydovski.kanbanapi.entity.Attachment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDto {
    private Long id;

    private String name;

    private String description;

    private Set<Attachment> attachments = new HashSet<>();

    private UserDto assignedTo;

    private PhaseDto phase;
}