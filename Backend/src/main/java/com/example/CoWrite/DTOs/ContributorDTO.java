package com.example.CoWrite.DTOs;

import com.example.CoWrite.Models.Document;
import com.example.CoWrite.Models.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ContributorDTO {

    private String username;

    private Long document;

    private char role;
}
