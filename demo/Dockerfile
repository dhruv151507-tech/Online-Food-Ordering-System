FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy everything
COPY . .

# Install Maven and build jar
RUN apt-get update && apt-get install -y maven
RUN mvn clean package -DskipTests

# Run app
CMD ["java", "-jar", "target/demo-0.0.1-SNAPSHOT.jar"]