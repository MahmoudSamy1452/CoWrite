package com.example.CoWrite.Controllers;

import com.example.CoWrite.DTOs.DocumentDTO;
import com.example.CoWrite.Exceptions.BadRequestException;
import com.example.CoWrite.Exceptions.CouldNotDeleteException;
import com.example.CoWrite.Exceptions.ResourceNotFoundException;
import com.example.CoWrite.Exceptions.UnauthorizedException;
import com.example.CoWrite.Models.Document;
import com.example.CoWrite.Services.ContributorService;
import com.example.CoWrite.Services.DocumentService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5137")
@RequestMapping(path = "/api/v1/document")
public class DocumentController {

    private final DocumentService documentService;

    private final ContributorService contributorService;

    private final ModelMapper modelMapper;

    @Autowired
    public DocumentController(DocumentService documentService, ContributorService contributorService, ModelMapper modelMapper) {
        this.documentService = documentService;
        this.modelMapper = modelMapper;
        this.contributorService = contributorService;
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<Document> getDocument(@RequestAttribute("username") String username, @PathVariable Long documentId) throws ResourceNotFoundException, UnauthorizedException {
        if(!contributorService.isOwner(username, documentId) && !contributorService.isEditor(username, documentId) && !contributorService.isViewer(username, documentId))
            throw new UnauthorizedException("You have no access to this document");
        Document document = modelMapper.map(documentService.getDocument(documentId), Document.class);
        return ResponseEntity.status(200).body(document);
    }

    @GetMapping("/all")
    public ResponseEntity<List<DocumentDTO>> getDocuments(@RequestAttribute("username") String username) throws BadRequestException {
        List<DocumentDTO> documents = documentService.getDocuments(username)
                .stream()
                .map(documentDTO -> modelMapper.map(documentDTO, DocumentDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.status(200).body(documents);
    }

    @PostMapping("")
    public ResponseEntity<Object> createDocument(@RequestAttribute("username") String username, @RequestBody Document document) throws ResourceNotFoundException, BadRequestException {
        Document newDocument = documentService.createDocument(document);
        contributorService.setOwner(username, document);
        return ResponseEntity.status(201).body(newDocument);
    }

    @PutMapping("/save/{documentId}")
    public ResponseEntity<Document> saveDocument(@RequestAttribute("username") String username, @PathVariable Long documentId, @RequestBody Map<String, String> requestBody) throws ResourceNotFoundException, UnauthorizedException {
        if(!contributorService.isOwner(username, documentId) && !contributorService.isEditor(username, documentId))
            throw new UnauthorizedException("Only owners and editors can save documents");
        String content = requestBody.get("content");
        Document document = modelMapper.map(documentService.saveDocument(documentId, content), Document.class);
        return ResponseEntity.status(200).body(document);
    }

    @PutMapping("/rename/{documentId}")
    public ResponseEntity<Document> renameDocument(@RequestAttribute("username") String username, @PathVariable Long documentId, @RequestBody Map<String, String> requestBody) throws ResourceNotFoundException, UnauthorizedException {
        if(!contributorService.isOwner(username, documentId) && !contributorService.isEditor(username, documentId))
            throw new UnauthorizedException("Only owners and editors can rename documents");
        String newName = requestBody.get("name");
        Document document = modelMapper.map(documentService.renameDocument(documentId, newName), Document.class);
        return ResponseEntity.status(200).body(document);
    }

    @DeleteMapping("/delete/{documentId}")
    public ResponseEntity<Document> deleteDocument(@RequestAttribute("username") String username, @PathVariable Long documentId) throws ResourceNotFoundException, UnauthorizedException, CouldNotDeleteException {
        if(!contributorService.isOwner(username, documentId))
            throw new UnauthorizedException("Only owners can delete documents");
        documentService.deleteDocument(documentId);
        return ResponseEntity.status(200).build();
    }
}
