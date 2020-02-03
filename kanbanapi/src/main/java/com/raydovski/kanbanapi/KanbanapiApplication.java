package com.raydovski.kanbanapi;

import java.util.HashSet;
import java.util.LinkedList;

import com.raydovski.kanbanapi.dto.BoardDto;
import com.raydovski.kanbanapi.dto.Credentials;
import com.raydovski.kanbanapi.dto.PhaseDto;
import com.raydovski.kanbanapi.dto.TaskDto;
import com.raydovski.kanbanapi.dto.TaskSearchDto;
import com.raydovski.kanbanapi.dto.UserDto;
import com.raydovski.kanbanapi.service.BoardService;
import com.raydovski.kanbanapi.service.TaskService;
import com.raydovski.kanbanapi.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class KanbanapiApplication implements ApplicationRunner {

	@Autowired
	private UserService userService;

	@Autowired
	private BoardService boardService;

	@Autowired
	private TaskService taskService;

	public static void main(String[] args) {
		SpringApplication.run(KanbanapiApplication.class, args);
	}

	@Override
	public void run(ApplicationArguments args) throws Exception {
		UserDto user1 = userService.create(Credentials.builder().email("user1@mail.bg").password("testtest").build());
		UserDto user2 = userService.create(Credentials.builder().email("user2@mail.bg").password("testtest").build());
		UserDto user3 = userService.create(Credentials.builder().email("user3@mail.bg").password("testtest").build());
		UserDto user4 = userService.create(Credentials.builder().email("user4@mail.bg").password("testtest").build());
		System.out.println("Created user -> " + user1);
		System.out.println("Created user -> " + user2);
		System.out.println("Created user -> " + user3);
		System.out.println("Created user -> " + user4);
		BoardDto boardDto = boardService.create(BoardDto.builder().name("board 1").members(new HashSet<UserDto>() {
			{
				{
					add(UserDto.builder().id(user3.getId()).build());
				}
				{
					add(UserDto.builder().id(user4.getId()).build());
				}
			}
		}).owners(new HashSet<UserDto>() {
			{
				add(UserDto.builder().id(user1.getId()).build());
			}
			{
				add(UserDto.builder().id(user2.getId()).build());
			}
		}).phases(new LinkedList<PhaseDto>() {
			{
				add(PhaseDto.builder().name("To Do").build());
				add(PhaseDto.builder().name("In progress").build());
				add(PhaseDto.builder().name("Done").build());
			}
		}).build());
		System.out.println("Created board -> " + boardDto);
		this.taskService.create(boardDto.getId(),
				TaskDto.builder().name("task 1").assignedTo(user2).phase(boardDto.getPhases().get(0)).build());
		System.out.println("Get all boards -> " + this.boardService.get());
		boardDto.getPhases().get(0).setName("TODO");
		boardDto.getPhases().add(2, PhaseDto.builder().name("Testing").build());
		boardDto = boardService.edit(boardDto.getId(), boardDto);
		System.out.println("Edited board -> " + boardDto);
		System.out.println("Find memberOf or ownerOf -> " + boardService.getOwnerOfOrMemberOf(user1.getId()));
		System.out.println("Find memberOf or ownerOf -> " + boardService.getOwnerOfOrMemberOf(5L));
		System.out
				.println("Find tasks -> " + taskService.get(TaskSearchDto.builder().boardId(boardDto.getId()).build()));
	}
}
