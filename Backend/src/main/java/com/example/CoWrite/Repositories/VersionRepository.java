package com.example.CoWrite.Repositories;

import com.example.CoWrite.Models.Version;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VersionRepository extends JpaRepository<Version, Long> {

    @Query("SELECT v FROM Version v WHERE v.document.id = :documentId ORDER BY v.versionNumber DESC")
    List<Version> findAllByDocumentId(Long documentId);
}
