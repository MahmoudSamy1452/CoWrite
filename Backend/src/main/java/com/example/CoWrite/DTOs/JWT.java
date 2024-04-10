package com.example.CoWrite.DTOs;

import lombok.Data;

@Data
public class JWT {
    private String accessToken;

    public JWT(String accessToken) {
        this.accessToken = accessToken;
    }
}
