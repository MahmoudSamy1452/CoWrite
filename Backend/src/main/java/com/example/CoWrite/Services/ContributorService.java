//package com.example.CoWrite.Services;
//
//import com.example.CoWrite.Repositories.ContributorRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.Authentication;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
//@Service
//public class ContributorService {
//
//
//    private final ContributorRepository contributorRepository;
//
//    @Autowired
//    public ContributorService(ContributorRepository contributorRepository) {
//        this.contributorRepository = contributorRepository;
//    }
//
//
//    private boolean isDocumentOwner(Authentication authentication, String documentId) {
//        String username = authentication.getName();
//        char role = contributorRepository.findUserRoleForDocument(username,documentId);
//        if(role == '\u0000')
//        {
//            //throw exception
//
//        }
//        return role == 'o';
//    }
//
//    private boolean hasDocumentPermission(Authentication authentication, long documentId, String permission) {
//        String username = authentication.getName();
//        char role = contributorRepository.findUserRoleForDocument(username,documentId);
//        return role == Character.toLowerCase(permission.charAt(0));
//
////        try {
////            userService.createUser(user);
////            return new ResponseEntity<>("User created successfully", HttpStatus.CREATED);
////        } catch (IllegalArgumentException e){
////            return new ResponseEntity<>("Username already exists", HttpStatus.BAD_REQUEST);
////        } catch (Exception e) {
////            System.out.println("Error creating user" + e);
////            return new ResponseEntity<>("Failed to create user", HttpStatus.INTERNAL_SERVER_ERROR);
////        }
//    }
//
//    @PreAuthorize("hasPermission(authentication,#document.getId(), )")
//    public void getAllDocuments() {
//        // ... your logic to retrieve documents
//    }
//
//    @PreAuthorize("hasPermission(authentication, 'document:write', #document.getId())")
//    public void updateDocument(Long documentId, Document document) {
//        // ... your logic to update document
//    }
//}
