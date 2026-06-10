package com.devlearninghub.backend.service;

import com.devlearninghub.backend.dto.*;
import com.devlearninghub.backend.entity.GithubStat;
import com.devlearninghub.backend.entity.ProgrammersStat;
import com.devlearninghub.backend.entity.User;
import com.devlearninghub.backend.repository.GithubStatRepository;
import com.devlearninghub.backend.repository.ProgrammersStatRepository;
import com.devlearninghub.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class GithubSyncService {

    private final UserRepository userRepository;
    private final GithubStatRepository githubStatRepository;
    private final ProgrammersStatRepository programmersStatRepository;

    public GithubSyncService(UserRepository userRepository,
                             GithubStatRepository githubStatRepository,
                             ProgrammersStatRepository programmersStatRepository) {
        this.userRepository = userRepository;
        this.githubStatRepository = githubStatRepository;
        this.programmersStatRepository = programmersStatRepository;
    }

    public GithubSetupResponse setupAccount(GithubSetupRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setGithubUsername(request.getGithubUsername());
        user.setProgrammersRepo(request.getProgrammersRepo());
        userRepository.save(user);
        return new GithubSetupResponse(true, "GitHub 계정이 설정되었습니다.");
    }

    public GithubStatResponse getGithubStat(Long userId) {
        return githubStatRepository.findByUserId(userId)
                .map(GithubStatResponse::new)
                .orElse(null);
    }

    public ProgrammersStatResponse getProgrammersStat(Long userId) {
        return programmersStatRepository.findByUserId(userId)
                .map(ProgrammersStatResponse::new)
                .orElse(null);
    }

    public SyncResponse syncAll(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getGithubUsername() == null) {
            return new SyncResponse(false, "GitHub 계정이 설정되지 않았습니다.");
        }

        Optional<GithubStat> githubStatOpt = githubStatRepository.findByUserId(userId);
        if (githubStatOpt.isPresent()) {
            GithubStat stat = githubStatOpt.get();
            stat.setUpdatedAt(LocalDateTime.now());
            githubStatRepository.save(stat);
        } else {
            GithubStat stat = new GithubStat();
            stat.setUser(user);
            stat.setUpdatedAt(LocalDateTime.now());
            githubStatRepository.save(stat);
        }

        Optional<ProgrammersStat> programmersStatOpt = programmersStatRepository.findByUserId(userId);
        if (programmersStatOpt.isPresent()) {
            ProgrammersStat stat = programmersStatOpt.get();
            stat.setUpdatedAt(LocalDateTime.now());
            programmersStatRepository.save(stat);
        } else {
            ProgrammersStat stat = new ProgrammersStat();
            stat.setUser(user);
            stat.setUpdatedAt(LocalDateTime.now());
            programmersStatRepository.save(stat);
        }

        return new SyncResponse(true, "동기화가 완료되었습니다.");
    }
}
