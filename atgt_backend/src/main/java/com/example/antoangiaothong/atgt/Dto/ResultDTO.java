package com.example.antoangiaothong.atgt.Dto;

import com.example.antoangiaothong.atgt.Entity.Result;
import com.example.antoangiaothong.atgt.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@NoArgsConstructor
@Getter@Setter

public class ResultDTO implements Serializable {
    private Result result;
    private String name;
    private String avatar;

    public ResultDTO(Result result, String name,String avatar) {
        this.result = result;
        this.name=  name;
        this.avatar= avatar;
    }
}
