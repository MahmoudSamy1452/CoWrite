package com.example.CoWrite.Controllers;

import com.example.CoWrite.Models.User;
import com.example.CoWrite.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping (path = "/api/v1/auth/user")
public class UserController {

    private final UserService userService;
    @Autowired
    public UserController(UserService userService)
    {
        this.userService = userService;
    }

    @GetMapping("/test")
    public String testHello()
    {
        return "hello there";
    }
}
