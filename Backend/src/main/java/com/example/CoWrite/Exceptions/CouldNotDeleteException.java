package com.example.CoWrite.Exceptions;

public class CouldNotDeleteException extends RuntimeException{
    public CouldNotDeleteException(String message) {
        super(message);
    }

    public CouldNotDeleteException(String message, Throwable cause) {
        super(message, cause);
    }
}
