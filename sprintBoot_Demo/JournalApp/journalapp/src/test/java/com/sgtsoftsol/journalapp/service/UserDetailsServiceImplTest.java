package com.sgtsoftsol.journalapp.service;
import static org.mockito.Mockito.when;

import java.util.ArrayList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;

import com.mongodb.assertions.Assertions;
import com.sgtsoftsol.journalapp.entity.User;
import com.sgtsoftsol.journalapp.repository.UserRepository;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("dev")
public class UserDetailsServiceImplTest {

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;
    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void loadUserBYUsernameTest(){
        when(userRepository.findByUsername(ArgumentMatchers.anyString())).thenReturn(User.builder().username("ram").password("fhuifdhuvif").roles(new ArrayList<>()).build());
        UserDetails user = userDetailsService.loadUserByUsername("ram");
        Assertions.assertNotNull(user);
    }
    
}
