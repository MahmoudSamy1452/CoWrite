package com.example.CoWrite.Services;

import com.example.CoWrite.Repositories.ContributorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContributorService {

    private final ContributorRepository contributorRepository;

    @Autowired
    public ContributorService(ContributorRepository contributorRepository) {
        this.contributorRepository = contributorRepository;
    }

}
