package com.sgtsoftsol.journalapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.sgtsoftsol.journalapp.entity.JournalEntry;
import com.sgtsoftsol.journalapp.entity.User;
import com.sgtsoftsol.journalapp.repository.JournalEntryRepository;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JournalEntryService {

    // private final JournalEntryController journalEntryController;
    // private final JournalappApplication journalappApplication;
    @Autowired
    private JournalEntryRepository journalEntryRepository;
    @Autowired
    private UserService userService;

    // JournalEntryService(JournalappApplication journalappApplication,
    // JournalEntryController journalEntryController) {
    // this.journalappApplication = journalappApplication;
    // this.journalEntryController = journalEntryController;
    // }

    @Transactional
    public void saveEntry(JournalEntry journalEntry, String username) {
        try {
            User user = userService.findByUserName(username);
            journalEntry.setDate(LocalDateTime.now());
            JournalEntry saved = journalEntryRepository.save(journalEntry);
            user.getJournalEntries().add(saved);
            userService.saveUser(user);

        } catch (Exception e) {
            log.error("Error", e);
            throw new RuntimeException("An error occurred while saving the entry", e);
        }
    }

    public void saveEntry(JournalEntry journalEntry) {
        journalEntryRepository.save(journalEntry);
    }

    public List<JournalEntry> getAll() {
        return journalEntryRepository.findAll();
    }

    public Optional<JournalEntry> findById(ObjectId id) {
        return journalEntryRepository.findById(id);
    }

    @Transactional
    public boolean deleteById(ObjectId id, String username) {
        boolean removed = false;
        try {
            User user = userService.findByUserName(username);
            removed = user.getJournalEntries().removeIf(x -> x.getId().equals(id));
            if (removed) {
                userService.saveUser(user);
                journalEntryRepository.deleteById(id);
            }

        } catch (Exception e) {
            System.out.println(e);
            throw new RuntimeException("An error occurred while deleting the entry.", e);
         }

        return removed;
    }

}
