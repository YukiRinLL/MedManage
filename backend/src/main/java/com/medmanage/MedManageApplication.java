package com.medmanage;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MedManageApplication {
    public static void main(String[] args) {
        // 加载环境变量
        Dotenv dotenv = Dotenv.load();
        SpringApplication.run(MedManageApplication.class, args);
    }
}
