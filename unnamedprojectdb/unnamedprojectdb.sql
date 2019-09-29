-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 30, 2019 at 12:30 AM
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
(1, 'root', '', 1, 'root@dt.up', 'root', 'Eng'),
(2, 'd3nsh1n', 'pass123!', 1, 'd3nsh1n@gmail.com', 'Denshin', 'Eng'),
(3, 'giot', 'Castlevania1', 1, 'Gef.Giotopoulos@gmail.com', 'obdsf', 'Eng'),
(4, 'billakos', '', 0, 'yikes@pleb.fu', 'Phalanx', 'Gr');

-- --------------------------------------------------------

--
-- Table structure for table `maps`
--

CREATE TABLE `maps` (
  `id` int(11) NOT NULL,
  `name` text COLLATE latin1_general_cs NOT NULL,
  `active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_cs;

--
-- Dumping data for table `maps`
--

INSERT INTO `maps` (`id`, `name`, `active`) VALUES
(13, 'salonika', 0);

-- --------------------------------------------------------

--
-- Table structure for table `salonika`
--

CREATE TABLE `salonika` (
  `rowid` int(11) NOT NULL,
  `name` text COLLATE latin1_general_cs DEFAULT NULL,
  `id` text COLLATE latin1_general_cs DEFAULT NULL,
  `point` text COLLATE latin1_general_cs DEFAULT NULL,
  `coords` text COLLATE latin1_general_cs DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_cs;

--
-- Dumping data for table `salonika`
--

INSERT INTO `salonika` (`rowid`, `name`, `id`, `point`, `coords`) VALUES
(1, 'population_data_per_block.1', 'population_data_per_block.1', '22.93441007414772,40.64316461309677', '22.93400457702626,40.643012616714856 22.934564545884665,40.64362253212651 22.934701483452614,40.64362940780963 22.934523984921857,40.64273825698915 22.934003983175426,40.643004301797234 22.93400457702626,40.643012616714856'),
(2, 'population_data_per_block.2', 'population_data_per_block.2', '22.93342093529474,40.63950376538084', '22.93203756248032,40.63887444058661 22.93183015066753,40.63904908068617 22.931890329193475,40.6391037694026 22.931890135590656,40.639115915573704 22.931623091867234,40.63934288449596 22.931575726013126,40.63935639141871 22.931711304600036,40.6394788767313 22.93178454012615,40.639499153111174 22.931769173219656,40.63956305417955 22.931753862413917,40.63956816900282 22.931669085603335,40.639548586685244 22.93145700669199,40.63938319315188 22.93139060800189,40.63944077272571 22.931391622474806,40.63950389115281 22.931405250061285,40.63954277812861 22.931432908766695,40.639573669275336 22.93147897889532,40.63960182914331 22.931705802345025,40.639648504509815 22.932444774338524,40.63976754478425 22.93323624549484,40.63990884878341 22.933261665772612,40.63993525780618 22.93435020892206,40.64013363103168 22.93452448514861,40.640176528732546 22.934641399688395,40.64028579319175 22.93472982943262,40.640328630038624 22.934786469525324,40.64034307696901 22.93483266438833,40.64033911054245 22.935183686356915,40.64015910960426 22.93472379716283,40.63963093815987 22.934505843038163,40.63880871323349 22.934481500730925,40.6387842665683 22.93445999027353,40.638782975355575 22.934069320954798,40.63898497989791 22.934015087014824,40.639004165544996 22.933234222248366,40.63907120537393 22.932096241151392,40.63886014084421 22.93203756248032,40.63887444058661'),
(3, 'population_data_per_block.3', 'population_data_per_block.3', '22.95522969796583,40.60390838134561', '22.954707888974728,40.6041876647569 22.955564468266548,40.60424063324161 22.95578343654876,40.60366407325679 22.955757583533945,40.60365277429903 22.954870293512474,40.60356637155229 22.954707888974728,40.6041876647569');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `USERNAME` (`username`) USING HASH;

--
-- Indexes for table `maps`
--
ALTER TABLE `maps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salonika`
--
ALTER TABLE `salonika`
  ADD PRIMARY KEY (`rowid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Unique Identification Number', AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `maps`
--
ALTER TABLE `maps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `salonika`
--
ALTER TABLE `salonika`
  MODIFY `rowid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
