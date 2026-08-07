package com.sgtsoftsol.journalapp.service;

import java.util.stream.Stream;

import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.ArgumentsProvider;
import com.sgtsoftsol.journalapp.entity.User;

public class UserArguementProvider implements ArgumentsProvider {

    @Override
    public Stream<? extends Arguments> provideArguments(ExtensionContext context) throws Exception {
    
        return Stream.of(
            Arguments.of(User.builder().username("ty").password("ty").build()),
            Arguments.of(User.builder().username("tim").password("tim").build())
        );
    }
    
    
}
