package com.medmanage.entity;

public enum Role {
    USER("普通用户"),
    ADMIN("管理员"),
    SUPER_ADMIN("超级管理员");

    private final String description;

    Role(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public int getValue() {
        return this.ordinal();
    }

    public static Role fromValue(int value) {
        Role[] roles = Role.values();
        if (value >= 0 && value < roles.length) {
            return roles[value];
        }
        return USER;
    }
}
