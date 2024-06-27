package com.elderlycare.handler.exceptions;

public class LoginRegisterException extends RuntimeException{
    private int status;
    public LoginRegisterException(String message,int status) {
        super(message);
        this.status = status;
    }

    @Override
    public String getMessage() {
        return super.getMessage();
    }

    public int getStatus(){
        return status;
    }
}
