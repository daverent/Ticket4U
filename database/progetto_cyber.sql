-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 17, 2021 at 08:19 PM
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
('Admin', 'Admin', 'admin@admin.it', '$2a$12$pDfAC7fYzYcHF1nFS0vcqOxpfcPtd1yZjj/jondUL1s84D.cv8lbG', 1, 10, 'U2FsdGVkX18aSPwohIQFaTZAnBAdFQHXb/guhYHkDNYw8AaOeylLbvYMH2IS4ORZiaIzpQks/GOPdw==', 0, NULL),
('Utente', 'Utente', 'utente@utente.it', '$2a$12$GZR0hHNkKs422w6rM2anC.9SQ1DS4mCFNgZ7AEdZiBz6UGoB5agem', 2, 0, 'U2FsdGVkX1/RIjIslosAvR4aLmcn7mgeOH8xg7fxKb3sA7lGkgmINvRbLfypJ6PDiBScE02B7og/tg==', NULL, NULL),
('Manager', 'Manager', 'manager@manager.it', '$2a$12$yI8nq5fn4CMVqEoB2ZG.H.RB7m6UB2WGk7MZdDkKgB6v23WiNrDHC', 3, 1, 'U2FsdGVkX1/ZDjqkKgkQqBPOVqlO0+sJSqLOFiZKP36KsLHDG+GsxH8YuY1+9izGOrYy+NL/mHBGhg==', 0, NULL),
('Biglietteria', 'Biglietteria', 'biglietteria@biglietteria.it', '$2a$12$Gcjl0eH4ZCr7kZ.iOPSLKO/e7tPeXN8YLgJDbSr0HRHKqIDeT8Vri', 4, 2, 'U2FsdGVkX18q3tAWQlqlRfJeOYy5UpcNO7iVHlA8v45j6zxGlotMvyFsG2+giWoIgWsyhOkRac7d1w==', NULL, NULL);

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
