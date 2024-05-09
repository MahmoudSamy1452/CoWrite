package com.example.CoWrite.Services;

import com.example.CoWrite.DTOs.VersionDTO;
import com.example.CoWrite.Exceptions.ResourceNotFoundException;
import com.example.CoWrite.Models.Document;
import com.example.CoWrite.Models.Version;
import com.example.CoWrite.Repositories.DocumentRepository;
import com.example.CoWrite.Repositories.VersionRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VersionService {

    private final VersionRepository versionRepository;

    private final DocumentRepository documentRepository;

    private final ModelMapper modelMapper;

    @Autowired
    public VersionService(VersionRepository versionRepository, DocumentRepository documentRepository, ModelMapper modelMapper) {
        this.versionRepository = versionRepository;
        this.documentRepository = documentRepository;
        this.modelMapper = modelMapper;

        PropertyMap<Version, VersionDTO> versionMap = new PropertyMap<Version, VersionDTO>() {
            protected void configure() {
                map().setDocumentId(source.getDocument().getId());
            }
        };

        modelMapper.addMappings(versionMap);
    }

    public List<VersionDTO> getVersions(Long documentId) {
        Document document = documentRepository.findById(documentId).orElseThrow(
                () -> new ResourceNotFoundException("Document does not exist"));

        return versionRepository.findAllByDocumentId(documentId).stream()
                .map(version -> modelMapper.map(version, VersionDTO.class))
                .toList();
    }

    public VersionDTO getVersion(Long versionId) {
        return versionRepository.findById(versionId).map(
                version -> modelMapper.map(version, VersionDTO.class)
        ).orElseThrow(
                () -> new ResourceNotFoundException("Version does not exist"));
    }
}
