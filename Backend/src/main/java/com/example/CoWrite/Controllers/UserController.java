package com.example.CoWrite.Controllers;

import com.example.CoWrite.Models.User;
import com.example.CoWrite.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
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

    @GetMapping("/test")
    public String testHello(@RequestHeader("Authentication") String bearerToken)
    {
        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7, bearerToken.length());
        }

        return "hello there";
    }
}
