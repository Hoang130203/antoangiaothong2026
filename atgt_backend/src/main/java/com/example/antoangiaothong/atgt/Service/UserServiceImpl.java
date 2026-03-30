package com.example.antoangiaothong.atgt.Service;

import com.example.antoangiaothong.atgt.Entity.Post;
import com.example.antoangiaothong.atgt.Entity.Role;
import com.example.antoangiaothong.atgt.Entity.User;
import com.example.antoangiaothong.atgt.Entity.Video;
import com.example.antoangiaothong.atgt.Repository.PostRepository;
import com.example.antoangiaothong.atgt.Repository.RoleRepository;
import com.example.antoangiaothong.atgt.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private  final RoleRepository roleRepository;
    @Autowired
    public UserServiceImpl(UserRepository userRepository, PostRepository postRepository, RoleRepository roleRepository){
        this.userRepository=userRepository;
        this.postRepository = postRepository;
        this.roleRepository = roleRepository;
    }


    @Override
    public Collection<Video> getAllVideo(String userId) {
        User user= userRepository.getReferenceById(userId);
        if (user != null) {
            System.out.println(user.getName());
            return user.getVideos(); // Giả sử User có một phương thức getVideos() để lấy danh sách video
        } else {
            return null; // Trả về một danh sách rỗng nếu không tìm thấy user
        }
    }

    @Override
    public Collection<Post> getAllPost(String userId) {
        return userRepository.getReferenceById(userId).getPosts();
    }

    @Override
    public User getUser(String userId) {
        return userRepository.getReferenceById(userId);
    }

    @Override
    public User findAccount(String account, String pass) {
        try {
            User u=userRepository.findByAccountAndPassword(account,pass);
            if(u.getId().length()>=0){
                return u;
            }
            return  null;
        }catch (Exception e){
            return null;
        }

    }

    @Override
    public User findAccountToSignUp(String account) {
        return userRepository.findByAccount(account);
    }

    @Override
    public User findById(String id) {
        return userRepository.findByUserId(id);
    }

    @Override
    public Post deletePost(Integer id) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            post.setUser(null);
            postRepository.delete(post);
            // Thực hiện các thao tác với post
            return post;
        } else {
            // Xử lý trường hợp không tìm thấy bài đăng
            return  null;
        }

    }

    @Override
    @Transactional
    public User insertUser(User user) {

        // Lấy vai trò từ repository
        Role role = roleRepository.findByRoleId(2);

        if (user.getRoles() == null) {
            user.setRoles(new ArrayList<>());
        }
        // Thêm vai trò cho người dùng
        user.getRoles().add(role);

        // Lưu lại người dùng sau khi đã thêm vai trò
        userRepository.save(user);
        return user;
    }

    @Override
    @Transactional
    public Post insertPost(Post post,String ownerId) {
        Post p= new Post();
        try {
            post.setTime(new Timestamp(System.currentTimeMillis()));
    //        p=postRepository.save(post);
            User u=userRepository.findByUserId(ownerId);
//            Collection<Post> posts= u.getPosts();
//            if(posts==null){
//                posts=new ArrayList<Post>();
//            }
//            posts.add(p);
//            u.setPosts(posts);
            if(u==null){
                return null;
            }
            post.setUser(u);
            postRepository.save(post);
        }catch (Exception e){

        }
        return p;
    }

    @Override
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user=userRepository.findByUserName(username);
        if(user==null)
        {
            throw new UsernameNotFoundException("Invalid username or password");
        }
        return new org.springframework.security.core.userdetails.User(user.getAccount(),user.getPassword(),
                mapRolesToAuthorities(user.getRoles()));
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Collection<Role> roles){
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList());
    }
}
