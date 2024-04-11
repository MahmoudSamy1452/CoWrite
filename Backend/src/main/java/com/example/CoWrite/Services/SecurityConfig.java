package com.example.CoWrite.Services;

import com.example.CoWrite.Models.Contributor;
import com.example.CoWrite.Utils.JWTAuthenticationFilter;
import com.example.CoWrite.Utils.JWTAuthEntryPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private JWTAuthEntryPoint authEntryPoint;

//    @Autowired
//    private ContributorService contributorService;
    @Autowired
    public SecurityConfig(JWTAuthEntryPoint authEntryPoint) {
        this.authEntryPoint = authEntryPoint;
    }
    
    @Bean
     public BCryptPasswordEncoder bCryptPasswordEncoder() {
         return new BCryptPasswordEncoder();
     }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeHttpRequests((auth) -> auth
                    .requestMatchers("/api/v1/auth/**").permitAll()
//                    .requestMatchers("/api/v1/documents/{id}").access("@contributorService.isDocumentOwner(authentication, #documentId) or @contributorService.hasDocumentPermission(authentication, #documentId, 'READ')")
//                    .requestMatchers("/api/v1/documents/{id}/content").access("@contributorService.hasDocumentPermission(authentication, #documentId, 'WRITE')")
                    .anyRequest().authenticated()
                )
                .httpBasic(httpSecurityHttpBasicConfigurer -> httpSecurityHttpBasicConfigurer.authenticationEntryPoint(authEntryPoint));

        http.sessionManagement(httpSecuritySessionManagementConfigurer -> httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public JWTAuthenticationFilter jwtAuthenticationFilter() {
        return new JWTAuthenticationFilter();
    }
}
