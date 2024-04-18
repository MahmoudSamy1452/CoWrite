package com.example.CoWrite.Controllers;

import com.example.CoWrite.Exceptions.BadRequestException;
import com.example.CoWrite.Exceptions.ResourceNotFoundException;
import com.example.CoWrite.Exceptions.UnauthorizedException;
import com.example.CoWrite.Models.Contributor;
import com.example.CoWrite.Services.ContributorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/v1/contributor")
public class ContributorController {

    private final ContributorService contributorService;


    @Autowired
    public ContributorController(ContributorService contributorService) {
        this.contributorService = contributorService;
    }

    @PostMapping("/share")
    public ResponseEntity<String> shareDocument(@RequestAttribute("username") String username, @RequestBody Contributor contributor) throws ResourceNotFoundException, BadRequestException {
        if(!contributorService.isOwner(username, contributor.getDocument().getId()) && !contributorService.isEditor(username, contributor.getDocument().getId()))
            throw new UnauthorizedException("Only owners and editors of a document can share it");
        contributorService.shareDocument(contributor);
        return ResponseEntity.status(200).body("Document shared successfully");
    }
}
