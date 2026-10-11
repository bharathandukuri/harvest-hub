package csp.harvest_hub.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import csp.harvest_hub.model.AppUserDetails;
import csp.harvest_hub.repository.UserRepository;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .map(user -> new AppUserDetails(user))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }

    
}