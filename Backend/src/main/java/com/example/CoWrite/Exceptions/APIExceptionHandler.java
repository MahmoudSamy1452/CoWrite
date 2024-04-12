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

    @ExceptionHandler(value = {BadRequestException.class})
    public ResponseEntity<Object> handleBadRequestException(BadRequestException e) {
        HttpStatus badRequest = HttpStatus.BAD_REQUEST;
        int statusCode = HttpStatus.BAD_REQUEST.value();
        APIException apiException = new APIException(e.getMessage(), badRequest, statusCode);

        return new ResponseEntity<>(apiException, badRequest);
    }

    @ExceptionHandler(value = {UnauthorizedException.class})
    public ResponseEntity<Object> handleUnauthorizedException(UnauthorizedException e) {
        HttpStatus unauthorized = HttpStatus.UNAUTHORIZED;
        int statusCode = HttpStatus.UNAUTHORIZED.value();
        APIException apiException = new APIException(e.getMessage(), unauthorized, statusCode);

        return new ResponseEntity<>(apiException, unauthorized);
    }

    @ExceptionHandler(value = {CouldNotDeleteException.class})
    public ResponseEntity<Object> handleCouldNotDeleteException(CouldNotDeleteException e) {
        HttpStatus internalServerError = HttpStatus.INTERNAL_SERVER_ERROR;
        int statusCode = HttpStatus.INTERNAL_SERVER_ERROR.value();
        APIException apiException = new APIException(e.getMessage(), internalServerError, statusCode);

        return new ResponseEntity<>(apiException, internalServerError);
    }
}
