package com.abhaenterprise.common.exception;

/**
 * Bad Request Exception
 * 
 * Thrown when request data is invalid or malformed.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
