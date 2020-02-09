package com.raydovski.kanbanapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttachmentDto {

    private String id;

    private String contentType;

    private String name;

    @JsonIgnore
    private byte[] data;

}