/******************************************************************************
 * File Name:        create_db.sql
 * Description:      This file will create a new empty database for CSE5ICE Assignment - 2015.
		     Group 29.
 ******************************************************************************/




--  =============================================================
-- Dropping Existing Tables
-- ===============================
DROP TABLE IF EXISTS ADS_PIC;

DROP TABLE IF EXISTS PICTURES;

DROP TABLE IF EXISTS ADVERTISEMENTS;  

DROP TABLE IF EXISTS COMMENTS;

DROP TABLE IF EXISTS POST;

DROP TABLE IF EXISTS PEOPLE;

DROP TABLE IF EXISTS ITEMS; 

DROP TABLE IF EXISTS USERS;


-- =============================================================
-- Adding New Empty Tables
-- ===============================


-- =============================================================
-- TABLE USERS
-- ===============================

CREATE TABLE USERS(
user_id                                          	INTEGER 				NOT NULL,
email       	                                    VARCHAR(100)          	NOT NULL,
password       	                                    VARCHAR(30)           	NOT NULL,
nickname       	                                    VARCHAR(30)           	NOT NULL,
address       	                                    VARCHAR(100)          	NOT NULL,
phone       	                                    VARCHAR(10)		        NOT NULL,
user_type                                 			VARCHAR(30)           	NOT NULL,

PRIMARY KEY (user_id, email, password))
Engine=InnoDB;


-- =============================================================
-- TABLE ITEMS
-- ===============================

CREATE TABLE ITEMS(
item_id                                          	INTEGER 				NOT NULL,
title		    	                                VARCHAR(30)			   	NOT NULL,
item_pic											BLOB					NOT NULL,
item_give											VARCHAR(30)				NOT NULL,
item_desc	                         				VARCHAR(500)          	NOT NULL,
item_type			       	                        VARCHAR(30)           	NOT NULL,

PRIMARY KEY (item_id))
Engine=InnoDB;


-- =============================================================
-- TABLE PEOPLE
-- ===============================

CREATE TABLE PEOPLE(
people_id       	                         		INTEGER               	NOT NULL,
first_name			       	                        VARCHAR(30)           	NOT NULL,
last_name       	                         		VARCHAR(30)           	NOT NULL,
age			       	                         		INTEGER		           			,
gender		       	                         		VARCHAR(30)           	NOT NULL,
people_pic            	                         	BLOB							,
people_desc      	                         		VARCHAR(1000)          	NOT NULL,
people_type			       	                        VARCHAR(30)           	NOT NULL,

PRIMARY KEY (people_id))
Engine=InnoDB;


-- =============================================================
-- TABLE POST
-- ===============================
 
CREATE TABLE POST(
post_id                                          	INTEGER                 NOT NULL,
title		    	                                VARCHAR(30)			   	NOT NULL,
postdate       	                         			BIGINT	          		NOT NULL,
user_id												INTEGER		           	NOT NULL,
cmt_num												INTEGER		           	NOT NULL,
people_id       	                         		INTEGER               			,
item_id       	                         			INTEGER               			,


PRIMARY KEY (post_id),

FOREIGN KEY(user_id) REFERENCES USERS(user_id)
ON DELETE CASCADE)
Engine=InnoDB;


-- =============================================================
-- TABLE ADVERTISEMENTS
-- ===============================
 
CREATE TABLE ADVERTISEMENTS(
ads_id                                          	INTEGER                 NOT NULL,
ads_pic                                         	BLOB                    NOT NULL,
caption                                        	 	VARCHAR(500)            		,
link                                            	VARCHAR(100)            NOT NULL,
user_id												INTEGER		           	NOT NULL,

PRIMARY KEY (ads_id),

FOREIGN KEY(user_id) REFERENCES USERS(user_id)
ON DELETE CASCADE)
Engine=InnoDB;


-- =============================================================
-- TABLE COMMENTS
-- ===============================
 
CREATE TABLE COMMENTS(
comment_id                                          	INTEGER                 NOT NULL,
post_id		    	                                	INTEGER				   	NOT NULL,
content       	                         				VARCHAR(1000)      		NOT NULL,
comment_time    	                                	BIGINT				   	NOT NULL,
user_id		    	                                	INTEGER				   	NOT NULL,

PRIMARY KEY (comment_id),

FOREIGN KEY(user_id) REFERENCES USERS(user_id)
ON DELETE CASCADE)
Engine=InnoDB;


-- =============================================================
-- TABLE PICTURES
-- ===============================
 
CREATE TABLE PICTURES(
pic_id                        		                  	INTEGER                 NOT NULL,
post_id		    	                                	INTEGER				   	NOT NULL,
pic_img       	                         				BLOB		      		NOT NULL,

PRIMARY KEY (pic_id),

FOREIGN KEY(post_id) REFERENCES POST(post_id)
ON DELETE CASCADE)
Engine=InnoDB;


-- =============================================================
-- TABLE ADS_PIC
-- ===============================
 
CREATE TABLE ADS_PIC(
pic_id                        		                  	INTEGER                 NOT NULL,
ads_id		    	                                	INTEGER				   	NOT NULL,
pic_img       	                         				BLOB		      		NOT NULL,

PRIMARY KEY (pic_id),

FOREIGN KEY(ads_id) REFERENCES ADVERTISEMENTS(ads_id)
ON DELETE CASCADE)
Engine=InnoDB;