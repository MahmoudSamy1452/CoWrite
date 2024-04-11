package com.example.CoWrite.Repositories;

import com.example.CoWrite.Models.Contributor;
import com.example.CoWrite.Models.Document;
import com.example.CoWrite.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContributorRepository extends JpaRepository<Contributor, Long> {
    Contributor findByUsernameAndDocument(User username, Document document);
}
