package com.example.CoWrite.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {

    private Long id;

    private String name;

    private String content;

    private Date createdAt;

    private Date updatedAt;
}
