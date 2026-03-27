-- ============================================
-- SCRIPT DE CRÉATION DE LA BASE DE DONNÉES MYSQL
-- Projet: Bawi Studio
-- Base de données: bawi_studio
-- ============================================

-- Supprimer la base si elle existe déjà
DROP DATABASE IF EXISTS `bawi_studio`;

-- Créer la base de données
CREATE DATABASE `bawi_studio` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE `bawi_studio`;

-- ============================================
-- TABLE: admins
-- Gestion des administrateurs
-- ============================================
CREATE TABLE `admins` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `last_login` TIMESTAMP NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    INDEX `idx_username` (`username`),
    INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: client_messages
-- Messages du formulaire de contact client
-- ============================================
CREATE TABLE `client_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `contact` VARCHAR(50) NOT NULL,
    `domain` ENUM('company', 'student', 'individual', 'ngo') NOT NULL,
    `project_type` ENUM('web', 'mobile', 'design', 'other') NOT NULL,
    `budget` VARCHAR(50),
    `deadline` VARCHAR(50),
    `message` TEXT NOT NULL,
    `status` ENUM('new', 'read', 'in_progress', 'completed', 'archived') DEFAULT 'new',
    `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    `notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_status` (`status`),
    INDEX `idx_domain` (`domain`),
    INDEX `idx_priority` (`priority`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: general_messages
-- Messages généraux (questions, feedback, etc.)
-- ============================================
CREATE TABLE `general_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `sender_name` VARCHAR(100) NOT NULL,
    `sender_email` VARCHAR(100) NOT NULL,
    `sender_contact` VARCHAR(50),
    `subject` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `category` ENUM('question', 'feedback', 'complaint', 'other') DEFAULT 'question',
    `status` ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    `admin_reply` TEXT,
    `replied_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_status` (`status`),
    INDEX `idx_category` (`category`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: deleted_messages
-- Corbeille pour les messages supprimés
-- ============================================
CREATE TABLE `deleted_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `original_id` INT NOT NULL,
    `original_type` ENUM('client', 'general') NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `contact` VARCHAR(50),
    `domain` VARCHAR(50),
    `project_type` VARCHAR(50),
    `budget` VARCHAR(50),
    `deadline` VARCHAR(50),
    `subject` VARCHAR(200),
    `category` VARCHAR(50),
    `message` TEXT NOT NULL,
    `status` VARCHAR(50),
    `original_created_at` TIMESTAMP NULL,
    `deleted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `deleted_by` INT,
    INDEX `idx_original_type` (`original_type`),
    INDEX `idx_deleted_at` (`deleted_at`),
    FOREIGN KEY (`deleted_by`) REFERENCES `admins`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: statistics
-- Statistiques quotidiennes
-- ============================================
CREATE TABLE `statistics` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `date` DATE NOT NULL UNIQUE,
    `total_messages` INT DEFAULT 0,
    `client_messages` INT DEFAULT 0,
    `general_messages` INT DEFAULT 0,
    `new_messages` INT DEFAULT 0,
    `completed_messages` INT DEFAULT 0,
    INDEX `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: admin_logs
-- Logs d'activité des administrateurs
-- ============================================
CREATE TABLE `admin_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `admin_id` INT NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `details` TEXT,
    `ip_address` VARCHAR(45),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_admin_id` (`admin_id`),
    INDEX `idx_action` (`action`),
    INDEX `idx_created_at` (`created_at`),
    FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERTION DE L'ADMINISTRATEUR PAR DÉFAUT
-- Username: euloge
-- Password: 20-86
-- Hash généré avec bcrypt
-- ============================================
INSERT INTO `admins` (`username`, `password_hash`, `email`) 
VALUES (
    'euloge', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5ztP.dQ7T6iem',
    'editchaosam@gmail.com'
);

-- ============================================
-- DONNÉES DE TEST (OPTIONNEL)
-- ============================================

-- Messages clients de test
INSERT INTO `client_messages` 
(`name`, `email`, `contact`, `domain`, `project_type`, `budget`, `deadline`, `message`, `status`, `priority`) 
VALUES
('Jean Dupont', 'jean.dupont@example.com', '+33612345678', 'company', 'web', '5000-10000€', '3 mois', 'Nous avons besoin d\'un site e-commerce pour notre boutique.', 'new', 'high'),
('Marie Martin', 'marie.martin@example.com', '+33698765432', 'student', 'mobile', '1000-3000€', '2 mois', 'Je cherche à développer une application mobile pour mon projet de fin d\'études.', 'new', 'medium'),
('Pierre Durand', 'pierre.durand@example.com', '+33687654321', 'individual', 'design', '500-1000€', '1 mois', 'J\'ai besoin d\'un logo et d\'une identité visuelle pour mon entreprise.', 'read', 'low'),
('Sophie Bernard', 'sophie.bernard@example.com', '+33676543210', 'ngo', 'web', '3000-5000€', '4 mois', 'Notre ONG a besoin d\'un site web pour présenter nos actions.', 'in_progress', 'high');

-- Messages généraux de test
INSERT INTO `general_messages` 
(`sender_name`, `sender_email`, `sender_contact`, `subject`, `message`, `category`, `status`) 
VALUES
('Luc Petit', 'luc.petit@example.com', '+33665432109', 'Question sur vos services', 'Bonjour, je voudrais savoir si vous proposez des services de maintenance?', 'question', 'new'),
('Emma Roux', 'emma.roux@example.com', '+33654321098', 'Excellent travail!', 'Je tiens à vous remercier pour le travail exceptionnel réalisé sur mon site.', 'feedback', 'read');

-- Statistiques de test
INSERT INTO `statistics` (`date`, `total_messages`, `client_messages`, `general_messages`, `new_messages`, `completed_messages`)
VALUES
(CURDATE(), 6, 4, 2, 5, 0),
(DATE_SUB(CURDATE(), INTERVAL 1 DAY), 3, 2, 1, 2, 1),
(DATE_SUB(CURDATE(), INTERVAL 2 DAY), 5, 3, 2, 3, 2);

-- ============================================
-- VÉRIFICATION DE LA CRÉATION
-- ============================================
SELECT 'Base de données créée avec succès!' AS Status;
SELECT COUNT(*) AS 'Nombre d\'admins' FROM admins;
SELECT COUNT(*) AS 'Nombre de messages clients' FROM client_messages;
SELECT COUNT(*) AS 'Nombre de messages généraux' FROM general_messages;

-- ============================================
-- FIN DU SCRIPT
-- ============================================
