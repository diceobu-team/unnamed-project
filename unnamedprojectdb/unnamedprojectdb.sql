-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 26, 2019 at 05:51 PM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `unnamedprojectdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL COMMENT 'Unique Identification Number',
  `username` text COLLATE latin1_general_cs NOT NULL COMMENT 'Account Username',
  `password` text COLLATE latin1_general_cs NOT NULL COMMENT 'Account Password',
  `admin` tinyint(1) NOT NULL,
  `email` text COLLATE latin1_general_cs NOT NULL COMMENT 'Account Associated E-mail',
  `displayname` text COLLATE latin1_general_cs NOT NULL COMMENT 'Displayed Name',
  `language` tinytext COLLATE latin1_general_cs NOT NULL COMMENT 'The preferred language'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_cs COMMENT='Administrator Accounts';

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `username`, `password`, `admin`, `email`, `displayname`, `language`) VALUES
(0, 'root', '', 1, 'root@dt.up', 'root', 'Eng'),
(1, 'd3nsh1n', 'pass123!', 1, 'd3nsh1n@gmail.com', 'Denshin', 'Eng'),
(2, 'giot', 'Castlevania1', 1, 'Gef.Giotopoulos@gmail.com', 'obdsf', 'Gr'),
(3, 'billakos', '', 0, 'yikes@pleb.fu', 'Phalanx', 'Gr');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `USERNAME` (`username`) USING HASH,
  ADD UNIQUE KEY `DISPLAY-NAME` (`id`,`displayname`) USING HASH;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
