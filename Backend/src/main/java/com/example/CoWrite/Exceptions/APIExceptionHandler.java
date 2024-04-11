package com.example.CoWrite.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class APIExceptionHandler {

    @ExceptionHandler(value = {ResourceNotFoundException.class})
    public ResponseEntity<Object> handleAPIRequestException(ResourceNotFoundException e) {
        HttpStatus notFound = HttpStatus.NOT_FOUND;
        int statusCode = HttpStatus.NOT_FOUND.value();
        APIException apiException = new APIException(e.getMessage(), notFound, statusCode);

        return new ResponseEntity<>(apiException, notFound);
    }

    @ExceptionHandler(value = {BadRequest.class})
    public ResponseEntity<Object> handleBadRequestException(BadRequest e) {
        HttpStatus badRequest = HttpStatus.BAD_REQUEST;
        int statusCode = HttpStatus.BAD_REQUEST.value();
        APIException apiException = new APIException(e.getMessage(), badRequest, statusCode);

        return new ResponseEntity<>(apiException, badRequest);
    }
}
