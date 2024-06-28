// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require("../services/db");

// ##############################################################
// DEFINE SQL STATEMENTS
// ##############################################################
const SQLSTATEMENT = `
DROP TABLE IF EXISTS Task;
DROP TABLE IF EXISTS TaskProgress;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS Champion;
DROP TABLE IF EXISTS Shop;
DROP TABLE IF EXISTS Beast;
DROP TABLE IF EXISTS Battlefield;
DROP TABLE IF EXISTS Message;

-- Task Table
CREATE TABLE Task (
    task_id INT PRIMARY KEY AUTO_INCREMENT,
    title TEXT,
    description TEXT,
    points INT
);

-- initial data into task table
INSERT INTO Task (task_id, title, description, points) VALUES
    (1, 'Plant a Tree', 'Plant a tree in your neighborhood or a designated green area.', 50),
    (2, 'Use Public Transportation', 'Use public transportation or carpool instead of driving alone.', 30),
    (3, 'Reduce Plastic Usage', 'Commit to using reusable bags and containers.', 40),
    (4, 'Energy Conservation', 'Turn off lights and appliances when not in use.', 25),
    (5, 'Composting', 'Start composting kitchen scraps to create natural fertilizer.', 35);


-- TaskProgress Table
CREATE TABLE TaskProgress (
    progress_id INT PRIMARY KEY AUTO_INCREMENT,
    champion_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    task_id INT NOT NULL,
    title TEXT,
    completion_date DATE,
    notes TEXT
);


-- Shop Table
CREATE TABLE Shop (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type ENUM('weapon', 'armor') NOT NULL,
    description VARCHAR(255),
    price INT NOT NULL,
    level_requirement INT,
    rarity ENUM('C', 'B', 'A', 'S') NOT NULL,
    item_damage INT,
    item_protection INT
);

-- Champion Table
CREATE TABLE Champion (
    champion_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255) DEFAULT './images/pfp/DefaulPoroPfp.jpg',
    health INT DEFAULT 100,
    damage INT DEFAULT 15,
    level INT DEFAULT 1,
    gold INT DEFAULT 0,
    weapon_equipped VARCHAR(255) DEFAULT 'none',  
    armor_equipped VARCHAR(255) DEFAULT 'none' 
);

-- Message Table
CREATE TABLE Message (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    champion_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    date DATE NOT NULL,
    time TIME NOT NULL,
    message_text TEXT NOT NULL
);

-- Beast Table
CREATE TABLE Beast (
    beast_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    health INT,
    damage INT,
    status ENUM('Alive', 'Defeated') NOT NULL,
    difficulty ENUM('C', 'B', 'A', 'S', 'S+') NOT NULL,
    exp_drop INT,
    gold_drop INT
);

-- Inventory Table
CREATE TABLE Inventory (
    inventory_id INT PRIMARY KEY AUTO_INCREMENT,
    champion_id INT,
    item_id INT,
    name VARCHAR(255) NOT NULL,
    type ENUM('weapon', 'armor') NOT NULL,
    description VARCHAR(255),
    rarity ENUM('C', 'B', 'A', 'S') NOT NULL,
    item_damage INT,
    item_protection INT
);

-- Battlefield Table
CREATE TABLE Battlefield (
    battle_id INT PRIMARY KEY AUTO_INCREMENT,
    champion_id INT,
    beast_id INT,
    champion_name VARCHAR(255),
    beast_name VARCHAR(255),
    champion_damage INT,
    beast_damage INT,
    champion_health INT,
    beast_health INT,
    exp_drop INT, 
    gold_drop INT  
);


-- Inserting beasts into the Beast table
INSERT INTO Beast (name, health, damage, status, difficulty, exp_drop, gold_drop)
VALUES ('Raptor', 30, 10, 'Alive', 'C', 1, 8),
       ('Voidgrub', 60, 20, 'Alive', 'C', 3, 16),
       ('Murk_Wolf', 45, 15, 'Alive', 'C', 2, 12),
       ('Mini_Krug', 60, 25, 'Alive', 'C', 4, 18),
       ('Blue_Sentinel', 80, 45, 'Alive', 'B', 5, 35),
       ('Crimson_Raptor', 70, 40, 'Alive', 'B', 4, 30),
       ('Red_Brambleback', 90, 50, 'Alive', 'B', 6, 40),
       ('Gromp', 65, 35, 'Alive', 'B', 3, 28),
       ('Ancient_Krug', 100, 55, 'Alive', 'B', 8, 50),
       ('Voidgrub', 70, 30, 'Alive', 'A', 8, 40),
       ('Rift_Herald', 120, 50, 'Alive', 'A', 12, 80),
       ('Baron_Nashor', 300, 120, 'Alive', 'A', 20, 200),
       ('Hextech_Drake', 150, 60, 'Alive', 'A', 15, 120),
       ('Mountain_Drake', 180, 70, 'Alive', 'A', 18, 140),
       ('Infernal_Drake', 200, 80, 'Alive', 'A', 20, 160),
       ('Ocean_Drake', 170, 65, 'Alive', 'A', 17, 150),
       ('Cloud_Drake', 220, 100, 'Alive', 'S', 25, 250),
       ('Chemtech_Drake', 240, 110, 'Alive', 'S', 28, 280),
       ('Elder_Dragon', 2500, 750, 'Alive', 'S+', 500, 100000);


-- Inserting items into the Shop table
INSERT INTO Shop (name, type, description, price, level_requirement, rarity, item_damage, item_protection)
VALUES 
    ('Chain_Vest', 'armor', '30 Armor', 24, 4, 'C', NULL, 30),
    ('Bramble_Vest', 'armor', '50 Armor', 32, 7, 'C', NULL, 50),
    ('Winged_Moonplate', 'armor', '65 Armor', 38, 9, 'C', NULL, 65),
    ('Giants_Belt', 'armor', '75 Armor', 46, 13, 'C', NULL, 75),
    ('Kircheis_Shard', 'weapon', '25 Damage', 26, 6, 'C', 25, NULL),
    ('Recurve_Bow', 'weapon', '30 Damage', 32, 8, 'C', 30, NULL),
    ('Sheen', 'weapon', '35 Damage', 44, 11, 'C', 35, NULL),
    ('Executioners_Calling', 'weapon', '40 Damage', 54, 12, 'C', 40, NULL),
    ('Warmogs_Armor', 'armor', '100 Armor', 80, 19, 'B', NULL, 100),
    ('Gargoyle_Stoneplate', 'armor', '120 Armor', 95, 22, 'B', NULL, 120),
    ('Steraks_Gage', 'armor', '80 Armor', 70, 16, 'B', NULL, 80),
    ('Demonic_Embrace', 'armor', '90 Armor', 75, 18, 'B', NULL, 90),
    ('Thornmail', 'armor', '110 Armor', 90, 20, 'B', NULL, 110),
    ('Spirit_Visage', 'armor', '95 Armor', 85, 17, 'B', NULL, 95),
    ('Nashors_Tooth', 'weapon', '50 Damage', 65, 13, 'B', 50, NULL),
    ('Bloodthirster', 'weapon', '70 Damage', 80, 18, 'B', 70, NULL),
    ('Deaths_Dance', 'weapon', '65 Damage', 75, 16, 'B', 65, NULL),
    ('Manamune', 'weapon', '55 Damage', 60, 14, 'B', 55, NULL),
    ('Kraken_Slayer', 'weapon', '85 Damage', 100, 20, 'B', 85, NULL),
    ('Hullbreaker', 'weapon', '75 Damage', 90, 19, 'B', 75, NULL),
    ('The_Collector', 'weapon', '80 Damage', 95, 21, 'B', 80, NULL),
    ('Equinox', 'armor', '120 Armor', 120, 28, 'A', NULL, 120),
    ('Heartsteel', 'armor', '150 Armor', 140, 32, 'A', NULL, 150),
    ('Shurelyas_Requiem', 'armor', '110 Armor', 110, 26, 'A', NULL, 110),
    ('Caesura', 'armor', '125 Armor', 130, 30, 'A', NULL, 125),
    ('Evenshroud', 'armor', '140 Armor', 135, 34, 'A', NULL, 140),
    ('JakSho_The_Protean', 'armor', '130 Armor', 130, 31, 'A', NULL, 130),
    ('Locket_of_the_Iron_Solari', 'armor', '145 Armor', 150, 36, 'A', NULL, 145),
    ('Duskblade_of_Draktharr', 'weapon', '90 Damage', 160, 24, 'A', 90, NULL),
    ('Eclipse', 'weapon', '100 Damage', 180, 28, 'A', 100, NULL),
    ('Galeforce', 'weapon', '95 Damage', 170, 26, 'A', 95, NULL),
    ('Goredrinker', 'weapon', '110 Damage', 200, 32, 'A', 110, NULL),
    ('Vespertide', 'weapon', '120 Damage', 220, 34, 'A', 120, NULL),
    ('Divine_Sunderer', 'weapon', '115 Damage', 210, 30, 'A', 115, NULL),
    ('Stridebreaker', 'weapon', '130 Damage', 240, 36, 'A', 130, NULL),
    ('Dreamshatter', 'weapon', '125 Damage', 230, 35, 'A', 125, NULL),
    ('Infinity_Force', 'weapon', '140 Damage', 250, 38, 'A', 140, NULL),
    ('Guinsoos_Rageblade', 'weapon', '150 Damage', 270, 40, 'A', 150, NULL),
    ('Edge_of_Finality', 'weapon', '145 Damage', 260, 39, 'A', 145, NULL),
    ('Navori_Quickblades', 'weapon', '160 Damage', 280, 42, 'A', 160, NULL),
    ('Typhoon', 'weapon', '155 Damage', 270, 41, 'A', 155, NULL);

`;

// ##############################################################
// RUN SQL STATEMENTS
// ##############################################################
pool.query(SQLSTATEMENT, (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
});
