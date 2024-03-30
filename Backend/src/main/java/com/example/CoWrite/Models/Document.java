package com.example.CoWrite.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "document")
@NoArgsConstructor
@Data
public class Document {

    @Id @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne (optional = false)
    @JoinColumn (name = "owner")
    private User owner;

    private String content;

    private Date createdAt;

    private Date updatedAt;
}
