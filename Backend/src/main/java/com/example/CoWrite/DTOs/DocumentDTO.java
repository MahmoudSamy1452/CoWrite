package com.example.CoWrite.DTOs;

import lombok.Data;

import java.util.Date;

@Data
public class DocumentDTO {

    private Long id;

    private String name;

    private String content;

    private Date createdAt;

    private Date updatedAt;
}
