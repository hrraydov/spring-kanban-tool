package com.raydovski.kanbanapi.security;

import java.time.Instant;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import com.raydovski.kanbanapi.config.JwtConfig;
import com.raydovski.kanbanapi.entity.User;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtTokenProvider {

    private static final String AUTHORITIES_KEY = "auth";

    @Resource
    private JwtConfig jwtConfig;
    private String secretKey;

    @PostConstruct
    public void init() {
        this.secretKey = jwtConfig.getTokenSecretKey();
    }

    public String createToken(Authentication authentication, TokenType tokenType) {

        Date validity;
        switch (tokenType) {
        case ACCESS:
            validity = Date.from(Instant.now().plusSeconds(jwtConfig.getTokenValidityInSeconds()));
            break;
        case REMEMBERME:
            validity = Date.from(Instant.now().plusSeconds(jwtConfig.getTokenValidityInSecondsForRememberMe()));
            break;
        default:
            throw new IllegalArgumentException("Unknown token type " + tokenType);
        }

        return Jwts.builder().setSubject(((User) authentication.getPrincipal()).getEmail())
                .signWith(SignatureAlgorithm.HS512, secretKey).setExpiration(validity).compact();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();

        String principal = claims.getSubject();

        Collection<? extends GrantedAuthority> authorities = Arrays.stream(new String[] { "ROLE_USER" })
                .map(SimpleGrantedAuthority::new).collect(Collectors.toList());

        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }

    public void validateToken(String authToken) {
        Jwts.parser().setSigningKey(secretKey).parseClaimsJws(authToken);
    }
}
