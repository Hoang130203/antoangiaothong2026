# Backend Refactor: H2 + Spring Boot 3.3 + Cloud Run Optimization

**Date:** 2026-03-30
**Status:** Approved

## Summary

Refactor ATGT Spring Boot backend to:
- Replace MSSQL with H2 file-mode (eliminate external DB cost)
- Upgrade Spring Boot 3.2.3 → 3.3.8, Java 17 → 21
- Fix N+1 queries and EAGER loading issues
- Optimize Dockerfile for Google Cloud Run free tier
- Add docker-compose.yml for local dev

## 1. Dependencies (pom.xml)

| Change | From | To |
|--------|------|----|
| Spring Boot | 3.2.3 | 3.3.8 |
| Java | 17 | 21 |
| DB Driver | `mssql-jdbc` | `h2` |
| Remove | `spring-boot-starter-data-rest` | (unused, adds overhead) |

## 2. application.properties

- H2 file mode: `jdbc:h2:file:./data/atgt;AUTO_SERVER=TRUE`
- H2Dialect, ddl-auto=update
- H2 console disabled in prod
- server.port=8086

## 3. Entity Fixes

- Remove all `columnDefinition = "nvarchar(...)"` (SQL Server specific)
- Change `FetchType.EAGER` → `LAZY` on collections: User.roles, User.friends, Post.saveds, Post.reacts, Exam.results, Exam.questions, Question.exam
- Remove dangerous `cascade=ALL` from ManyToMany relationships (User.friends, Post.saveds, Post.reacts, Exam.results)

## 4. Data Initialization

Add `DataInitializer` (ApplicationRunner) to seed on first run:
- Role: id=1 `ROLE_ADMIN`, id=2 `ROLE_USER`
- User: id=`admin`, account=`admin`, password=`admin`, name=`Admin`, role=ADMIN, enable=true, type=1

## 5. Security Config

Fix deprecated API (Spring Boot 3.2+):
- `httpBasic()` → `httpBasic(Customizer.withDefaults())`
- `csrf().disable()` → `csrf(csrf -> csrf.disable())`
- Keep `NoOpPasswordEncoder` (frontend compatibility)

## 6. Query Optimizations

### N+1 Fix: getRank()
Current: loop fetches each user individually.
Fix: add JPQL with JOIN FETCH to return user name+avatar in one query via a new DTO projection.

### Batch save: insertExam()
Current: saves each Question individually in a loop.
Fix: collect questions list then call `questionRepository.saveAll(questions)`.

### ResultRepository
Add `@Query` with JOIN FETCH to get result + user in one shot for rank.

## 7. Dockerfile

```
Build:   maven:3.9-eclipse-temurin-21-alpine
Runtime: eclipse-temurin:21-jre-alpine
JVM:     -XX:+UseSerialGC -Xmx256m -Xms64m
Port:    8086
```

Multi-stage build. Skip tests during Docker build (`-DskipTests`).

## 8. docker-compose.yml (at project root)

Single service `backend`, port 8086:8086, volume mount for H2 data persistence.

## Out of Scope

- BCrypt / JWT auth (frontend would need changes)
- Frontend changes
- CI/CD pipeline
