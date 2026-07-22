package com.sgtsoftsol.journalapp.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.sgtsoftsol.journalapp.entity.User;

public interface UserRepository extends MongoRepository<User,ObjectId>{
    User findByUsername(String username);
     
}
