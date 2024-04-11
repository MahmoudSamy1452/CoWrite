package com.example.CoWrite.Services;

import com.example.CoWrite.DTOs.DocumentDTO;
import com.example.CoWrite.Exceptions.CouldNotDeleteException;
import com.example.CoWrite.Exceptions.BadRequest;
import com.example.CoWrite.Exceptions.ResourceNotFoundException;
import com.example.CoWrite.Models.Document;
import com.example.CoWrite.Repositories.DocumentRepository;
import com.example.CoWrite.Utils.JWTGenerator;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    private final JWTGenerator jwtGenerator;

    private final ModelMapper modelMapper;

    @Autowired
    public DocumentService(DocumentRepository documentRepository, JWTGenerator jwtGenerator, ModelMapper modelMapper) {
        this.documentRepository = documentRepository;
        this.jwtGenerator = jwtGenerator;
        this.modelMapper = modelMapper;
    }

    public DocumentDTO getDocument(Long documentId) throws ResourceNotFoundException {
        Document document = documentRepository.findById(documentId).orElseThrow(
                () -> new ResourceNotFoundException("Document does not exist"));
        return modelMapper.map(document, DocumentDTO.class);
    }

    public List<DocumentDTO> getDocuments(String bearerToken) throws BadRequest {
        if(!(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer "))) {
            throw new BadRequest("Username is required");
        }

        String username = jwtGenerator.getUsernameFromJWT(bearerToken.substring(7, bearerToken.length()));

        return documentRepository.findDocumentsByUsername(username);
    }

    public void createDocument(Document document) {
        if (document.getName() == null || document.getName().isEmpty()) {
            throw new BadRequest("Document name is required");
        }
        document.setCreatedAt(new Date());
        document.setContent("");
        documentRepository.save(document);
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
