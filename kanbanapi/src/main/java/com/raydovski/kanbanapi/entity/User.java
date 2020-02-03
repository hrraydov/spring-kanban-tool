package com.raydovski.kanbanapi.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

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
public class User {

    @Id
    @GeneratedValue
    private Long id;

    private String email;

    private String password;

    private String firstName;

    private String lastName;

    @Builder.Default
    @ManyToMany(mappedBy = "members")
    private Set<Board> memberOf = new HashSet<>();

    @Builder.Default
    @ManyToMany(mappedBy = "owners")
    private Set<Board> ownerOf = new HashSet<>();

}