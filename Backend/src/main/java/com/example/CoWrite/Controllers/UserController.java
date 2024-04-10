package com.example.CoWrite.Controllers;

import com.example.CoWrite.Models.User;
import com.example.CoWrite.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping (path = "/api/v1/user")
public class UserController {

    private final UserService userService;
    @Autowired
    public UserController(UserService userService)
    {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public void signup(@RequestBody User user)
    {
        userService.createUser(user);
    }

    @GetMapping("/test")
    public String testHello()
    {
        return "hello there";
    }
}
