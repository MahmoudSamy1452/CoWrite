package com.example.CoWrite.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@ControllerAdvice
public class APIExceptionHandler {

    @ExceptionHandler(value = {ResourceNotFoundException.class})
    public ResponseEntity<Object> handleAPIRequestException(ResourceNotFoundException e) {
        HttpStatus notFound = HttpStatus.NOT_FOUND;
        int statusCode = HttpStatus.NOT_FOUND.value();
        APIException apiException = new APIException(e.getMessage(), notFound, statusCode);

        return new ResponseEntity<>(apiException, notFound);
    }
}
