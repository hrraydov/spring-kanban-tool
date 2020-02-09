package com.raydovski.kanbanapi.service;

import javax.transaction.Transactional;

import com.raydovski.kanbanapi.entity.Task;
import com.raydovski.kanbanapi.entity.TaskHistory;
import com.raydovski.kanbanapi.repository.TaskHistoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class TaskHistoryService {

    @Autowired
    private TaskHistoryRepository taskHistoryRepository;

    public void add(Task task, TaskHistory taskHistory) {}

}