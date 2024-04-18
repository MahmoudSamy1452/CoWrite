package com.example.CoWrite.Repositories;

import com.example.CoWrite.DTOs.DocumentDTO;
import com.example.CoWrite.Models.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    @Query("SELECT new com.example.CoWrite.DTOs.DocumentDTO(d.id, d.name, d.content, d.createdAt, d.updatedAt, c.role) FROM Document d INNER JOIN Contributor c ON d.id = c.document.id WHERE c.username.username = ?1")
    List<DocumentDTO> findDocumentsByUsername(String username);
}
