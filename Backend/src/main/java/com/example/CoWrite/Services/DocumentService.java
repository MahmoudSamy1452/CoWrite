package com.example.CoWrite.Services;

import com.example.CoWrite.DTOs.DocumentDTO;
import com.example.CoWrite.Exceptions.CouldNotDeleteException;
import com.example.CoWrite.Exceptions.BadRequestException;
import com.example.CoWrite.Exceptions.ResourceNotFoundException;
import com.example.CoWrite.Models.Document;
import com.example.CoWrite.Repositories.DocumentRepository;
import com.example.CoWrite.Utils.JWTUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    private final JWTUtil jwtUtil;

    private final ModelMapper modelMapper;

    @Autowired
    public DocumentService(DocumentRepository documentRepository, JWTUtil jwtUtil, ModelMapper modelMapper) {
        this.documentRepository = documentRepository;
        this.jwtUtil = jwtUtil;
        this.modelMapper = modelMapper;
    }

    public DocumentDTO getDocument(Long documentId) throws ResourceNotFoundException {
        Document document = documentRepository.findById(documentId).orElseThrow(
                () -> new ResourceNotFoundException("Document does not exist"));
        return modelMapper.map(document, DocumentDTO.class);
    }

    public List<DocumentDTO> getDocuments(String username) throws BadRequestException {
        return documentRepository.findDocumentsByUsername(username);
    }

    public Document createDocument(Document document) throws BadRequestException {
        if (document.getName() == null || document.getName().isEmpty()) {
            throw new BadRequestException("Document name is required");
        }
        document.setCreatedAt(new Date());
        document.setUpdatedAt(new Date());
        document.setContent("");
        System.out.println("help");
        return documentRepository.save(document);
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

    public Object saveDocument(Long documentId, String content) throws ResourceNotFoundException{
        Document document = documentRepository.findById(documentId).orElseThrow(
                () -> new ResourceNotFoundException("Document does not exist"));
        document.setContent(content);
        document.setUpdatedAt(new Date());
        documentRepository.save(document);
        return modelMapper.map(document, DocumentDTO.class);
    }
}
