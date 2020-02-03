package com.raydovski.kanbanapi.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    private String description;

    @Builder.Default
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<Attachment> attachments = new HashSet<>();

    @ManyToOne
    private Board board;

    @ManyToOne
    private User assignedTo;

    @ManyToOne
    private BoardPhase phase;

}