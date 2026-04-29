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
# Stage 2 - Runtime com JRE leve + Python (para o saude_mais.py)
# =============================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Instala Python 3 e pip para rodar o microserviço FastAPI
RUN apk add --no-cache python3 py3-pip && \
    pip3 install --no-cache-dir --break-system-packages \
        fastapi \
        uvicorn[standard] \
        requests

# Copia o jar gerado pelo Maven
COPY --from=builder /app/target/*.jar app.jar

# Copia o script Python da IA para pasta dedicada
# (o PdfController chama http://localhost:8000/chat - ambos rodam no mesmo container)
COPY src/main/resources/ia-integration/saude_mais.py /app/ia/saude_mais.py

# Porta do Spring Boot
EXPOSE 5000
# Porta do FastAPI
EXPOSE 8000

# Inicia o FastAPI em background e depois o Spring Boot em foreground
# Ambos no mesmo container pois o backend chama localhost:8000
CMD ["sh", "-c", "cd /app/ia && python3 -m uvicorn saude_mais:app --host 0.0.0.0 --port 8000 & java -jar /app/app.jar"]