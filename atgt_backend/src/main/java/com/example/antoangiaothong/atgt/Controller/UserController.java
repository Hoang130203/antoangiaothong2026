package com.example.antoangiaothong.atgt.Controller;

import com.example.antoangiaothong.atgt.Dto.UserRegister;
import com.example.antoangiaothong.atgt.Entity.Post;
import com.example.antoangiaothong.atgt.Entity.User;
import com.example.antoangiaothong.atgt.Entity.Video;
import com.example.antoangiaothong.atgt.Repository.RoleRepository;
import com.example.antoangiaothong.atgt.Service.UserService;
import com.example.antoangiaothong.atgt.Service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.Random;

@CrossOrigin
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final VideoService videoService;
    private final RoleRepository roleRepository;
    @Autowired
    public UserController(UserService userService, VideoService videoService, RoleRepository roleRepository){
        this.userService=userService;
        this.videoService=videoService;
        this.roleRepository = roleRepository;
    }
    @GetMapping("/video")
    @ResponseBody
    public Collection<Video> getVideo(){
        Video video=new Video();
        return userService.getAllVideo("12");
    }
    @GetMapping("/name")
    public ResponseEntity<String> getName() {
        String userName = userService.getUser("1234").getName();
        return ResponseEntity.status(HttpStatus.OK).body(userName);
    }
    @GetMapping("/owner")
    public User getOwner(){
        return videoService.getOwner(1);
    }

    @GetMapping("/posts/{id}")
    public Collection<Post> getPosts(@PathVariable String  id){
        return userService.getAllPost(id);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam("account") String account,@RequestParam("password") String password,@RequestParam("hasprovider") String hasProvider)
    {
        if(hasProvider.equals("0")){
            User user= userService.findAccount(account,password);
            if(user!=null)
            {
                return  ResponseEntity.ok(user);
            }
            return  ResponseEntity.badRequest().body("invalid username or password");
        }
       else{
            User user=userService.findById(account);
            if(user!=null)
            {
                return ResponseEntity.ok(user);
            }else{
                User newUser=new User();
                newUser.setId(account);
                newUser.setName(password);
                newUser.setAccount(randomString());
                newUser.setPassword(randomString());
                newUser.setHasProvider(true);
                newUser.setEnable(true);
                newUser.setAvatar(hasProvider);
                newUser.setType(2);
                userService.insertUser(newUser);
                return  ResponseEntity.ok(newUser);
            }
        }
    }
    public String randomString(){
        int length=10;
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();

        // Khai báo một StringBuilder để xây dựng xâu ngẫu nhiên
        StringBuilder sb = new StringBuilder();

        // Tạo xâu ngẫu nhiên bằng cách chọn ngẫu nhiên các ký tự từ chuỗi characters
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(characters.length());
            char randomChar = characters.charAt(index);
            sb.append(randomChar);
        }

        // In ra xâu ngẫu nhiên
        String randomString = sb.toString();
        return randomString;
    }
    @PostMapping("/signup")
    public ResponseEntity<?>signup(@RequestBody UserRegister userRegister){
        User newuser=userService.findAccountToSignUp(userRegister.getAccount());
        if(newuser==null){
            User user= new User();
            user.setAccount(userRegister.getAccount());
            user.setPassword(userRegister.getPassword());
            user.setName(userRegister.getName());
            user.setHasProvider(false);
            user.setEnable(true);
            user.setType(2);
            user.setId(randomString());
            userService.insertUser(user);
            return ResponseEntity.ok(user);
        }else{
            return  ResponseEntity.ok("tai khoan da ton tai");
        }

    }
    @PostMapping("/uppost")
    public ResponseEntity<?> upPost(@RequestBody Post post,@RequestParam String ownerId){
        try {

            Post p= userService.insertPost(post,ownerId);
            if(p==null){
                return  ResponseEntity.badRequest().body("Người dùng không tồn tại");
            }
            return ResponseEntity.ok(p);
        }catch (Exception e){
            return  ResponseEntity.badRequest().body("Loi");
        }

    }

    @DeleteMapping ("/deleteposts/{id}")
    public Post deletePost(@PathVariable Integer id){
        return userService.deletePost(id);
    }

    @GetMapping("/allpost")
    public List<Post> allPost(){
        return userService.getAllPosts();
    }


    @GetMapping("/info")
    public ResponseEntity<User> getInfo(@RequestParam String userId){
        return ResponseEntity.ok(userService.findById(userId));
    }

    @PutMapping("/info")
    @Transactional
    public ResponseEntity<?> putInfo(@RequestParam String userId,@RequestBody User u){
        User user= userService.findById(userId);
        if(user!=null){
            user.setAvatar(u.getAvatar());
            user.setPassword(u.getPassword());
            user.setName(u.getName());
            user.setSchool(u.getSchool());
            user.setOfClass(u.getOfClass());
            user.setGender(u.getGender());
            user.setEmail(u.getEmail());

            return ResponseEntity.ok(user);
        }
        return ResponseEntity.badRequest().body("error");
    }
    @PutMapping("/avatar")
    @Transactional
    public ResponseEntity<?> putAvatar(@RequestParam String userId,@RequestParam String avatar){
        User user= userService.findById(userId);
        if(user!=null){
            user.setAvatar(avatar);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.badRequest().body("error");
    }
}
