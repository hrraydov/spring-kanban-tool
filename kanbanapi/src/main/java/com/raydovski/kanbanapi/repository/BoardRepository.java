package com.raydovski.kanbanapi.repository;

import java.util.List;

import com.raydovski.kanbanapi.entity.Board;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query(value = "select distinct b from Board b join fetch b.members as m join fetch b.owners as o where o.id=:id or m.id=:id")
    List<Board> findMemberOrOwnerOf(@Param(value = "id") Long id);

}