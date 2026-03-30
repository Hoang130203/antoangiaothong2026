package com.example.antoangiaothong.atgt.Security;

import com.example.antoangiaothong.atgt.Service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:3001", "https://gdgt.maiminhhoang.id.vn"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserService userService) {
        DaoAuthenticationProvider auth = new DaoAuthenticationProvider();
        auth.setUserDetailsService(userService);
        auth.setPasswordEncoder(passwordEncoder());
        return auth;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.authorizeHttpRequests(config -> config
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/users/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/users/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/allpost").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users/signup").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/users/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/videos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "api/videos/postImage").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/videos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/videos").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/upload").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/exams/result").hasRole("USER")
                .requestMatchers(HttpMethod.POST, "/api/exams/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/exams/**").hasRole("USER")
                .requestMatchers(HttpMethod.POST, "/api/posts/**").hasRole("USER")
                .requestMatchers("/posts/**").hasRole("ADMIN")
                .anyRequest().authenticated()
        );
        httpSecurity.httpBasic(Customizer.withDefaults());
        httpSecurity.csrf(csrf -> csrf.disable());
        httpSecurity.cors(Customizer.withDefaults());
        return httpSecurity.build();
    }
}
