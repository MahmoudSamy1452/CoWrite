package com.example.CoWrite.Controllers;

import com.example.CoWrite.DTOs.JWT;
import com.example.CoWrite.Models.User;
import com.example.CoWrite.Services.UserService;
import com.example.CoWrite.Utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("https://cowrite-frontend.vercel.app")
@RequestMapping("/api/v1/auth")
public class AuthController {

    private AuthenticationManager authenticationManager;
    private UserService userService;
    private JWTUtil jwtUtil;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, UserService userService, JWTUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("register")
    public ResponseEntity<String> register(@RequestBody User user) {
        try {
            userService.createUser(user);
            return new ResponseEntity<>("User created successfully", HttpStatus.CREATED);
        } catch (IllegalArgumentException e){
            return new ResponseEntity<>("Username already exists", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            System.out.println("Error creating user" + e);
            return new ResponseEntity<>("Failed to create user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("login")
    public ResponseEntity<JWT> login(@RequestBody User user) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtil.generateToken(authentication);
        JWT jwt = new JWT(token);
        return new ResponseEntity<>(jwt, HttpStatus.OK);
    }
}
