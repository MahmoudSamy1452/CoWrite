package com.example.CoWrite.Controllers;

import com.example.CoWrite.Exceptions.ResourceNotFoundException;
import com.example.CoWrite.Models.Contributor;
import com.example.CoWrite.Services.ContributorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/v1/contributor")
public class ContributorController {

    private final ContributorService contributorService;


    @Autowired
    public ContributorController(ContributorService contributorService) {
        this.contributorService = contributorService;
    }

    @PostMapping("/share")
    public ResponseEntity<Contributor> shareDocument(@RequestBody Contributor contributor) throws ResourceNotFoundException {
        return ResponseEntity.status(200).body(contributorService.shareDocument(contributor));
    }
}
