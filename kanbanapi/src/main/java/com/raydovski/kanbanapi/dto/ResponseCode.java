package com.raydovski.kanbanapi.dto;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

public enum ResponseCode {

    Ok(0), Unspecified(-1), IllegalArguments(-2), Unauthenticated(-3), Unauthorized(-4), RequiredArgs(-5),
    IllegalState(-6), EntityNotFound(-7), InputValidation(-8);

    private final int value;

    private static final Map<Integer, ResponseCode> LOOKUP = Arrays.stream(ResponseCode.values())
            .collect(Collectors.toMap(ResponseCode::getValue, v -> v));

    public int getValue() {
        return value;
    }

    private ResponseCode(int value) {
        this.value = value;
    }

    public static ResponseCode fromValue(int code) {
        return LOOKUP.get(code);
    }
}
