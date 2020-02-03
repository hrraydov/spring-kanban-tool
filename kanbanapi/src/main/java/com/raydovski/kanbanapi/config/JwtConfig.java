package com.raydovski.kanbanapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;

@Configuration
@Getter
public class JwtConfig {

	@Value("${jwt.secret:secret}")
	private String tokenSecretKey;

	@Value("${jwt.token.validity.access:3600}")
	private int tokenValidityInSeconds; // 1 hour

	@Value("${jwt.token.validity.rememberme:43200}")
	private int tokenValidityInSecondsForRememberMe; // 12 hours

}