package com.raydovski.kanbanapi.service;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

import com.raydovski.kanbanapi.dto.PhaseDto;
import com.raydovski.kanbanapi.dto.TaskDto;
import com.raydovski.kanbanapi.dto.TaskSearchDto;
import com.raydovski.kanbanapi.entity.Task;
import com.raydovski.kanbanapi.repository.PhaseRepository;
import com.raydovski.kanbanapi.repository.TaskRepository;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class TaskService {

    @Autowired
    private PhaseRepository phaseRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private BoardService boardService;

    @Autowired
    private UserService userService;

    public TaskDto create(Long boardId, TaskDto dto) {
        Task task = new Task();
        task = this.convertToEntity(task, dto);
        task.setBoard(this.boardService.getEntity(boardId));
        task = this.taskRepository.save(task);
        System.out.println(task);
        return this.convertToDto(task);
    }

    public TaskDto edit(Long id, Long boardId, TaskDto dto) {
        Task task = this.getEntity(id);
        if (!task.getBoard().getId().equals(boardId)) {
            throw new EntityNotFoundException();
        }
        task = this.convertToEntity(task, dto);
        task = this.taskRepository.save(task);
        return this.convertToDto(task);
    }

    public List<TaskDto> get(TaskSearchDto searchDto) {
        Specification<Task> specification = this.buildSpecification(searchDto);
        return this.taskRepository.findAll(specification).stream().map(t -> this.convertToDto(t))
                .collect(Collectors.toList());
    }

    public Task getEntity(Long id) {
        return this.taskRepository.findById(id).orElseThrow();
    }

    public Task convertToEntity(Task task, TaskDto dto) {
        BeanUtils.copyProperties(dto, task, "assignedTo", "phase");
        task.setAssignedTo(this.userService.get(dto.getAssignedTo().getId()));
        task.setPhase(this.phaseRepository.findById(dto.getPhase().getId()).orElseThrow());
        return task;
    }

    public TaskDto convertToDto(Task task) {
        TaskDto taskDto = new TaskDto();
        BeanUtils.copyProperties(task, taskDto, "assignedTo", "phase");
        taskDto.setPhase(PhaseDto.builder().id(task.getPhase().getId()).name(task.getPhase().getName()).build());
        taskDto.setAssignedTo(this.userService.convertToDto(task.getAssignedTo()));
        return taskDto;
    }

    private Specification<Task> buildSpecification(TaskSearchDto dto) {
        return new Specification<Task>() {

            @Override
            public Predicate toPredicate(Root<Task> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new LinkedList<>();

                if (dto.getBoardId() != null) {
                    predicates.add(cb.equal(root.join("board").get("id"), dto.getBoardId()));
                }

                if (dto.getPhaseId() != null) {
                    predicates.add(cb.equal(root.join("phase").get("id"), dto.getPhaseId()));
                }

                if (dto.getUserId() != null) {
                    predicates.add(cb.equal(root.join("assignedTo").get("id"), dto.getUserId()));
                }

                return cb.and(predicates.toArray(new Predicate[0]));
            }
        };
    }

}