CREATE TABLE IF NOT EXISTS plannings (
planning_id varchar(255) PRIMARY KEY,
planning_password varchar(255)
);

CREATE TABLE IF NOT EXISTS RegisteredPersons (
       Id SERIAL PRIMARY KEY,
       Name varchar(255),
       MorningOrAfternoon varchar(255),
       Weekday varchar(255),
       dayNumber integer,
       planning_id varchar(255) references plannings(planning_id)
);

CREATE TABLE IF NOT EXISTS Activities (
       name varchar(255),
       halfday varchar(255),
       day varchar(255),
       dayNumber integer,
       planning_id varchar(255) references plannings(planning_id)
);
       
