-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 21, 2021 at 04:47 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `progetto_cyber`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id` int(10) UNSIGNED NOT NULL,
  `role` int(11) NOT NULL,
  `blockchain_address` varchar(1024) NOT NULL,
  `locked` tinyint(1) DEFAULT NULL,
  `locked_at` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `surname`, `email`, `password`, `id`, `role`, `blockchain_address`, `locked`, `locked_at`) VALUES
('Admin', 'Admin', 'admin@admin.it', '$2a$12$SflhoCxRdtzmLraJVfUnCef7HXDSu5MWv3vV8Ec5F2Y.v3CVJ.9bG', 1, 10, 'U2FsdGVkX19hFox2qUTSt21cWCV+ClYlCqqF00NIbPttf6dpdSRNOCo23zDMqU2qazl/4VEp1LyuAA==', 0, NULL),
('Utente', 'Utente', 'utente@utente.it', '$2a$12$QMRASXvPGC1KJ4LebdSvVu0lFalM4qxfaDdFN9CWOjW3DCqpFCXb2', 2, 0, 'U2FsdGVkX19s6npnlsOcIOERbnxzEYGOqaUfE1ey8I7YAxTczW1MVN5K2Sd76Ie5UYX5vzKZa8mb4w==', 0, NULL),
('Manager', 'Manager', 'manager@manager.it', '$2a$12$tfUiZqaBDjGp6M6mQoB8nulsMKoBJr6wwQr/b01S71s9qZ9OavSe.', 3, 1, 'U2FsdGVkX18KHm9Pw+zXwireWDi5GSPJ+i2eG4JcckjKOyUzUQyqT9cDJsOhH/QQrJxChZklHRNhlA==', 0, NULL),
('Biglietteria', 'Biglietteria', 'biglietteria@biglietteria.it', '$2a$12$KJf0FAKIKaluvNvqYKn.f.dgqOz4PzEAT2foYJOicRcGlqoa3DB.C', 4, 2, 'U2FsdGVkX182w7qRlxstqndeUXm5IORGIwrgyJV2NWafyAoc4bmDq636BDk/lG76/LTN/6X6OMlJyA==', 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
