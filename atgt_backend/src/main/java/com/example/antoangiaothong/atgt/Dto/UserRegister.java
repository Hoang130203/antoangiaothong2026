package com.example.antoangiaothong.atgt.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegister {
    private String account;
    private String password;
    private  String name;
}
