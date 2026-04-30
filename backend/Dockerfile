# =============================================================
# Stage 1 - Build do Spring Boot com Maven
# =============================================================
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copia o pom.xml primeiro para aproveitar o cache do Docker nas dependências
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copia o código-fonte e compila o jar executável
COPY src ./src
RUN mvn clean package -DskipTests -q

# =============================================================
# Stage 2 - Runtime com JRE leve
# =============================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copia o jar gerado pelo Maven
COPY --from=builder /app/target/*.jar app.jar

# Porta do Spring Boot
EXPOSE 5000

# Executa o Spring Boot como processo principal
CMD ["java", "-jar", "/app/app.jar"]