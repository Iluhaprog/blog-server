CREATE DATABASE IF NOT EXISTS BlogDB;

USE BlogDB;

CREATE TABLE IF NOT EXISTS `roles` (
    `id` INT UNIQUE NOT NULL AUTO_INCREMENT,
    `role` VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `users` (
    `id` INT UNIQUE NOT NULL AUTO_INCREMENT,
    `avatarImage` VARCHAR(150) DEFAULT '',
    `firstName` VARCHAR(50) DEFAULT '',
    `lastName` VARCHAR(50) DEFAULT '',
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `bio` TEXT NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `skills` VARCHAR(255) DEFAULT '',
    `confirmed` INT NOT NULL DEFAULT 0,
    `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `roleId` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY(`roleId`) REFERENCES `roles`(`id`)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `conformation_codes` (
    `id` INT UNIQUE NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(150) NOT NULL,
    `userId` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `directories` (
    `id` INT UNIQUE NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `posts` (
    `id` INT UNIQUE NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(150) NOT NULL,
    `text` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `preview` VARCHAR(255) NOT NULL,
    `visible` BOOLEAN NOT NULL DEFAULT 0,
    `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `userId` INT NOT NULL,
    `directoryId` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY(`userId`) REFERENCES `users`(`id`)
        ON DELETE CASCADE,
    FOREIGN KEY(`directoryId`) REFERENCES `directories`(`id`)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `files` (
    `id` INT UNIQUE NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `path` VARCHAR(100) NOT NULL,
    `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `directoryId` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY(`directoryId`) REFERENCES `directories`(`id`)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `projects` (
    `id` INT UNIQUE NOT NULL AUTO_INCREMENT,
    `preview` VARCHAR(255) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `projectLink` VARCHAR(200) NOT NULL DEFAULT '',
    `githubLink` VARCHAR(200) NOT NULL DEFAULT '',
    `userId` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY(`userId`) REFERENCES `users`(`id`)
        ON DELETE CASCADE
);

CREATE TABLE `likes` (
    `id` INT UNIQUE NOT NULL AUTO_INCREMENT,
    `postId` INT NOT NULL,
    `userId` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY(`postId`) REFERENCES `posts`(`id`)
        ON DELETE CASCADE,
    FOREIGN KEY(`userId`) REFERENCES `users`(`id`)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `comments` (
    `id` INT UNIQUE NOT NULL AUTO_INCREMENT,
    `text` TEXT NOT NULL,
    `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `userId` INT NOT NULL,
    `postId` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY(`userId`) REFERENCES `users`(`id`)
        ON DELETE CASCADE,
    FOREIGN KEY(`postId`) REFERENCES `posts`(`id`)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `tags` (
    `id` INT UNIQUE NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `tags_posts` (
    `id` INT UNIQUE NOT NULL AUTO_INCREMENT,
    `postId` INT NOT NULL,
    `tagId` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY(`tagId`) REFERENCES `tags`(`id`)
        ON DELETE CASCADE,
    FOREIGN KEY(`postId`) REFERENCES `posts`(`id`)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `home` (
    `id` INT UNIQUE NOT NULL AUTO_INCREMENT,
    `preview` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);