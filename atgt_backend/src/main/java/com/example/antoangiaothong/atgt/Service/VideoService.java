package com.example.antoangiaothong.atgt.Service;

import com.example.antoangiaothong.atgt.Entity.Image;
import com.example.antoangiaothong.atgt.Entity.User;
import com.example.antoangiaothong.atgt.Entity.Video;

import java.util.Collection;

public interface VideoService {
    User getOwner(int id);
    Video insertVideo(Video video,String userId);
    Collection<Video> getAll();
    Video getVideoById(int id);
    Collection<Image> getAllImage();
    Image insertImage(Image image,String ownerId);
}
