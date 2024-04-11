package com.example.CoWrite.Services;

import com.example.CoWrite.Exceptions.CouldNotDeleteException;
import com.example.CoWrite.Exceptions.ResourceNotFoundException;
import com.example.CoWrite.Models.Contributor;
import com.example.CoWrite.Repositories.ContributorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

@Service
public class ContributorService {

    private final ContributorRepository contributorRepository;

    @Autowired
    public ContributorService(ContributorRepository contributorRepository) {
        this.contributorRepository = contributorRepository;
    }

    public Contributor shareDocument(Contributor contributor) throws ResourceNotFoundException, CouldNotDeleteException {
//        Check if the user is already a contributor to the document
        Contributor existingContributor = contributorRepository.findByUsernameAndDocument(contributor.getUsername(), contributor.getDocument());
        if (existingContributor != null && existingContributor.getRole() == contributor.getRole()) {
            throw new CouldNotDeleteException("User is already a contributor to the document");
        }
        try {
            if (existingContributor != null){
                existingContributor.setRole(contributor.getRole());
                return contributorRepository.save(existingContributor);
            }
            return contributorRepository.save(contributor);
        } catch (DataAccessException e) {
            throw new ResourceNotFoundException(e.getMessage());
        }
    }
}
