package com.example.CoWrite.Services;

import com.example.CoWrite.Models.User;
import com.example.CoWrite.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public void createUser(User user) throws IllegalArgumentException {
        if(userRepository.existsByUsername(user.getUsername()))
            throw new IllegalArgumentException("Username already exists");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }


    }
}
