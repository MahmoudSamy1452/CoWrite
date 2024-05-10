package com.example.CoWrite.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.util.Date;

@Entity
@Table(name = "version")
@NoArgsConstructor
@Data
public class Version {

    @Id @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    private String content;

    @CreatedDate
    private Date createdAt;

    @ManyToOne (cascade = CascadeType.REMOVE, optional = false)
    private Document document;

    @Column(nullable = false)
    private int versionNumber;
}
