package com.raydovski.kanbanapi.repository;

import java.util.Optional;

import com.raydovski.kanbanapi.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

}