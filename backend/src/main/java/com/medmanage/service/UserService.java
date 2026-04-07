package com.medmanage.service;

import com.medmanage.entity.User;
import com.medmanage.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.DigestUtils;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserTagService userTagService;
    
    @Transactional
    public User register(User user) {
        if (userRepository.existsByPhone(user.getPhone())) {
            throw new RuntimeException("手机号已注册");
        }
        if (user.getIdCard() != null && !user.getIdCard().isEmpty() && userRepository.existsByIdCard(user.getIdCard())) {
            throw new RuntimeException("身份证号已注册");
        }
        if (user.getTxNumber() != null && !user.getTxNumber().isEmpty() && userRepository.existsByTxNumber(user.getTxNumber())) {
            throw new RuntimeException("透析号已注册");
        }
        
        // 从身份证号提取生日和性别
        if (user.getIdCard() != null && user.getIdCard().length() == 18) {
            try {
                // 提取生日
                String year = user.getIdCard().substring(6, 10);
                String month = user.getIdCard().substring(10, 12);
                String day = user.getIdCard().substring(12, 14);
                String birthDateStr = year + "-" + month + "-" + day + "T00:00:00";
                user.setBirthDate(java.time.LocalDateTime.parse(birthDateStr));
                
                // 提取性别：第17位，奇数为男(1)，偶数为女(0)
                char genderChar = user.getIdCard().charAt(16);
                int gender = Integer.parseInt(String.valueOf(genderChar)) % 2;
                user.setGender(gender);
            } catch (Exception e) {
                throw new RuntimeException("身份证号格式错误");
            }
        }
        
        user.setPassword(DigestUtils.md5DigestAsHex(user.getPassword().getBytes()));
        // 初始化入院日期为注册时间
        if (user.getAdmissionDate() == null) {
            user.setAdmissionDate(java.time.LocalDateTime.now());
        }
        // 初始化患者类型为普通患者
        if (user.getPatientType() == null) {
            user.setPatientType(0);
        }
        // 不设置年龄，年龄通过生日动态计算
        user.setAge(null);
        return userRepository.save(user);
    }
    
    public User login(String phone, String password) {
        User user = userRepository.findByPhone(phone);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        if (!user.getPassword().equals(DigestUtils.md5DigestAsHex(password.getBytes()))) {
            throw new RuntimeException("密码错误");
        }
        return user;
    }
    
    public User findByPhone(String phone) {
        return userRepository.findByPhone(phone);
    }
    
    @Transactional
    public User update(User user) {
        // 先从数据库中获取完整的用户对象
        User existingUser = userRepository.findById(user.getId()).orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 只更新前端发送的字段
        if (user.getGender() != null) {
            existingUser.setGender(user.getGender());
        }
        // 不更新年龄，年龄通过生日动态计算
        // if (user.getAge() != null) {
        //     existingUser.setAge(user.getAge());
        // }
        if (user.getEmergencyContact() != null) {
            existingUser.setEmergencyContact(user.getEmergencyContact());
        }
        if (user.getEmergencyPhone() != null) {
            existingUser.setEmergencyPhone(user.getEmergencyPhone());
        }
        if (user.getAddress() != null) {
            existingUser.setAddress(user.getAddress());
        }
        if (user.getTxNumber() != null) {
            existingUser.setTxNumber(user.getTxNumber());
        }
        if (user.getNation() != null) {
            existingUser.setNation(user.getNation());
        }
        if (user.getBirthDate() != null) {
            existingUser.setBirthDate(user.getBirthDate());
        }
        if (user.getPostalCode() != null) {
            existingUser.setPostalCode(user.getPostalCode());
        }
        if (user.getEmail() != null) {
            existingUser.setEmail(user.getEmail());
        }
        if (user.getInsuranceType() != null) {
            existingUser.setInsuranceType(user.getInsuranceType());
        }
        if (user.getMedicalCertType() != null) {
            existingUser.setMedicalCertType(user.getMedicalCertType());
        }
        if (user.getElectronicMedicalId() != null) {
            existingUser.setElectronicMedicalId(user.getElectronicMedicalId());
        }
        if (user.getDiagnosis() != null) {
            existingUser.setDiagnosis(user.getDiagnosis());
        }
        if (user.getHospitalizationStatus() != null) {
            existingUser.setHospitalizationStatus(user.getHospitalizationStatus());
        }
        if (user.getAdmissionDate() != null) {
            existingUser.setAdmissionDate(user.getAdmissionDate());
        }
        if (user.getDischargeDate() != null) {
            existingUser.setDischargeDate(user.getDischargeDate());
        }
        if (user.getPatientType() != null) {
            existingUser.setPatientType(user.getPatientType());
        }
        
        return userRepository.save(existingUser);
    }
    
    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }
    
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public java.util.Map<String, Object> listUsers(int page, int size, String name, String phone, Integer gender, Integer minAge, Integer maxAge, String tagName) {
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        // 确保page不小于1
        int safePage = Math.max(1, page);
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(safePage - 1, size, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
        
        org.springframework.data.domain.Page<User> userPage;
        
        // 构建查询条件
        org.springframework.data.jpa.domain.Specification<User> spec = (root, query, criteriaBuilder) -> {
            java.util.List<javax.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
            
            // 名字模糊查询
            if (name != null && !name.isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("name"), "%" + name + "%"));
            }
            
            // 手机号模糊查询
            if (phone != null && !phone.isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("phone"), "%" + phone + "%"));
            }
            
            // 性别条件筛选
            if (gender != null) {
                predicates.add(criteriaBuilder.equal(root.get("gender"), gender));
            }
            
            // 年龄范围筛选（使用出生日期计算）
            if (minAge != null) {
                java.time.LocalDate maxBirthDate = java.time.LocalDate.now().minusYears(minAge);
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("birthDate"), maxBirthDate.atStartOfDay()));
            }
            if (maxAge != null) {
                java.time.LocalDate minBirthDate = java.time.LocalDate.now().minusYears(maxAge + 1).plusDays(1);
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("birthDate"), minBirthDate.atStartOfDay()));
            }
            
            return criteriaBuilder.and(predicates.toArray(new javax.persistence.criteria.Predicate[0]));
        };
        
        if (tagName != null && !tagName.isEmpty()) {
            // 先获取有该标签的用户ID列表
            java.util.List<String> userIds = userTagService.getUsersByTagName(tagName);
            if (userIds.isEmpty()) {
                result.put("list", java.util.Collections.emptyList());
                result.put("total", 0);
                return result;
            }
            // 构建包含标签的查询条件
            org.springframework.data.jpa.domain.Specification<User> tagSpec = (root, query, criteriaBuilder) -> {
                return criteriaBuilder.and(
                    spec.toPredicate(root, query, criteriaBuilder),
                    root.get("id").in(userIds)
                );
            };
            // 根据标签和其他条件查询用户
            userPage = userRepository.findAll(tagSpec, pageable);
        } else {
            // 根据其他条件查询用户
            userPage = userRepository.findAll(spec, pageable);
        }
        
        result.put("list", userPage.getContent());
        result.put("total", userPage.getTotalElements());
        return result;
    }
    
    @Transactional
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }
}
