package com.example.antoangiaothong.atgt.Service;

import com.example.antoangiaothong.atgt.Entity.Image;
import com.example.antoangiaothong.atgt.Entity.User;
import com.example.antoangiaothong.atgt.Entity.Video;
import com.example.antoangiaothong.atgt.Repository.ImageRepository;
import com.example.antoangiaothong.atgt.Repository.UserRepository;
import com.example.antoangiaothong.atgt.Repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.Optional;

@Service
public class VideoServiceImpl implements VideoService{
    private final VideoRepository videoRepository;
    private final UserRepository userRepository;
    private final ImageRepository imageRepository;
    @Autowired
    public VideoServiceImpl(VideoRepository videoRepository, UserRepository userRepository, ImageRepository imageRepository){
        this.videoRepository=videoRepository;
        this.userRepository = userRepository;
        this.imageRepository = imageRepository;
    }
    @Override
    public User getOwner(int id) {
        return videoRepository.getReferenceById(id).getOwner();
    }

    @Override
    @Transactional
    public Video insertVideo(Video video, String userId) {
        try {
            video.setTime(new Timestamp(System.currentTimeMillis()));
            User owner= userRepository.findByUserId(userId);
            if(owner==null){
                return null;
            }
            video.setOwner(owner);
            videoRepository.save(video);
            return video;
        }catch (Exception e){
            return null;
        }

    }

    @Override
    public Collection<Video> getAll() {
        return videoRepository.findAll();
    }

    @Override
    public Video getVideoById(int id) {
        Optional<Video> video=videoRepository.findById(id);
        if(video.isPresent()){
            return video.get();
        }else{
            return null;
        }
    }

    @Override
    public Collection<Image> getAllImage() {
        return imageRepository.findAll();
    }

    @Override
    @Transactional
    public Image insertImage(Image image, String ownerId) {
        User owner= userRepository.findByUserId(ownerId);
        if(owner==null){
            return null;
        }
        image.setOwner(owner);
        imageRepository.save(image);
        return image;
    }
}
