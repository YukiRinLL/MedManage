package com.medmanage.config;

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Configuration
public class JacksonConfig {
    
    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jackson2ObjectMapperBuilderCustomizer() {
        return builder -> {
            // Create a custom deserializer that can handle both date-only and date-time formats
            LocalDateTimeDeserializer customDeserializer = new LocalDateTimeDeserializer(DateTimeFormatter.ISO_DATE_TIME) {
                @Override
                public LocalDateTime deserialize(com.fasterxml.jackson.core.JsonParser p, com.fasterxml.jackson.databind.DeserializationContext ctxt) throws java.io.IOException {
                    String value = p.getValueAsString();
                    try {
                        // Try parsing as ISO_DATE_TIME first
                        return super.deserialize(p, ctxt);
                    } catch (DateTimeParseException e) {
                        try {
                            // If that fails, try parsing as date-only format
                            return LocalDateTime.parse(value + "T00:00:00", DateTimeFormatter.ISO_DATE_TIME);
                        } catch (DateTimeParseException ex) {
                            throw new java.io.IOException("Failed to parse date: " + value, ex);
                        }
                    }
                }
            };
            
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            
            JavaTimeModule javaTimeModule = new JavaTimeModule();
            javaTimeModule.addDeserializer(LocalDateTime.class, customDeserializer);
            javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(formatter));
            
            builder.modules(javaTimeModule);
        };
    }
}
