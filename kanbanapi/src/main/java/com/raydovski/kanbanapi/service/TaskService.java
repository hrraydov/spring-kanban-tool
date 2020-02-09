package com.raydovski.kanbanapi.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.Instant;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

import com.raydovski.kanbanapi.dto.AttachmentDto;
import com.raydovski.kanbanapi.dto.PhaseDto;
import com.raydovski.kanbanapi.dto.TaskDto;
import com.raydovski.kanbanapi.dto.TaskHistoryDto;
import com.raydovski.kanbanapi.dto.TaskSearchDto;
import com.raydovski.kanbanapi.dto.UserDto;
import com.raydovski.kanbanapi.entity.Attachment;
import com.raydovski.kanbanapi.entity.BoardPhase;
import com.raydovski.kanbanapi.entity.Task;
import com.raydovski.kanbanapi.entity.TaskHistory;
import com.raydovski.kanbanapi.entity.TaskHistoryType;
import com.raydovski.kanbanapi.repository.AttachmentRepository;
import com.raydovski.kanbanapi.repository.PhaseRepository;
import com.raydovski.kanbanapi.repository.TaskHistoryRepository;
import com.raydovski.kanbanapi.repository.TaskRepository;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class TaskService {

    @Autowired
    private PhaseRepository phaseRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private BoardService boardService;

    @Autowired
    private UserService userService;

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private TaskHistoryRepository taskHistoryRepository;

    public TaskDto create(Long boardId, TaskDto dto) {
        Task task = new Task();
        task.setBoard(this.boardService.getEntity(boardId));
        if (dto.getAssignedTo() != null) {
            this.addNewAssignedToHistory(task, dto.getAssignedTo().getId());
        }
        if (dto.getPhase().getId() != null) {
            this.addNewPhaseHistory(task, dto.getPhase().getId());
        }
        task = this.convertToEntity(task, dto);
        task = this.taskRepository.save(task);
        return this.convertToDto(task);
    }

    public TaskDto edit(Long id, Long boardId, TaskDto dto) {
        Task task = this.getEntity(id);
        if (!task.getBoard().getId().equals(boardId)) {
            throw new EntityNotFoundException();
        }
        log.info("Previous assigned to -> " + task.getAssignedTo().getId());
        log.info("Next assigned to -> " + dto.getAssignedTo().getId());
        if (dto.getAssignedTo().getId() != task.getAssignedTo().getId()) {
            this.addNewAssignedToHistory(task, dto.getAssignedTo().getId());
        }
        if (dto.getPhase().getId() != task.getPhase().getId()) {
            this.addNewPhaseHistory(task, dto.getPhase().getId());
        }
        task = this.convertToEntity(task, dto);
        task = this.taskRepository.save(task);
        return this.convertToDto(task);
    }

    public void delete(Long boardId, Long id) {
        Task task = this.getEntity(id);
        if (!task.getBoard().getId().equals(boardId)) {
            throw new EntityNotFoundException();
        }
        this.taskRepository.delete(task);
    }

    public List<TaskDto> get(TaskSearchDto searchDto) {
        Specification<Task> specification = this.buildSpecification(searchDto);
        return this.taskRepository.findAll(specification).stream().map(t -> this.convertToDto(t))
                .collect(Collectors.toList());
    }

    public TaskDto get(Long boardId, Long id) {
        Task task = this.getEntity(id);
        if (!task.getBoard().getId().equals(boardId)) {
            throw new EntityNotFoundException();
        }
        return this.convertToDto(task);
    }

    public void addAttachments(Long boardId, Long taskId, Set<AttachmentDto> files) {
        Task task = this.getEntity(taskId);
        if (!task.getBoard().getId().equals(boardId)) {
            throw new EntityNotFoundException();
        }
        task.getAttachments().addAll(files.stream().map(file -> {
            return Attachment.builder().contentType(file.getContentType()).data(file.getData())
                    .id(UUID.randomUUID().toString()).name(file.getName()).task(task).build();
        }).collect(Collectors.toSet()));
        this.taskRepository.save(task);
    }

    public AttachmentDto getAttachment(Long boardId, Long taskId, String id) {
        Task task = this.getEntity(taskId);
        if (!task.getBoard().getId().equals(boardId)) {
            throw new EntityNotFoundException();
        }
        Attachment att = this.attachmentRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        if (!att.getTask().getId().equals(taskId)) {
            throw new EntityNotFoundException();
        }
        return AttachmentDto.builder().id(att.getId()).name(att.getName()).contentType(att.getContentType())
                .data(att.getData()).build();
    }

    public Task getEntity(Long id) {
        return this.taskRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    public Task convertToEntity(Task task, TaskDto dto) {
        BeanUtils.copyProperties(dto, task, "assignedTo", "phase", "attachments", "history");
        task.setAssignedTo(this.userService.get(dto.getAssignedTo().getId()));
        task.setPhase(this.phaseRepository.findById(dto.getPhase().getId()).orElseThrow(EntityNotFoundException::new));
        return task;
    }

    public TaskDto convertToDto(Task task) {
        TaskDto taskDto = new TaskDto();
        BeanUtils.copyProperties(task, taskDto, "assignedTo", "phase", "attachments", "history");
        taskDto.setPhase(PhaseDto.builder().id(task.getPhase().getId()).name(task.getPhase().getName()).build());
        taskDto.setAssignedTo(this.userService.convertToDto(task.getAssignedTo()));
        taskDto.setAttachments(
                task.getAttachments().stream()
                        .map(att -> AttachmentDto.builder().id(att.getId()).name(att.getName())
                                .contentType(att.getContentType()).data(att.getData()).build())
                        .collect(Collectors.toSet()));
        return taskDto;
    }

    public List<TaskHistoryDto> getHistory(Long boardId, Long taskId, TaskHistoryType type) {
        Task task = this.getEntity(taskId);
        if (!task.getBoard().getId().equals(boardId)) {
            throw new EntityNotFoundException();
        }
        return this.taskHistoryRepository.findByTaskAndTypeOrderByDateDesc(task, type).stream()
                .map(h -> TaskHistoryDto.builder().data(this.historyData(h.getData(), type)).date(h.getDate()).build())
                .collect(Collectors.toList());
    }

    public void logTime(Long boardId, long taskId, Long amount) {
        Task task = this.getEntity(taskId);
        if (!task.getBoard().getId().equals(boardId)) {
            throw new EntityNotFoundException();
        }
        task.getHistory().add(TaskHistory.builder().type(TaskHistoryType.TIME_LOGGED).data(amount).task(task)
                .date(Instant.now()).build());
        this.taskRepository.save(task);
    }

    private Object historyData(Long rawData, TaskHistoryType type) {
        switch (type) {
        case ASSIGNED_TO_CHANGED:
            return this.userService.convertToDto(this.userService.get(rawData));
        case PHASE_CHANGED:
            BoardPhase phase = this.phaseRepository.findById(rawData).orElseThrow(EntityNotFoundException::new);
            return PhaseDto.builder().id(phase.getId()).name(phase.getName()).build();
        case TIME_LOGGED:
            return rawData;
        }
        return null;
    }

    private void addNewPhaseHistory(Task task, Long phaseId) {
        task.getHistory().add(TaskHistory.builder().type(TaskHistoryType.PHASE_CHANGED).data(phaseId).task(task)
                .date(Instant.now()).build());
    }

    private void addNewAssignedToHistory(Task task, Long assignedToId) {
        task.getHistory().add(TaskHistory.builder().type(TaskHistoryType.ASSIGNED_TO_CHANGED).data(assignedToId)
                .task(task).date(Instant.now()).build());
    }

    private Specification<Task> buildSpecification(TaskSearchDto dto) {
        return new Specification<Task>() {

            /**
             *
             */
            private static final long serialVersionUID = 4933170843652959896L;

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