package com.example.antoangiaothong.atgt.Config;

import com.example.antoangiaothong.atgt.Entity.Role;
import com.example.antoangiaothong.atgt.Entity.User;
import com.example.antoangiaothong.atgt.Repository.RoleRepository;
import com.example.antoangiaothong.atgt.Repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedRoles();
        seedAdminUser();
    }

    private void seedRoles() {
        if (roleRepository.count() == 0) {
            Role admin = new Role();
            admin.setName("ROLE_ADMIN");

            Role user = new Role();
            user.setName("ROLE_USER");

            roleRepository.saveAll(List.of(admin, user));
        }
    }

    private void seedAdminUser() {
        Role adminRole = roleRepository.findByRoleId(1);
        Role userRole  = roleRepository.findByRoleId(2);

        User admin = userRepository.findByUserId("admin");
        if (admin == null) {
            admin = new User();
            admin.setId("admin");
            admin.setName("Admin");
            admin.setAccount("admin");
            admin.setPassword("admin");
            admin.setEnable(true);
            admin.setHasProvider(false);
            admin.setType(1);
        }

        // Ensure admin always has both ROLE_ADMIN and ROLE_USER
        List<Role> roles = new ArrayList<>();
        if (adminRole != null) roles.add(adminRole);
        if (userRole  != null) roles.add(userRole);
        admin.setRoles(roles);

        userRepository.save(admin);
    }
}
