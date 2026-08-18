package com.sgtsoftsol.journalapp.service;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class EmailServiceTest {
    @Autowired
    private EmailService emailService;

    @Test
    void testSendEmail() {
        emailService.sendEmail("smachroks@gmail.com",
                "Testing Java mail sender",
                "This is a test email sent from an java application using spring boot and java mail sender");
    }

}
