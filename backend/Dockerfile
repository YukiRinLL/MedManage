# 第一阶段：构建阶段
FROM maven:3.8.8-eclipse-temurin-8 AS build

# 设置工作目录
WORKDIR /app

# 先复制 pom.xml 并下载依赖（利用 Docker 缓存）
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 复制源代码
COPY src ./src

# 构建项目（使用 -B 批处理模式，-U 强制更新依赖）
RUN mvn clean package -DskipTests -B -U

# 第二阶段：运行阶段
FROM eclipse-temurin:8-jre-alpine

# 设置工作目录
WORKDIR /app

# 从构建阶段复制打包好的jar文件
COPY --from=build /app/target/backend-1.0-SNAPSHOT.jar app.jar

# 暴露应用端口
EXPOSE 8080

# 设置环境变量
ENV SPRING_PROFILES_ACTIVE=prod

# 运行应用
ENTRYPOINT ["java", "-jar", "app.jar"]