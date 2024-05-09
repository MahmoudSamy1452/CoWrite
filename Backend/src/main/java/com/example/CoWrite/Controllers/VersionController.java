package com.example.CoWrite.Controllers;

import com.example.CoWrite.DTOs.VersionDTO;
import com.example.CoWrite.Models.Version;
import com.example.CoWrite.Services.VersionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "https://cowrite-frontend.vercel.app")
@RequestMapping(path = "/api/v1/version")
public class VersionController {

    private final VersionService versionService;

    @Autowired
    public VersionController(VersionService versionService) {
        this.versionService = versionService;
    }

    @GetMapping("/history/{documentId}")
    public ResponseEntity<List<VersionDTO>> getVersions(@PathVariable Long documentId) {
        List<VersionDTO> versions = versionService.getVersions(documentId);
        return ResponseEntity.status(200).body(versions);
    }

    @GetMapping("/{versionId}")
    public ResponseEntity<VersionDTO> getVersion(@PathVariable Long versionId) {
        VersionDTO version = versionService.getVersion(versionId);
        return ResponseEntity.status(200).body(version);
    }
}
