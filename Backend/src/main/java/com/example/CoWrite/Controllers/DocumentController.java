package com.example.CoWrite.Controllers;

import com.example.CoWrite.Exceptions.ResourceNotFoundException;
import com.example.CoWrite.Models.Document;
import com.example.CoWrite.Services.DocumentService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import java.util.Map;

@RestController
@RequestMapping(path = "api/v1/document")
public class DocumentController {

    private final DocumentService documentService;

    private final ModelMapper modelMapper;

    @Autowired
    public DocumentController(DocumentService documentService, ModelMapper modelMapper) {
        this.documentService = documentService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<Document> getDocument(@PathVariable Long documentId) throws ResourceNotFoundException {
        Document document = modelMapper.map(documentService.getDocument(documentId), Document.class);
        return ResponseEntity.status(200).body(document);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Document>> getDocuments(@RequestHeader("Authorization") String bearerToken) {
        List<Document> documents = documentService.getDocuments(bearerToken)
                .stream()
                .map(documentDTO -> modelMapper.map(documentDTO, Document.class))
                .collect(Collectors.toList());
        return ResponseEntity.status(200).body(documents);
    }

    @PostMapping("")
    public ResponseEntity<Object> createDocument(@RequestBody Document document) {
        documentService.createDocument(document);
        return ResponseEntity.status(200).build();
    }

    @PutMapping("/rename/{documentId}")
    public ResponseEntity<Document> renameDocument(@PathVariable Long documentId, @RequestBody Map<String, String> requestBody) throws ResourceNotFoundException {
        String newName = requestBody.get("name");
        Document document = modelMapper.map(documentService.renameDocument(documentId, newName), Document.class);
        return ResponseEntity.status(200).body(document);
    }

    @DeleteMapping("/delete/{documentId}")
    public ResponseEntity<Document> deleteDocument(@PathVariable Long documentId) throws ResourceNotFoundException {
        documentService.deleteDocument(documentId);
        return ResponseEntity.status(200).build();
    }
}
