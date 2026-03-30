package com.example.antoangiaothong.atgt.Security;

import com.example.antoangiaothong.atgt.Service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    //bcrypt bean definition
    @Bean
    public PasswordEncoder passwordEncoder(){
        return NoOpPasswordEncoder.getInstance();
    }

    //authenticationProvider bean definition
    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserService userService){
        DaoAuthenticationProvider auth= new DaoAuthenticationProvider();
        auth.setUserDetailsService(userService);
        auth.setPasswordEncoder(passwordEncoder());
        return auth;
    }

    @Bean
    public SecurityFilterChain filterChain (HttpSecurity httpSecurity) throws Exception{
        httpSecurity.authorizeHttpRequests(config->
                config
                    .requestMatchers(HttpMethod.GET,"/users/**").permitAll()
                    .requestMatchers(HttpMethod.GET,"/posts/**").permitAll()
                    .requestMatchers(HttpMethod.PUT,"/users/**").permitAll()
                    .requestMatchers(HttpMethod.POST,"/users/**").permitAll()
                    .requestMatchers(HttpMethod.DELETE,"/users/**").permitAll()
                    .requestMatchers(HttpMethod.POST,"/api/users/login").permitAll()
                    .requestMatchers(HttpMethod.GET,"/api/users/allpost").permitAll()
                    .requestMatchers(HttpMethod.POST,"/api/users/signup").permitAll()
                    .requestMatchers(HttpMethod.GET,"/api/posts/**").permitAll()
                    .requestMatchers(HttpMethod.POST,"/api/videos/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST,"api/videos/postImage").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.GET,"/api/videos/**").permitAll()
                    .requestMatchers(HttpMethod.GET,"/videos").permitAll()
                    .requestMatchers(HttpMethod.POST,"/api/exams/result").hasRole("USER")
                    .requestMatchers(HttpMethod.POST,"/api/exams/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.GET,"/api/exams/**").hasRole("USER")
                    .requestMatchers(HttpMethod.GET,"/api/exams/**").hasRole("USER")
                    .requestMatchers(HttpMethod.POST,"/api/posts/**").hasRole("USER")
                    .requestMatchers("/posts/**").hasRole("ADMIN")
                .anyRequest().authenticated()
        );
        httpSecurity.httpBasic();
        httpSecurity.csrf().disable();
        return httpSecurity.build();
    }
}
