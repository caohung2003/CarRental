# Use a base image with Java and Maven pre-installed
FROM maven:3.8.4-openjdk-17 AS builder

# Set working directory
WORKDIR /opt/source/car-rental-api

# Copy the project's pom.xml file
COPY pom.xml .

# Resolve dependencies (download dependencies defined in pom.xml)
RUN mvn dependency:go-offline

# Copy the entire project's source code
COPY src ./src

# Build the application
RUN mvn package -DskipTests

# Use a base image with only JRE for the final image
FROM eclipse-temurin:21-jre

# Set the working directory
WORKDIR  /opt/source/car-rental-api

# Copy the built JAR file from the builder stage
COPY --from=builder /opt/source/car-rental-api/target/*.jar /opt/source/car-rental-api/app.jar

# Expose the port that the Spring Boot application will run on
EXPOSE 8080

# Command to run the Spring Boot application when the container starts
CMD ["java", "-jar", "app.jar"]