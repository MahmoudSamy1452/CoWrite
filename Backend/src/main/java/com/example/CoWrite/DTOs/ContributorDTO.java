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

    private Long id;

    private User username;

    private Document document;

    private char role;
}
