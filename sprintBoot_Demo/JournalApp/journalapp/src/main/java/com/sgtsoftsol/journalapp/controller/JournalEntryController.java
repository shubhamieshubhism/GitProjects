package com.sgtsoftsol.journalapp.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sgtsoftsol.journalapp.entity.JournalEntry;

@RestController
@RequestMapping("/journal")
public class JournalEntryController {

    private Map<Long, JournalEntry> jouranlEntries = new HashMap<>();

    @GetMapping
    public List<JournalEntry> getAll() {
        return new ArrayList<>(jouranlEntries.values());
    }

    @PostMapping
    public boolean createEntry(@RequestBody JournalEntry myEntry) {
        jouranlEntries.put(myEntry.getId(), myEntry);
        return true;

    }

    @GetMapping("id/{myId}")
    public JournalEntry getJournalEntryById(@PathVariable Long myId) {
        return jouranlEntries.get(myId);
    }

    @DeleteMapping("id/{myId}")
    public JournalEntry delteJournalEntryByIt(@PathVariable Long myId) {
        return jouranlEntries.remove(myId);
    }

    @PutMapping("/id/{id}")
    public JournalEntry updateJpournalBYId(@PathVariable Long id, @RequestBody JournalEntry myEntry) {
        return jouranlEntries.put(id, myEntry);
    }
}
