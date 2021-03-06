package com.raydovski.kanbanapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskSearchDto {

    private Long boardId;

    private Long phaseId;

    private Long userId;

}