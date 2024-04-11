package com.example.CoWrite.Services;

import com.example.CoWrite.DTOs.DocumentDTO;
import com.example.CoWrite.Exceptions.APIException;
import com.example.CoWrite.Exceptions.CouldNotDeleteException;
import com.example.CoWrite.Exceptions.ResourceNotFoundException;
import com.example.CoWrite.Models.Document;
import com.example.CoWrite.Repositories.ContributorRepository;
import com.example.CoWrite.Repositories.DocumentRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    private final ContributorRepository contributorRepository;


    private final ModelMapper modelMapper;

    @Autowired
    public DocumentService(DocumentRepository documentRepository, ContributorRepository contributorRepository, ModelMapper modelMapper) {
        this.documentRepository = documentRepository;
        this.contributorRepository = contributorRepository;
        this.modelMapper = modelMapper;
    }

    public DocumentDTO getDocument(Long documentId) throws ResourceNotFoundException {
        Document document = documentRepository.findById(documentId).orElseThrow(
                () -> new ResourceNotFoundException("Document does not exist"));
        return modelMapper.map(document, DocumentDTO.class);
    }

    public DocumentDTO renameDocument(Long documentId, String newName) throws ResourceNotFoundException {
        Document document = documentRepository.findById(documentId).orElseThrow(
                () -> new ResourceNotFoundException("Document does not exist"));
        document.setName(newName);
        documentRepository.save(document);
        return modelMapper.map(document, DocumentDTO.class);
    }

    public void deleteDocument(Long documentId) throws ResourceNotFoundException, CouldNotDeleteException {
        Document document = documentRepository.findById(documentId).orElseThrow(
                () -> new ResourceNotFoundException("Document does not exist"));
        try {
            documentRepository.delete(document);
        }
        catch (Exception e) {
            throw new CouldNotDeleteException("Document could not be deleted" + e.getMessage());
        }
    }
}
