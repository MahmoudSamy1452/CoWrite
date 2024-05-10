FROM eclipse-temurin:21
LABEL authors="alykh"
VOLUME /tmp
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]