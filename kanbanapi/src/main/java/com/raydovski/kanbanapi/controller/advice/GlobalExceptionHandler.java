package com.raydovski.kanbanapi.controller.advice;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import com.raydovski.kanbanapi.dto.MessageDto;
import com.raydovski.kanbanapi.dto.ResponseCode;
import com.raydovski.kanbanapi.dto.MessageDto.Violation;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<MessageDto> illegalArgsException(IllegalArgumentException e) {
        return new ResponseEntity<MessageDto>(MessageDto.builder().code(ResponseCode.IllegalArguments)
                .msg(e.getMessage()).details(ExceptionUtils.getStackTrace(e)).build(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<MessageDto> illegalStgateException(IllegalStateException e) {
        return new ResponseEntity<MessageDto>(MessageDto.builder().code(ResponseCode.IllegalState).msg(e.getMessage())
                .details(ExceptionUtils.getStackTrace(e)).build(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<MessageDto> entityNotFound(EntityNotFoundException e) {
        return new ResponseEntity<MessageDto>(MessageDto.builder().code(ResponseCode.EntityNotFound).msg(e.getMessage())
                .details(ExceptionUtils.getStackTrace(e)).build(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<MessageDto> entityNotFound(NoSuchElementException e) {
        return new ResponseEntity<MessageDto>(MessageDto.builder().code(ResponseCode.EntityNotFound).msg(e.getMessage())
                .details(ExceptionUtils.getStackTrace(e)).build(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<MessageDto> runtimeException(RuntimeException e) {
        return new ResponseEntity<MessageDto>(MessageDto.builder().code(ResponseCode.Unspecified).msg(e.getMessage())
                .details(ExceptionUtils.getStackTrace(e)).build(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<MessageDto> authenticationException(AuthenticationException e) {
        return new ResponseEntity<MessageDto>(
                MessageDto.builder().code(ResponseCode.Unauthenticated).msg("").details("").build(),
                HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<MessageDto> accessDeniedException(AccessDeniedException e) {
        return new ResponseEntity<MessageDto>(MessageDto.builder().code(ResponseCode.Unauthorized).msg(e.getMessage())
                .details(ExceptionUtils.getStackTrace(e)).build(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public MessageDto requiredArgs(MethodArgumentNotValidException e) {
        List<Violation> violations = e.getBindingResult().getFieldErrors().stream()
                .map(v -> Violation.builder().fieldName(v.getField()).message(v.getDefaultMessage()).build())
                .collect(Collectors.toList());
        return MessageDto.builder().code(ResponseCode.InputValidation).violations(violations).build();
    }

}
