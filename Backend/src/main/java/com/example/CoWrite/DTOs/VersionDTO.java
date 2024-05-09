package com.example.CoWrite.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VersionDTO {

    private Long id;

    private String content;

    private Long documentId;

    private int versionNumber;

    private Date createdAt;
}
