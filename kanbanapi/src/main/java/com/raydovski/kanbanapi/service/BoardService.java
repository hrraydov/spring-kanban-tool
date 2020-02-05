package com.raydovski.kanbanapi.service;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import com.raydovski.kanbanapi.dto.BoardDto;
import com.raydovski.kanbanapi.dto.PhaseDto;
import com.raydovski.kanbanapi.dto.UserDto;
import com.raydovski.kanbanapi.entity.Board;
import com.raydovski.kanbanapi.entity.BoardPhase;
import com.raydovski.kanbanapi.entity.User;
import com.raydovski.kanbanapi.repository.BoardRepository;
import com.raydovski.kanbanapi.repository.PhaseRepository;
import com.raydovski.kanbanapi.repository.UserRepository;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class BoardService {

    @Autowired
    private UserService userService;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PhaseRepository phaseRepository;

    public boolean isOwner(String email, Long boardId) {
        User user = this.userService.get(email);
        Board board = this.getEntity(boardId);
        return board.getOwners().contains(user);
    }

    public boolean isMember(String email, Long boardId) {
        User user = this.userService.get(email);
        Board board = this.getEntity(boardId);
        return board.getMembers().contains(user);
    }

    public BoardDto create(BoardDto dto) {
        Board board = new Board();
        board = this.convertToEntity(board, dto);
        board = this.boardRepository.save(board);
        return this.convertToDto(board);
    }

    public BoardDto edit(Long id, BoardDto dto) {
        Board board = this.getEntity(id);
        board = this.convertToEntity(board, dto);
        board = this.boardRepository.save(board);
        return this.convertToDto(board);
    }

    public void delete(Long id) {
        this.boardRepository.deleteById(id);
    }

    public BoardDto get(Long id) {
        return this.convertToDto(this.getEntity(id));
    }

    public List<BoardDto> getOwnerOfOrMemberOf(Long id) {
        return this.boardRepository.findMemberOrOwnerOf(id).stream().map(b -> this.convertToDto(b))
                .collect(Collectors.toList());
    }

    public List<BoardDto> get() {
        return this.boardRepository.findAll().stream().map(b -> this.convertToDto(b)).collect(Collectors.toList());
    }

    public Board getEntity(Long id) {
        return this.boardRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    public Board convertToEntity(Board board, BoardDto dto) {
        BeanUtils.copyProperties(dto, board, "members", "owners", "phases");
        board.getMembers().clear();
        for (UserDto memberDto : dto.getMembers()) {
            board.getMembers().add(this.userRepository.findById(memberDto.getId()).orElse(null));
        }
        board.getOwners().clear();
        for (UserDto ownerDto : dto.getOwners()) {
            board.getOwners().add(this.userRepository.findById(ownerDto.getId()).orElse(null));
        }
        List<BoardPhase> newPhases = new ArrayList<>(dto.getPhases().size());
        board.getPhases().clear();
        for (int index = 0; index < dto.getPhases().size(); index++) {
            PhaseDto phaseDto = dto.getPhases().get(index);
            BoardPhase phase;
            if (phaseDto.getId() != null) {
                phase = this.phaseRepository.findById(phaseDto.getId()).orElse(new BoardPhase());
            } else {
                phase = new BoardPhase();
            }
            newPhases.add(phase);
            phase.setName(phaseDto.getName());
            phase.setBoard(board);
            if (index > 0) {
                phase.setPrevPhase(newPhases.get(index - 1));
                newPhases.get(index - 1).setNextPhase(phase);
            }
        }
        board.getPhases().addAll(newPhases);
        return board;
    }

    public BoardDto convertToDto(Board board) {
        BoardDto dto = new BoardDto();
        BeanUtils.copyProperties(board, dto, "members", "owners", "phases");
        dto.setMembers(
                board.getMembers().stream().map(u -> this.userService.convertToDto(u)).collect(Collectors.toSet()));
        dto.setOwners(
                board.getOwners().stream().map(u -> this.userService.convertToDto(u)).collect(Collectors.toSet()));
        dto.setPhases(new LinkedList<>());
        BoardPhase phase = board.getPhases().stream().filter(p -> p.getPrevPhase() == null).findFirst().get();
        while (phase != null) {
            dto.getPhases().add(PhaseDto.builder().id(phase.getId()).name(phase.getName()).build());
            phase = phase.getNextPhase();
        }
        return dto;
    }

}