package com.raydovski.kanbanapi.repository;

import java.util.List;

import com.raydovski.kanbanapi.entity.Task;
import com.raydovski.kanbanapi.entity.TaskHistory;
import com.raydovski.kanbanapi.entity.TaskHistoryType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskHistoryRepository extends JpaRepository<TaskHistory, Long>, JpaSpecificationExecutor<TaskHistory> {

    List<TaskHistory> findByTaskAndTypeOrderByDateDesc(Task task, TaskHistoryType type);

}