package com.example.CoWrite.Services;

import com.example.CoWrite.DTOs.ContributorDTO;
import com.example.CoWrite.Exceptions.BadRequestException;
import com.example.CoWrite.Exceptions.ResourceNotFoundException;
import com.example.CoWrite.Models.Contributor;
import com.example.CoWrite.Models.Document;
import com.example.CoWrite.Models.User;
import com.example.CoWrite.Repositories.ContributorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

@Service
public class ContributorService {

    private final ContributorRepository contributorRepository;

    private final UserService userService;

    @Autowired
    public ContributorService(ContributorRepository contributorRepository, UserService userService) {
        this.contributorRepository = contributorRepository;
        this.userService = userService;
    }

    public void shareDocument(Contributor contributor) throws ResourceNotFoundException, BadRequestException {
//        Check if the user is already a contributor to the document
        Contributor existingContributor = contributorRepository.findByUsernameAndDocument(contributor.getUsername(), contributor.getDocument());
        if (existingContributor != null && existingContributor.getRole() == contributor.getRole()) {
            throw new BadRequestException("User is already " + (contributor.getRole() == 'v' ? "a viewer" : "an editor") + " to the document");
        }
        if (contributor.getRole() != 'e' && contributor.getRole() != 'v')
            throw new BadRequestException("Can only share with an editor or a viewer");
        try {
            if (existingContributor != null){
                existingContributor.setRole(contributor.getRole());
                contributorRepository.save(existingContributor);
            }
            else
                contributorRepository.save(contributor);
        } catch (DataAccessException e) {
            throw new ResourceNotFoundException(e.getMessage());
        }
    }

    public void setOwner(String username, Document document) throws ResourceNotFoundException {
        Contributor contributor = new Contributor();
        contributor.setDocument(document);
        User user = userService.getUser(username);
        contributor.setUsername(user);
        contributor.setRole('o');
        contributorRepository.save(contributor);
    }

    public boolean isOwner(String username, Long documentId){
        ContributorDTO existingContributor = contributorRepository.findByUsernameAndDocument(username, documentId);
        return existingContributor != null && existingContributor.getRole() == 'o';
    }

    public boolean isViewer(String username, Long documentId){
        ContributorDTO existingContributor = contributorRepository.findByUsernameAndDocument(username, documentId);
        return existingContributor != null && existingContributor.getRole() == 'v';
    }

    public boolean isEditor(String username, Long documentId){
        ContributorDTO existingContributor = contributorRepository.findByUsernameAndDocument(username, documentId);
        return existingContributor != null && existingContributor.getRole() == 'e';
    }
}
