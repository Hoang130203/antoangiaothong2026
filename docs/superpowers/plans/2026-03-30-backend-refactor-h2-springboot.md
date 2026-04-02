# Backend Refactor: H2 + Spring Boot 3.3 + Cloud Run Optimization

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace MSSQL with H2 file-mode, upgrade Spring Boot 3.2→3.3 / Java 17→21, fix N+1 queries, and optimize Docker for Google Cloud Run free tier.

**Architecture:** Single Spring Boot app with embedded H2 file database (no external DB container needed). Data persists in `./data/atgt.mv.db` and is mounted as a Docker volume. Entities stay JPA/Hibernate with lazy loading fixed. Security stays HTTP Basic (no auth changes to avoid breaking frontend).

**Tech Stack:** Spring Boot 3.3.8, Java 21, H2 2.x, JPA/Hibernate 6, Lombok, Docker (eclipse-temurin:21-jre-alpine), docker-compose v3.8

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Modify | `atgt_backend/pom.xml` | Upgrade SB 3.3.8, Java 21, swap mssql→h2, remove data-rest |
| Modify | `atgt_backend/src/main/resources/application.properties` | H2 file mode config |
| Modify | `atgt_backend/src/main/java/.../Entity/User.java` | Remove nvarchar, fix EAGER→LAZY on collections, remove cascade from ManyToMany |
| Modify | `atgt_backend/src/main/java/.../Entity/Post.java` | Remove nvarchar, fix EAGER→LAZY, remove cascade from ManyToMany |
| Modify | `atgt_backend/src/main/java/.../Entity/Exam.java` | Remove nvarchar, fix EAGER→LAZY, remove cascade from ManyToMany |
| Modify | `atgt_backend/src/main/java/.../Entity/Question.java` | Remove nvarchar columnDef |
| Modify | `atgt_backend/src/main/java/.../Entity/Comment.java` | Remove nvarchar columnDef |
| Modify | `atgt_backend/src/main/java/.../Entity/Image.java` | Remove nvarchar columnDef |
| Modify | `atgt_backend/src/main/java/.../Entity/Video.java` | Remove nvarchar columnDef |
| Modify | `atgt_backend/src/main/java/.../Security/SecurityConfig.java` | Fix deprecated httpBasic/csrf API |
| Modify | `atgt_backend/src/main/java/.../Repository/ExamRepository.java` | Add JOIN FETCH rank query returning ResultDTO |
| Modify | `atgt_backend/src/main/java/.../Service/ExamServiceImpl.java` | Fix N+1 in getRank, fix batch save in insertExam |
| Create | `atgt_backend/src/main/java/.../Config/DataInitializer.java` | Seed roles + admin user on first run |
| Modify | `atgt_backend/Dockerfile` | Multi-stage with eclipse-temurin:21, JVM memory flags |
| Create | `docker-compose.yml` (at project root `C:/Claude/atgt/`) | Single backend service with H2 volume |

---

### Task 1: Upgrade pom.xml (Spring Boot 3.3.8, Java 21, H2)

**Files:**
- Modify: `atgt_backend/pom.xml`

- [ ] **Step 1: Update pom.xml**

Replace the entire content of `atgt_backend/pom.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.3.8</version>
		<relativePath/>
	</parent>
	<groupId>com.example.antoangiaothong</groupId>
	<artifactId>atgt</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>atgt</name>
	<description>backend Spring Boot</description>
	<properties>
		<java.version>21</java.version>
	</properties>
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-actuator</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-security</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>com.h2database</groupId>
			<artifactId>h2</artifactId>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.security</groupId>
			<artifactId>spring-security-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
				<configuration>
					<excludes>
						<exclude>
							<groupId>org.projectlombok</groupId>
							<artifactId>lombok</artifactId>
						</exclude>
					</excludes>
				</configuration>
			</plugin>
		</plugins>
	</build>

</project>
```

- [ ] **Step 2: Commit**

```bash
cd C:/Claude/atgt
git add atgt_backend/pom.xml
git commit -m "chore: upgrade Spring Boot 3.3.8, Java 21, swap MSSQL→H2"
```

---

### Task 2: Configure H2 file-mode in application.properties

**Files:**
- Modify: `atgt_backend/src/main/resources/application.properties`

- [ ] **Step 1: Replace application.properties**

```properties
# H2 File Mode - data persists in ./data/atgt.mv.db
spring.datasource.url=jdbc:h2:file:./data/atgt;AUTO_SERVER=TRUE;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA / Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# H2 console disabled in production
spring.h2.console.enabled=false

# Server
server.port=8086
```

- [ ] **Step 2: Commit**

```bash
cd C:/Claude/atgt
git add atgt_backend/src/main/resources/application.properties
git commit -m "chore: configure H2 file-mode datasource"
```

---

### Task 3: Fix Entity — User.java

**Files:**
- Modify: `atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Entity/User.java`

- [ ] **Step 1: Replace User.java**

Remove `columnDefinition = "nvarchar(1000)"`, change EAGER→LAZY on collections, remove `cascade=CascadeType.ALL` from ManyToMany (friends, roles):

```java
package com.example.antoangiaothong.atgt.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collection;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "name", nullable = false, length = 1000)
    private String name;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "enable")
    private boolean enable;

    @Column(name = "has_provider")
    private boolean hasProvider;

    @Column(name = "account")
    private String Account;

    @Column(name = "password")
    private String password;

    @Column(name = "gender")
    private Boolean gender;

    @Column(name = "school")
    private String school;

    @Column(name = "of_class")
    private String ofClass;

    @Column(name = "email")
    private String email;

    @Column(name = "type")
    private Integer type;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Collection<Role> roles;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "friend",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "friend_id"),
            uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "friend_id"}))
    private Collection<User> friends;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "owner", fetch = FetchType.LAZY)
    private Collection<Video> videos;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "owner", fetch = FetchType.LAZY)
    private Collection<Exam> exams;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user", fetch = FetchType.LAZY)
    private Collection<Post> posts;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user", fetch = FetchType.LAZY)
    private Collection<FeedBack> feedBacks;
}
```

- [ ] **Step 2: Commit**

```bash
cd C:/Claude/atgt
git add atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Entity/User.java
git commit -m "fix(entity): User - remove nvarchar, fix lazy loading, remove ManyToMany cascade"
```

---

### Task 4: Fix Entity — Post.java

**Files:**
- Modify: `atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Entity/Post.java`

- [ ] **Step 1: Replace Post.java**

Remove `columnDefinition = "nvarchar(max)"`, change EAGER→LAZY on saveds/reacts, remove `cascade=ALL` from ManyToMany:

```java
package com.example.antoangiaothong.atgt.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.Collection;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "post")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "title", columnDefinition = "TEXT")
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "image", columnDefinition = "TEXT")
    private String image;

    @Column(name = "time")
    private Timestamp time;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "owner_id")
    private User user;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "saved_post",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Collection<User> saveds;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "react_post",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Collection<User> reacts;
}
```

- [ ] **Step 2: Commit**

```bash
cd C:/Claude/atgt
git add atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Entity/Post.java
git commit -m "fix(entity): Post - remove nvarchar, fix lazy loading, remove ManyToMany cascade"
```

---

### Task 5: Fix Entity — Exam.java

**Files:**
- Modify: `atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Entity/Exam.java`

- [ ] **Step 1: Replace Exam.java**

Remove `columnDefinition = "nvarchar(2000)"`, change EAGER→LAZY on results, remove `cascade=ALL` from ManyToMany results:

```java
package com.example.antoangiaothong.atgt.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collection;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "exam")
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name", length = 2000)
    private String name;

    @Column(name = "time")
    private int time;

    @Column(name = "max_times")
    private int maxTimes;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "owner")
    private User owner;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "result",
            joinColumns = @JoinColumn(name = "exam_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Collection<User> results;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "exam", fetch = FetchType.LAZY)
    private Collection<Question> questions;
}
```

- [ ] **Step 2: Commit**

```bash
cd C:/Claude/atgt
git add atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Entity/Exam.java
git commit -m "fix(entity): Exam - remove nvarchar, fix lazy loading, remove ManyToMany cascade"
```

---

### Task 6: Fix remaining Entities (Question, Comment, Image, Video)

**Files:**
- Modify: `atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Entity/Question.java`
- Modify: `atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Entity/Comment.java`
- Modify: `atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Entity/Image.java`
- Modify: `atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Entity/Video.java`

- [ ] **Step 1: Replace Question.java**

```java
package com.example.antoangiaothong.atgt.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "question", columnDefinition = "TEXT")
    private String question;

    @Column(name = "choice_1", columnDefinition = "TEXT")
    private String choice1;

    @Column(name = "choice_2", columnDefinition = "TEXT")
    private String choice2;

    @Column(name = "choice_3", columnDefinition = "TEXT")
    private String choice3;

    @Column(name = "choice_4", columnDefinition = "TEXT")
    private String choice4;

    @Column(name = "answer", columnDefinition = "TEXT")
    private String answer;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "exam")
    private Exam exam;

    @Override
    public String toString() {
        return "Question{" +
                "id=" + id +
                ", question='" + question + '\'' +
                ", choice1='" + choice1 + '\'' +
                ", choice2='" + choice2 + '\'' +
                ", choice3='" + choice3 + '\'' +
                ", choice4='" + choice4 + '\'' +
                ", answer='" + answer + '\'' +
                '}';
    }
}
```

- [ ] **Step 2: Replace Comment.java**

```java
package com.example.antoangiaothong.atgt.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@Table(name = "comment")
@Entity
public class Comment {
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "time")
    private Timestamp time;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "post_id")
    private Post post;
}
```

- [ ] **Step 3: Replace Image.java**

```java
package com.example.antoangiaothong.atgt.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "image")
@NoArgsConstructor
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "url", columnDefinition = "TEXT")
    private String url;

    @JoinColumn(name = "owner")
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private User owner;
}
```

- [ ] **Step 4: Replace Video.java**

```java
package com.example.antoangiaothong.atgt.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "video")
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "title", length = 3000)
    private String title;

    @Column(name = "youtube_id")
    private String youtubeId;

    @Column(name = "time")
    private Timestamp time;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "owner")
    private User owner;
}
```

- [ ] **Step 5: Commit**

```bash
cd C:/Claude/atgt
git add atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Entity/
git commit -m "fix(entity): remove nvarchar columnDefs, use TEXT/length, fix lazy loading"
```

---

### Task 7: Fix SecurityConfig (deprecated API)

**Files:**
- Modify: `atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Security/SecurityConfig.java`

- [ ] **Step 1: Replace SecurityConfig.java**

```java
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

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
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
                .requestMatchers(HttpMethod.GET, "/users/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/posts/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/users/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/users/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/users/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/allpost").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users/signup").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/videos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "api/videos/postImage").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/videos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/videos").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/exams/result").hasRole("USER")
                .requestMatchers(HttpMethod.POST, "/api/exams/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/exams/**").hasRole("USER")
                .requestMatchers(HttpMethod.POST, "/api/posts/**").hasRole("USER")
                .requestMatchers("/posts/**").hasRole("ADMIN")
                .anyRequest().authenticated()
        );
        httpSecurity.httpBasic(Customizer.withDefaults());
        httpSecurity.csrf(csrf -> csrf.disable());
        return httpSecurity.build();
    }
}
```

- [ ] **Step 2: Commit**

```bash
cd C:/Claude/atgt
git add atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Security/SecurityConfig.java
git commit -m "fix(security): replace deprecated httpBasic/csrf API with Spring Boot 3.3 style"
```

---

### Task 8: Add DataInitializer (seed roles + admin user)

**Files:**
- Create: `atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Config/DataInitializer.java`

- [ ] **Step 1: Create DataInitializer.java**

This runs at startup and only inserts data that doesn't already exist (safe to re-run on restart):

```java
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
        if (userRepository.findByUserId("admin") == null) {
            Role adminRole = roleRepository.findByRoleId(1);

            User admin = new User();
            admin.setId("admin");
            admin.setName("Admin");
            admin.setAccount("admin");
            admin.setPassword("admin");
            admin.setEnable(true);
            admin.setHasProvider(false);
            admin.setType(1);

            List<Role> roles = new ArrayList<>();
            roles.add(adminRole);
            admin.setRoles(roles);

            userRepository.save(admin);
        }
    }
}
```

- [ ] **Step 2: Commit**

```bash
cd C:/Claude/atgt
git add atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Config/DataInitializer.java
git commit -m "feat: add DataInitializer to seed ROLE_ADMIN, ROLE_USER, and admin user on startup"
```

---

### Task 9: Fix N+1 query in getRank + batch save in insertExam

**Files:**
- Modify: `atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Repository/ExamRepository.java`
- Modify: `atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Service/ExamServiceImpl.java`

- [ ] **Step 1: Update ExamRepository.java**

Add a new query that returns `ResultDTO` directly via JPQL constructor expression (joins Result + User in one query):

```java
package com.example.antoangiaothong.atgt.Repository;

import com.example.antoangiaothong.atgt.Dto.ResultDTO;
import com.example.antoangiaothong.atgt.Entity.Exam;
import com.example.antoangiaothong.atgt.Entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;

public interface ExamRepository extends JpaRepository<Exam, Integer> {

    @Query("SELECT new com.example.antoangiaothong.atgt.Dto.ResultDTO(r, u.name, u.avatar) " +
           "FROM Result r, User u " +
           "WHERE u.id = r.resultId.userId " +
           "AND r.resultId.examId = :examId " +
           "ORDER BY r.numberCorrect DESC, r.time ASC")
    Collection<ResultDTO> getRankWithUser(@Param("examId") int examId);
}
```

- [ ] **Step 2: Update ExamServiceImpl.java**

Fix `getRank` to use the new single-query method, and fix `insertExam` to batch-save questions:

```java
package com.example.antoangiaothong.atgt.Service;

import com.example.antoangiaothong.atgt.Dto.ResultDTO;
import com.example.antoangiaothong.atgt.Entity.Exam;
import com.example.antoangiaothong.atgt.Entity.Question;
import com.example.antoangiaothong.atgt.Entity.Result;
import com.example.antoangiaothong.atgt.Entity.User;
import com.example.antoangiaothong.atgt.Repository.ExamRepository;
import com.example.antoangiaothong.atgt.Repository.QuestionRepository;
import com.example.antoangiaothong.atgt.Repository.ResultRepository;
import com.example.antoangiaothong.atgt.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;

@Service
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final ResultRepository resultRepository;

    @Autowired
    public ExamServiceImpl(ExamRepository examRepository, UserRepository userRepository,
                           QuestionRepository questionRepository, ResultRepository resultRepository) {
        this.examRepository = examRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.resultRepository = resultRepository;
    }

    @Override
    @Transactional
    public Exam insertExam(Exam exam) {
        User owner = userRepository.findByUserId("admin");
        Exam exam1 = new Exam();
        exam1.setOwner(owner);
        exam1.setName(exam.getName());
        exam1.setMaxTimes(exam.getMaxTimes());
        exam1.setTime(exam.getTime());
        examRepository.save(exam1);

        Collection<Question> listQues = exam.getQuestions();
        Collection<Question> toSave = new ArrayList<>();
        for (Question question : listQues) {
            Question ques = new Question();
            ques.setExam(exam1);
            ques.setQuestion(question.getQuestion());
            ques.setAnswer(question.getAnswer());
            ques.setChoice1(question.getChoice1());
            ques.setChoice2(question.getChoice2());
            ques.setChoice3(question.getChoice3());
            ques.setChoice4(question.getChoice4());
            toSave.add(ques);
        }
        questionRepository.saveAll(toSave);

        return exam;
    }

    @Override
    public Collection<Exam> getListExam() {
        Collection<Exam> listExams = examRepository.findAll();
        Collection<Exam> values = new ArrayList<>();
        for (Exam exam : listExams) {
            Exam e = new Exam();
            e.setId(exam.getId());
            e.setName(exam.getName());
            e.setTime(exam.getTime());
            values.add(e);
        }
        return values;
    }

    @Override
    public Exam getExamById(int id) {
        return examRepository.findById(id).orElse(new Exam());
    }

    @Override
    @Transactional
    public Result postResult(Result result) {
        User user = userRepository.findByUserId(result.getResultId().getUserId());
        Optional<Exam> exam = examRepository.findById(result.getResultId().getExamId());
        if (user == null || exam.isEmpty()) {
            return null;
        }
        Optional<Result> r = resultRepository.findById(result.getResultId());
        if (r.isPresent()) {
            Result oldResult = r.get();
            Result result1 = new Result();
            result1.setResultId(result.getResultId());
            if (oldResult.getNumberCorrect() < result.getNumberCorrect()) {
                result1.setNumberCorrect(result.getNumberCorrect());
                result1.setTime(result.getTime());
            } else if (oldResult.getNumberCorrect() == result.getNumberCorrect()) {
                result1.setNumberCorrect(result.getNumberCorrect());
                result1.setTime(Math.min(oldResult.getTime(), result.getTime()));
            } else {
                result1.setNumberCorrect(oldResult.getNumberCorrect());
                result1.setTime(oldResult.getTime());
            }
            result1.setNumberOfTimes(oldResult.getNumberOfTimes() + 1);
            result1.setTotalQuestion(oldResult.getTotalQuestion());
            resultRepository.save(result1);
            return result1;
        } else {
            Result result1 = new Result();
            result1.setResultId(result.getResultId());
            result1.setNumberCorrect(result.getNumberCorrect());
            result1.setTime(result.getTime());
            result1.setTotalQuestion(result.getTotalQuestion());
            result1.setNumberOfTimes(1);
            resultRepository.save(result1);
            return result1;
        }
    }

    @Override
    public Collection<ResultDTO> getRank(int examId) {
        return examRepository.getRankWithUser(examId);
    }
}
```

- [ ] **Step 3: Commit**

```bash
cd C:/Claude/atgt
git add atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Repository/ExamRepository.java
git add atgt_backend/src/main/java/com/example/antoangiaothong/atgt/Service/ExamServiceImpl.java
git commit -m "perf: fix N+1 in getRank with JOIN query, batch save questions in insertExam"
```

---

### Task 10: Optimize Dockerfile

**Files:**
- Modify: `atgt_backend/Dockerfile`

- [ ] **Step 1: Replace Dockerfile**

Multi-stage build: Maven 3.9 + Java 21 for build, JRE-only alpine for runtime. JVM flags cap memory to 256MB (fits Cloud Run free tier):

```dockerfile
# ---- Build Stage ----
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
# Cache dependencies first (layer caching optimization)
COPY pom.xml .
RUN mvn dependency:go-offline -q
# Build app
COPY src ./src
RUN mvn clean package -DskipTests -q

# ---- Runtime Stage ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create data directory for H2 file persistence
RUN mkdir -p /app/data

COPY --from=build /app/target/*.jar /app/app.jar

EXPOSE 8086

ENTRYPOINT ["java", \
  "-XX:+UseSerialGC", \
  "-Xmx256m", \
  "-Xms64m", \
  "-XX:MaxMetaspaceSize=128m", \
  "-jar", "app.jar"]
```

- [ ] **Step 2: Commit**

```bash
cd C:/Claude/atgt
git add atgt_backend/Dockerfile
git commit -m "chore(docker): multi-stage build with JRE-alpine, JVM memory flags for Cloud Run free tier"
```

---

### Task 11: Add docker-compose.yml at project root

**Files:**
- Create: `docker-compose.yml` at `C:/Claude/atgt/docker-compose.yml`

- [ ] **Step 1: Create docker-compose.yml**

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./atgt_backend
      dockerfile: Dockerfile
    container_name: atgt-backend
    ports:
      - "8086:8086"
    volumes:
      - h2-data:/app/data
    environment:
      - SPRING_DATASOURCE_URL=jdbc:h2:file:/app/data/atgt;AUTO_SERVER=TRUE;DB_CLOSE_ON_EXIT=FALSE
      - SPRING_DATASOURCE_USERNAME=sa
      - SPRING_DATASOURCE_PASSWORD=
      - SPRING_JPA_HIBERNATE_DDL_AUTO=update
      - SPRING_H2_CONSOLE_ENABLED=false
      - SERVER_PORT=8086
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:8086/actuator/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  h2-data:
    driver: local
```

- [ ] **Step 2: Commit**

```bash
cd C:/Claude/atgt
git add docker-compose.yml
git commit -m "chore: add docker-compose.yml with H2 volume for local/cloud deployment"
```

---

### Task 12: Verify build locally

- [ ] **Step 1: Build the Docker image**

```bash
cd C:/Claude/atgt/atgt_backend
docker build -t atgt-backend:test .
```

Expected output: `Successfully built ...` (no errors). Build takes ~2-3 minutes first time.

- [ ] **Step 2: Run with docker-compose**

```bash
cd C:/Claude/atgt
docker-compose up --build
```

Expected: App starts, logs show:
- `HikariPool-1 - Starting...`
- `DataInitializer` seeds roles and admin
- `Tomcat started on port 8086`
- `Started AtgtApplication`

- [ ] **Step 3: Smoke test key endpoints**

```bash
# Should return 200 with list of posts (empty initially)
curl http://localhost:8086/api/users/allpost

# Should return 200 with empty list
curl http://localhost:8086/api/videos/getAllVideo

# Should return 200 with list of exams (empty initially)
curl -u admin:admin http://localhost:8086/api/exams/getListExams
```

- [ ] **Step 4: Final commit**

```bash
cd C:/Claude/atgt
git add -A
git commit -m "chore: final cleanup after H2 migration and Spring Boot 3.3 upgrade"
```
