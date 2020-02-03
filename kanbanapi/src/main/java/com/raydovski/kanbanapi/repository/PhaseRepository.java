package com.raydovski.kanbanapi.repository;

import com.raydovski.kanbanapi.entity.BoardPhase;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhaseRepository extends JpaRepository<BoardPhase, Long> {

}