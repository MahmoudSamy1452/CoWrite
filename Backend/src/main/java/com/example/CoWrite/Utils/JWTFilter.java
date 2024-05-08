package com.example.CoWrite.Utils;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

import java.io.IOException;


//public class JWTFilter implements Filter {
//
//    @Autowired
//    private JWTUtil jwtUtil;
//
//    @Override
//    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
//            throws IOException, ServletException {
//        HttpServletRequest request = (HttpServletRequest) req;
//        HttpServletResponse response = (HttpServletResponse) res;
//
//        // Get the JWT token from the request header
//        String jwt = jwtUtil.getJWTFromRequest(request);
//
//
//        if(StringUtils.hasText(jwt)) {
//        // Extract the username from the JWT token (you need to implement this)
//        String username = jwtUtil.getUsernameFromJWT(jwt);
//
//        // Set the username in the request attribute
//
//
//        chain.doFilter(request, response);
//    }
//}