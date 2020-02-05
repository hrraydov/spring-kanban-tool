package com.raydovski.kanbanapi.entity;

import javax.persistence.Embeddable;
import javax.persistence.Lob;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attachment {

    private String id;

    @Lob
    private byte[] data;

    private String name;

    private String contentType;

}