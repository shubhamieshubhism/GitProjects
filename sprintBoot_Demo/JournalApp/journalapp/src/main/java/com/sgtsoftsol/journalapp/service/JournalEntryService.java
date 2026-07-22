package com.sgtsoftsol.journalapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sgtsoftsol.journalapp.entity.JournalEntry;
import com.sgtsoftsol.journalapp.entity.User;
import com.sgtsoftsol.journalapp.repository.JournalEntryRepository;

@Component
public class JournalEntryService {

    // private final JournalEntryController journalEntryController;
    // private final JournalappApplication journalappApplication;
    @Autowired
    private JournalEntryRepository journalEntryRepository;
    @Autowired
    private UserService userService;

    // JournalEntryService(JournalappApplication journalappApplication, JournalEntryController journalEntryController) {
    //     this.journalappApplication = journalappApplication;
    //     this.journalEntryController = journalEntryController;
    // }

    public void saveEntry(JournalEntry journalEntry, String username){
        User user = userService.findByUserName(username);
        journalEntry.setDate(LocalDateTime.now());
        JournalEntry saved = journalEntryRepository.save(journalEntry);
        user.getJournalEntries().add(saved);
        userService.saveEntry(user);
    }

    public void saveEntry(JournalEntry journalEntry){
        journalEntryRepository.save(journalEntry);
    }

    public List<JournalEntry> getAll(){
        return journalEntryRepository.findAll();
    }

    public Optional<JournalEntry> findById(ObjectId id){
        return journalEntryRepository.findById(id);
    }

    public void deleteById(ObjectId id,String username){
        User user = userService.findByUserName(username);
        user.getJournalEntries().removeIf(x->x.getId().equals(id));
        userService.saveEntry(user);
        journalEntryRepository.deleteById(id);
    }

    
}
