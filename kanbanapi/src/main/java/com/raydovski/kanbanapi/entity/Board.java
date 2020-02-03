package com.raydovski.kanbanapi.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(of = {"id", "name", "owners", "members", "phases"})
public class Board {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @Builder.Default
    @ManyToMany
    private Set<User> owners = new HashSet<>();

    @Builder.Default
    @ManyToMany
    private Set<User> members = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL)
    private Set<BoardPhase> phases = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "board")
    private Set<Task> tasks = new HashSet<>();

}