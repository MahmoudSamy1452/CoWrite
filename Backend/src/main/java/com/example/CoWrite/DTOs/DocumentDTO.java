package com.example.CoWrite.DTOs;

import lombok.Data;

import java.util.Date;
import com.example.CoWrite.Models.User;

@Data
public class DocumentDTO {

    private Long id;

    private String name;

    private String content;

    private Date createdAt;

    private Date updatedAt;
}
