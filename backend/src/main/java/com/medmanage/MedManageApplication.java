package com.medmanage;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import java.io.File;

@SpringBootApplication
@EnableScheduling
public class MedManageApplication {
    public static void main(String[] args) {
        // 尝试从多个位置加载环境变量
        Dotenv dotenv = null;
        
        // 1. 尝试从项目根目录加载
        File envFile1 = new File("../.env");
        if (envFile1.exists()) {
            dotenv = Dotenv.configure().directory("../").load();
        }
        
        // 2. 尝试从当前目录加载
        if (dotenv == null) {
            File envFile2 = new File(".env");
            if (envFile2.exists()) {
                dotenv = Dotenv.configure().load();
            }
        }
        
        // 3. 尝试从classpath加载
        if (dotenv == null) {
            dotenv = Dotenv.configure().ignoreIfMissing().load();
        }
        
        // 将Dotenv加载的环境变量设置到系统环境变量中
        if (dotenv != null) {
            dotenv.entries().forEach(entry -> {
                System.setProperty(entry.getKey(), entry.getValue());
            });
        }
        
        SpringApplication.run(MedManageApplication.class, args);
    }
}
