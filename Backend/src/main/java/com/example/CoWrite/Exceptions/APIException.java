package com.example.CoWrite.Exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class APIException {

    private final String message;

    private final HttpStatus httpStatus;

    private final int statusCode;

    public APIException(String message, HttpStatus httpStatus, int statusCode) {
        this.message = message;
        this.httpStatus = httpStatus;
        this.statusCode = statusCode;
    }
}
