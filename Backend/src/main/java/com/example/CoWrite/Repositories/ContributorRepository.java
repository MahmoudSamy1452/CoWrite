package com.example.CoWrite.Repositories;

import com.example.CoWrite.Models.Contributor;
import com.example.CoWrite.Models.Document;
import com.example.CoWrite.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ContributorRepository extends JpaRepository<Contributor, Long> {
    Contributor findByUsernameAndDocument(User username, Document document);

    @Query("SELECT new com.example.CoWrite.DTOs.ContributorDTO(c.username.username , c.document.id, c.role) FROM Contributor c WHERE c.username.username = ?1 AND c.document.id = ?2")
    com.example.CoWrite.DTOs.ContributorDTO findByUsernameAndDocument(String username, Long documentId);
}
