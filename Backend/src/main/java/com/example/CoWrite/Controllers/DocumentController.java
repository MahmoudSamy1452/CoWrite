package com.example.CoWrite.Controllers;

import com.example.CoWrite.Exceptions.ResourceNotFoundException;
import com.example.CoWrite.Models.Document;
import com.example.CoWrite.Services.DocumentService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public Document getDocument(@PathVariable Long documentId) throws ResourceNotFoundException {
        return modelMapper.map(documentService.getDocument(documentId), Document.class);
    }
}
