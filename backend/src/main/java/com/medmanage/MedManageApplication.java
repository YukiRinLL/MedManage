package com.medmanage;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MedManageApplication {
    public static void main(String[] args) {
        SpringApplication.run(MedManageApplication.class, args);
    }
}
