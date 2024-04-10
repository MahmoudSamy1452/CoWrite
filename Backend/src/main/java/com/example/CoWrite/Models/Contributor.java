package com.example.CoWrite.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contributor")
@NoArgsConstructor
@Data
public class Contributor {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne (optional = false)
    @JoinColumn (name = "username")
    private User username;

    @ManyToOne (optional = false)
    @JoinColumn (name = "document_id")
    private Document document;

    private char role;
}
