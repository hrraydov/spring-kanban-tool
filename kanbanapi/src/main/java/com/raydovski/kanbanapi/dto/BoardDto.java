package com.raydovski.kanbanapi.dto;
import java.util.List;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardDto {

    private Long id;

    private String name;
    
    private Set<UserDto> members;
    
    private Set<UserDto> owners;

    private List<PhaseDto> phases;

}