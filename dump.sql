PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT
);
INSERT INTO users VALUES(1,'m3potishman@gmail.com','5b7a744a0e083c2d1f29b367e5b1cd2c0ad35f1235c3471afef81ffa408a5001f2115f9e207533c4e8e01dd6945158c597d205b5f8092fe58aa0afff2d58b01e:e282a8e1581f0ff298fe193e0d66d102');
INSERT INTO users VALUES(2,'mxppotishman@gmail.com','4e9bab4d294f95a1b78de661649bd06300fc972b88a11510723bc23b2c0d925efd283a826a57d2c479dcf93dfeb4e3d3c23770e1be65114cd28909fc58484a4b:4de1b7c2419a56b0ed576cd5c1240f90');
INSERT INTO users VALUES(3,'test@test.com','56f758ce761222b05a321a3ff12a7154b2fd1957f06d8dced26e307526c6f613ab79a5ee99c59f963bb72e7b9040bc416bb825a3c82a93cf00505e186987ea3d:4386e0be81bde9d510cc298b453ab85d');
CREATE TABLE sessions (
  id TEXT NOT NULL PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
INSERT INTO sessions VALUES('5tg7glzesn6ehbvc6gknsi4uyi4iuqnsv3oplvzh',1766922985,'1.0');
INSERT INTO sessions VALUES('wbtddhibq5fojnwxdector5p25ir4rkp5qrz3gba',1766923273,'2.0');
INSERT INTO sessions VALUES('ddrcjgewdtjbpnyxsonqjiyjjof2cnj22bsnodmi',1766938018,'3.0');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('users',3);
COMMIT;
