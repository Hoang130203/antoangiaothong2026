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
