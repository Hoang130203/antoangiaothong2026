package com.example.antoangiaothong.atgt.Controller;

import com.example.antoangiaothong.atgt.Entity.Image;
import com.example.antoangiaothong.atgt.Entity.Video;
import com.example.antoangiaothong.atgt.Service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@CrossOrigin
@RestController
@RequestMapping("/api/videos")
public class VideoController {
    private final VideoService videoService;

    @Autowired
    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @PostMapping("/postVideo")
    public ResponseEntity<Video> postVideo(@RequestBody Video video, @RequestParam String userId){
        Video v= videoService.insertVideo(video,userId);
        return ResponseEntity.ok(v);
    }

    @GetMapping("/getAllVideo")
    public ResponseEntity<Collection<Video>> getVideo(){
        Collection<Video> list = videoService.getAll();
        if(list==null){
            return ResponseEntity.ok(null);
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/getVideoById/{id}")
    public ResponseEntity<Video> getVideoById(@PathVariable int id){
        return ResponseEntity.ok(videoService.getVideoById(id));
    }

    @GetMapping("/getAllImages")
    public ResponseEntity<Collection<Image>> getAllImages(){
        return  ResponseEntity.ok(videoService.getAllImage());
    }

    @PostMapping("/postImage")
    public ResponseEntity<Image> postImage(@RequestParam String url,@RequestParam String ownerId){
        Image image= new Image();
        image.setUrl(url);
        return ResponseEntity.ok(videoService.insertImage(image,ownerId)) ;
    }
}
