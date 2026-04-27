# Hospital Patient Management System

## Project Overview

This is a dual-end system for hospital patient management, primarily used for patient information collection and notification push. The system adopts a front-end and back-end separated architecture, with the back-end implemented using Spring Boot+MySQL+Redis, and the front-end divided into two independent projects:

1. **Patient End (UniApp)**: For ordinary users (patients), supporting Android/iOS/Web platforms
2. **Management End (Vue3 + Element Plus)**: For administrators (doctors/hospital management staff) and super administrators (IT operations), supporting PC browser access

## Brand and Color Scheme

### Company Name
**Chongqing ShengTong ShangNuo Medical Management™**

### Design Style
The overall design adopts a clean white style, in line with the professional and serious image of the medical industry. White and light gray are used as the main background colors, with the theme color as an accent.

### Color Standard

| Color Name | Value | Usage Description |
|-----------|-------|-------------------|
| Primary Color | `#009D85` | Main buttons, TabBar selected state, accent elements |
| Secondary Color | `#ABCD07` | Secondary icons, labels, minor accents |
| Primary Dark | `#007D6B` | Button click state |
| Background Color | `#F5F7FA` | Page background |
| Card Background | `#FFFFFF` | Card, input box background |
| Primary Text | `#303133` | Titles, important content |
| Secondary Text | `#606266` | Main content |
| Auxiliary Text | `#909399` | Prompt text, secondary information |
| Border Color | `#EBEEF5` / `#DCDFE6` | Dividers, borders |

### Application Principles

- **Background Priority**：Unified use of `#F5F7FA` for page background to create a clean and fresh visual effect
- **Card Emphasis**：Use white background `#FFFFFF` for content cards, with slight shadows to create a sense of hierarchy
- **Theme Accent**：Use the primary color `#009D85` as an accent for buttons, TabBar selection, and important operations
- **Avoid Gradients**：Do not use large areas of gradient colors, maintain an overall clean and professional style

## Technology Stack

### Backend
- Spring Boot 2.7.15
- MySQL 8.0+
- Redis 6.0+
- Maven 3.6+
- Log4j2

### Patient End (UniApp)
- Vue 3.3+
- UniApp
- Vite 4.4+
- TypeScript 5.0+

### Management End (Vue3 + Element Plus)
- Vue 3.3+
- Element Plus 2.3+
- Vue Router 4.2+
- Pinia 2.1+
- Axios 1.5+
- Vite 4.4+

## Project Structure

```
MedManage/
├── backend/                             # Backend project
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── medmanage/
│   │   │   │           ├── config/         # Configuration classes
│   │   │   │           ├── controller/      # Controllers
│   │   │   │           ├── entity/          # Entity classes
│   │   │   │           ├── interceptor/     # Interceptors
│   │   │   │           ├── repository/      # Data access layer
│   │   │   │           ├── service/         # Service layer
│   │   │   │           ├── util/            # Utility classes
│   │   │   │           └── MedManageApplication.java  # Application main class
│   │   │   └── resources/
│   │   │       ├── db/                      # Database scripts
│   │   │       │   ├── schema.sql          # Database table structure
│   │   │       │   └── init_super_admin.sql # Super administrator initialization
│   │   │       ├── application.yml          # Application configuration
│   │   │       └── log4j2.xml               # Log configuration
│   │   └── test/
│   │       └── java/
│   └── pom.xml                              # Maven configuration
│
├── frontend/                             # Patient end project (UniApp)
│   ├── pages/                             # Pages
│   │   ├── login/                          # Login page
│   │   ├── register/                       # Registration page
│   │   ├── home/                           # Home page
│   │   ├── health-record/                  # Health records
│   │   ├── vital-sign/                     # Vital signs
│   │   ├── medication/                     # Medication records
│   │   ├── notification/                   # Notification center
│   │   └── profile/                        # Personal center
│   ├── utils/                             # Utility classes
│   │   └── request.js                     # Request encapsulation
│   ├── static/                            # Static resources
│   │   └── tabbar/                        # Bottom navigation icons
│   ├── App.vue                            # Root component
│   ├── main.js                            # Entry file
│   ├── manifest.json                      # Application configuration
│   ├── pages.json                         # Page configuration
│   ├── vite.config.js                     # Vite configuration
│   └── package.json                       # Dependency configuration
│
├── admin-web/                            # Management end project (Vue3 + Element Plus)
│   ├── src/
│   │   ├── router/                        # Router configuration
│   │   │   └── index.js                  # Router definition
│   │   ├── store/                         # State management
│   │   │   └── user.js                    # User state
│   │   ├── utils/                         # Utility classes
│   │   │   └── request.js                # Request encapsulation
│   │   ├── views/                         # Pages
│   │   │   ├── Login.vue                  # Login page
│   │   │   ├── Layout.vue                 # Layout page
│   │   │   ├── dashboard/                 # Dashboard
│   │   │   │   └── Index.vue
│   │   │   ├── users/                     # User management
│   │   │   │   ├── Index.vue
│   │   │   │   └── Detail.vue
│   │   │   ├── health/                    # Health records
│   │   │   │   ├── Index.vue
│   │   │   │   └── Detail.vue
│   │   │   ├── medication/                # Medication records
│   │   │   │   └── Index.vue
│   │   │   └── notification/              # Notification management
│   │   │       └── Index.vue
│   │   ├── App.vue                        # Root component
│   │   └── main.js                        # Entry file
│   ├── index.html                        # HTML template
│   ├── vite.config.js                     # Vite configuration
│   └── package.json                      # Dependency configuration
│
├── 功能清单.md                           # Functional requirements document
├── README.md                             # Project description document (English)
└── README-ZH.md                          # Project description document (Chinese)
```

## System Architecture

### Dual-End Design Description

The system adopts a dual-end separated design, providing different access methods for different user roles:

#### 1. Patient End (UniApp)
- **Target Users**: Ordinary users (patients)
- **Usage Scenarios**: View health data anytime, anywhere, record vital signs, view medication reminders
- **Supported Platforms**: Android, iOS, Web
- **Main Features**:
  - User registration and login
  - Health record management
  - Vital sign recording
  - Medication record management
  - Notification center
  - Personal center

#### 2. Management End (Vue3 + Element Plus)
- **Target Users**: Administrators (doctors/hospital management staff), super administrators (IT operations)
- **Usage Scenarios**: Hospital office computers for data management and system maintenance
- **Supported Platforms**: PC browsers
- **Main Features**:
  - Administrator login
  - Data dashboard
  - User management (view, create, modify roles, delete)
  - Health record management
  - Medication record management
  - Notification management

### Role Permissions

| Role | Patient End | Management End | Main Responsibilities |
|------|-------------|----------------|-----------------------|
| Ordinary User | ✓ | ✗ | View and manage personal health data |
| Administrator | ✗ | ✓ | View user data, health records, medication records |
| Super Administrator | ✗ | ✓ | User management, role assignment, system maintenance |

## Database Design

### Database Information
- **Database Name**: yukirinllmedmanage
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_unicode_ci

### 1. users Table (User Table)
- id: Primary key, auto-increment
- phone: Phone number, unique
- password: Password (MD5 encrypted)
- name: Name
- gender: Gender (0: female, 1: male)
- age: Age
- id_card: ID card number
- emergency_contact: Emergency contact
- emergency_phone: Emergency contact phone
- created_at: Creation time
- updated_at: Update time

### 2. admins Table (Administrator Table)
- id: Primary key, auto-increment
- phone: Phone number, unique
- password: Password (MD5 encrypted)
- name: Name
- role: Role (1: administrator, 2: super administrator)
- created_at: Creation time
- updated_at: Update time

### 3. health_records Table (Health Records Table)
- id: Primary key, auto-increment
- user_id: User ID, foreign key
- past_medical_history: Past medical history
- allergic_history: Allergic history
- family_medical_history: Family medical history
- blood_type: Blood type
- other_info: Other information
- created_at: Creation time
- updated_at: Update time

### 4. vital_signs Table (Vital Signs Table)
- id: Primary key, auto-increment
- user_id: User ID, foreign key
- temperature: Temperature
- systolic_pressure: Systolic pressure
- diastolic_pressure: Diastolic pressure
- blood_sugar: Blood sugar
- heart_rate: Heart rate
- notes: Notes
- record_time: Record time
- created_at: Creation time

### 5. medication_records Table (Medication Records Table)
- id: Primary key, auto-increment
- user_id: User ID, foreign key
- medication_name: Medication name
- dosage: Dosage
- frequency: Frequency
- taken: Whether taken
- notes: Notes
- medication_time: Medication time
- created_at: Creation time

### 6. notifications Table (Notification Table)
- id: Primary key, auto-increment
- user_id: User ID, foreign key
- type: Type (1: medical visit reminder, 2: medication reminder, 3: examination notification, 4: follow-up reminder, 5: re-examination reminder)
- title: Title
- content: Content
- read: Whether read
- notify_time: Notification time
- created_at: Creation time

## Deployment Steps

### Backend Deployment
1. **Environment Preparation**
   - Install JDK 1.8+
   - Install MySQL 8.0+
   - Install Redis 6.0+
   - Install Maven 3.6+

2. **Database Configuration**
   - Create database: `CREATE DATABASE yukirinllmedmanage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
   - Execute table structure script: `source backend/src/main/resources/db/schema.sql;`
   - Execute super administrator initialization script: `source backend/src/main/resources/db/init_super_admin.sql;`
   - Configure database connection information, modify database connection parameters in `backend/src/main/resources/application.yml`

3. **Redis Configuration**
   - Start Redis service
   - Configure Redis connection information, modify Redis connection parameters in `backend/src/main/resources/application.yml`

4. **Project Build**
   - Enter backend directory
   - Execute `mvn clean package`

5. **Project Start**
   - Development mode: `mvn spring-boot:run`
   - Production mode: `java -jar target/backend-1.0-SNAPSHOT.jar`

### Patient End Deployment (UniApp)
1. **Environment Preparation**
   - Install Node.js 16.0+
   - Install HBuilderX (UniApp development tool)

2. **Project Configuration**
   - Modify API base address in `frontend/utils/request.js` to ensure it matches the backend service address

3. **Install Dependencies**
   - Enter frontend directory
   - Execute `npm install`

4. **Development Mode Start**
   - Execute `npm run dev`
   - Visit http://localhost:5173/

5. **Application Build**
   - Open frontend directory with HBuilderX
   - Select release platform (Android/iOS/Web)
   - Execute build operation

6. **Application Installation**
   - Android: Install the generated APK file
   - iOS: Package and install through Xcode
   - Web: Deploy to web server

### Management End Deployment (Vue3 + Element Plus)
1. **Environment Preparation**
   - Install Node.js 16.0+

2. **Project Configuration**
   - Modify API base address in `admin-web/src/utils/request.js` to ensure it matches the backend service address

3. **Install Dependencies**
   - Enter admin-web directory
   - Execute `npm install`

4. **Development Mode Start**
   - Execute `npm run dev`
   - Visit http://localhost:3000

5. **Production Build**
   - Execute `npm run build`
   - Deploy the dist directory to a web server (e.g., Nginx)

## Core Features

### Patient End Features (UniApp)

#### 1. User Authentication
- Mobile phone registration
- Mobile phone + password login
- Login state management (Redis)

#### 2. Health Records
- Past medical history management
- Allergic history management
- Family medical history management
- Blood type management
- Other health information management

#### 3. Vital Signs
- Temperature recording
- Blood pressure recording
- Blood sugar recording
- Heart rate recording
- Historical data viewing

#### 4. Medication Records
- Medication information recording
- Dosage management
- Medication time management
- Medication status tracking
- Historical record viewing

#### 5. Notification Center
- Medical visit reminders
- Medication reminders
- Examination notifications
- Follow-up reminders
- Re-examination reminders
- Notification status management

#### 6. Personal Center
- Personal information management
- Emergency contact management
- Logout

### Management End Features (Vue3 + Element Plus)

#### 1. Administrator Authentication
- Administrator login (only administrators and super administrators)
- Login state management
- Permission verification

#### 2. Data Dashboard
- System data statistics
- User quantity statistics
- Health record statistics
- Medication record statistics
- Recent activity records

#### 3. User Management
- User list viewing
- User search and filtering
- User detail viewing
- Create user (super administrator)
- Modify user role (super administrator)
- Delete user (super administrator)

#### 4. Health Record Management
- Health record list
- Record search and filtering
- Record detail viewing

#### 5. Medication Record Management
- Medication record list
- Record search and filtering
- Medication status update

#### 6. Notification Management
- Notification list viewing
- Create notification
- Notification detail viewing
- Delete notification

## API Interfaces

### User Related
- POST /api/user/register - User registration
- POST /api/user/login - User login
- POST /api/user/logout - User logout
- GET /api/user/info - Get user information
- PUT /api/user/update - Update user information

### Administrator Related
- POST /api/admin/login - Administrator login
- GET /api/admin/dashboard - Get dashboard data
- GET /api/admin/admins - Get administrator list
- POST /api/admin/create-admin - Create administrator (super administrator)
- PUT /api/admin/update-admin/{adminId} - Update administrator information (super administrator)
- DELETE /api/admin/admins/{adminId} - Delete administrator (super administrator)

### Health Record Related
- GET /api/health-record/info - Get health record
- POST /api/health-record/save - Save health record

### Vital Sign Related
- POST /api/vital-sign/save - Save vital sign
- GET /api/vital-sign/list - Get vital sign list

### Medication Record Related
- POST /api/medication/save - Save medication record
- GET /api/medication/list - Get medication record list
- PUT /api/medication/update-taken/{id} - Update medication status

### Notification Related
- GET /api/notification/list - Get notification list
- GET /api/notification/unread - Get unread notifications
- PUT /api/notification/mark-read/{id} - Mark notification as read
- PUT /api/notification/mark-all-read - Mark all notifications as read

## Default Accounts

### Super Administrator
- Phone: 18888888888
- Password: admin123
- Permissions: Complete system management permissions

### Ordinary User
- Need to be created through registration function
- Default role: Ordinary user

## Notes

1. **Database Configuration**: Ensure MySQL and Redis services are running normally, and connection information is correct
2. **API Address Configuration**: Ensure the API address configured in the front-end matches the back-end service address
3. **Permission Management**: The system uses JWT for identity authentication, ensure the request header contains the correct Authorization token
4. **Data Security**: Passwords are stored using MD5 encryption, and sensitive information transmission uses HTTPS
5. **Push Function**: The notification push function requires backend scheduled task support, which can be extended according to actual needs
6. **Role Management**:
   - A super administrator account (18888888888/admin) is pre-configured in the initial system state
   - Ordinary users are assigned the default role of ordinary user when registering
   - Only super administrators can create administrators and assign roles
   - Only super administrators can modify administrator roles and delete administrators
   - Both administrators and super administrators can access the management backend

## Development Guide

### Backend Development
1. Use Maven for dependency management
2. Use Spring Boot for rapid development
3. Use JPA for database operations
4. Use Log4j2 for logging
5. Use Redis for caching and session management

### Patient End Development (UniApp)
1. Use Vue 3 for component development
2. Use UniApp for cross-platform development
3. Use Vite for building and hot update
4. Follow UniApp development specifications

### Management End Development (Vue3 + Element Plus)
1. Use Vue 3 for component development
2. Use Element Plus UI component library
3. Use Vue Router for route management
4. Use Pinia for state management
5. Use Vite for building and hot update

## Future Expansion

1. Integrate third-party medical devices to realize automatic collection of vital signs
2. Add online consultation function to support real-time communication between patients and doctors
3. Expand notification push methods to support SMS, email and other multi-channel notifications
4. Add data analysis function to provide health trend analysis
5. Integrate hospital HIS system to realize data intercommunication
6. Add data visualization charts to provide more intuitive data display
7. Implement multi-language support for convenient international deployment

## License

This project adopts the MIT license, see the LICENSE file for details.

---

[中文文档 (Chinese Documentation)](README-ZH.md)