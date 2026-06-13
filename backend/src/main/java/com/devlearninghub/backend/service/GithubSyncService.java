package com.devlearninghub.backend.service;

import com.devlearninghub.backend.client.GithubApiClient;
import com.devlearninghub.backend.dto.*;
import com.devlearninghub.backend.entity.ActivityLog;
import com.devlearninghub.backend.entity.GithubStat;
import com.devlearninghub.backend.entity.ProgrammersStat;
import com.devlearninghub.backend.entity.User;
import com.devlearninghub.backend.repository.ActivityLogRepository;
import com.devlearninghub.backend.repository.GithubStatRepository;
import com.devlearninghub.backend.repository.ProgrammersStatRepository;
import com.devlearninghub.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class GithubSyncService {

    private static final String DEV_LEARNING_HUB_REPO = "Dev-Learning-Hub";
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Map<DayOfWeek, String> DAY_NAMES = Map.of(
            DayOfWeek.MONDAY, "월",
            DayOfWeek.TUESDAY, "화",
            DayOfWeek.WEDNESDAY, "수",
            DayOfWeek.THURSDAY, "목",
            DayOfWeek.FRIDAY, "금",
            DayOfWeek.SATURDAY, "토",
            DayOfWeek.SUNDAY, "일"
    );

    private final UserRepository userRepository;
    private final GithubStatRepository githubStatRepository;
    private final ProgrammersStatRepository programmersStatRepository;
    private final ActivityLogRepository activityLogRepository;
    private final GithubApiClient githubApiClient;

    public GithubSyncService(UserRepository userRepository,
                             GithubStatRepository githubStatRepository,
                             ProgrammersStatRepository programmersStatRepository,
                             ActivityLogRepository activityLogRepository,
                             GithubApiClient githubApiClient) {
        this.userRepository = userRepository;
        this.githubStatRepository = githubStatRepository;
        this.programmersStatRepository = programmersStatRepository;
        this.activityLogRepository = activityLogRepository;
        this.githubApiClient = githubApiClient;
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

    public List<ActivityLogResponse> getGithubActivity(Long userId) {
        return activityLogRepository.findByUserIdAndSourceOrderByDateDesc(userId, "GITHUB")
                .stream()
                .limit(5)
                .map(ActivityLogResponse::new)
                .collect(Collectors.toList());
    }

    public List<ActivityLogResponse> getProgrammersActivity(Long userId) {
        return activityLogRepository.findByUserIdAndSourceOrderByDateDesc(userId, "PROGRAMMERS")
                .stream()
                .limit(5)
                .map(ActivityLogResponse::new)
                .collect(Collectors.toList());
    }

    public SyncResponse syncAll(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String githubUsername = user.getGithubUsername();
        String programmersRepo = user.getProgrammersRepo();

        if (githubUsername == null || programmersRepo == null) {
            return new SyncResponse(false, "GitHub 계정이 설정되지 않았습니다.");
        }

        syncGithubStat(user, githubUsername);
        syncProgrammersStat(user, githubUsername, programmersRepo);

        return new SyncResponse(true, "동기화가 완료되었습니다.");
    }

    private void syncGithubStat(User user, String githubUsername) {
        try {
            List<Map<String, Object>> commits = githubApiClient.fetchRepoCommits(githubUsername, DEV_LEARNING_HUB_REPO);
            List<Map<String, Object>> repos = githubApiClient.fetchUserRepos(githubUsername);

            int weeklyCommits = calculateWeeklyCommits(commits);
            int activeRepos = repos.size();
            int streak = calculateStreak(commits);
            String weeklyData = buildWeeklyData(commits);
            String yearlyStat = buildYearlyData(commits);

            GithubStat stat = githubStatRepository.findByUserId(user.getId()).orElseGet(() -> {
                GithubStat s = new GithubStat();
                s.setUser(user);
                return s;
            });
            stat.setWeeklyCommits(weeklyCommits);
            stat.setActiveRepos(activeRepos);
            stat.setStreak(streak);
            stat.setWeeklyData(weeklyData);
            stat.setYearlyStat(yearlyStat);
            stat.setUpdatedAt(LocalDateTime.now());
            githubStatRepository.save(stat);

            saveActivityLogs(user, commits, "GITHUB");
        } catch (Exception e) {
            // GitHub stat 동기화 실패해도 서버 계속 동작
        }
    }

    private void syncProgrammersStat(User user, String githubUsername, String programmersRepo) {
        try {
            List<Map<String, Object>> commits = githubApiClient.fetchRepoCommits(githubUsername, programmersRepo);

            int totalSolved = commits.size();
            int mainLevel = calculateMainLevel(commits);
            String levelDistribution = buildLevelDistribution(commits);
            String yearlyData = buildYearlyData(commits);

            ProgrammersStat stat = programmersStatRepository.findByUserId(user.getId()).orElseGet(() -> {
                ProgrammersStat s = new ProgrammersStat();
                s.setUser(user);
                return s;
            });
            stat.setTotalSolved(totalSolved);
            stat.setMainLevel(mainLevel);
            stat.setLevelDistribution(levelDistribution);
            stat.setYearlyData(yearlyData);
            stat.setUpdatedAt(LocalDateTime.now());
            programmersStatRepository.save(stat);

            saveActivityLogs(user, commits, "PROGRAMMERS");
        } catch (Exception e) {
            // Programmers stat 동기화 실패해도 서버 계속 동작
        }
    }

    // ── 계산 메서드 ───────────────────────────────────────────────────────

    private int calculateWeeklyCommits(List<Map<String, Object>> commits) {
        LocalDate oneWeekAgo = LocalDate.now().minusDays(7);
        return (int) commits.stream()
                .filter(c -> {
                    LocalDate date = extractCommitDate(c);
                    return date != null && !date.isBefore(oneWeekAgo);
                })
                .count();
    }

    private int calculateStreak(List<Map<String, Object>> commits) {
        Set<LocalDate> commitDates = commits.stream()
                .map(this::extractCommitDate)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        LocalDate current = LocalDate.now();
        int streak = 0;
        while (commitDates.contains(current)) {
            streak++;
            current = current.minusDays(1);
        }
        return streak;
    }

    /** {"월":2,"화":0,"수":3,"목":1,"금":0,"토":0,"일":0} */
    private String buildWeeklyData(List<Map<String, Object>> commits) {
        LocalDate oneWeekAgo = LocalDate.now().minusDays(7);
        Map<String, Integer> dayCount = new LinkedHashMap<>();
        List.of("월", "화", "수", "목", "금", "토", "일").forEach(d -> dayCount.put(d, 0));

        for (Map<String, Object> commit : commits) {
            LocalDate date = extractCommitDate(commit);
            if (date == null || date.isBefore(oneWeekAgo)) continue;
            String dayName = DAY_NAMES.getOrDefault(date.getDayOfWeek(), "?");
            dayCount.merge(dayName, 1, Integer::sum);
        }
        try {
            return objectMapper.writeValueAsString(dayCount);
        } catch (Exception e) {
            return "{}";
        }
    }

    /** {"1":5,"2":3,"3":2,"4":0,"5":0} */
    private String buildLevelDistribution(List<Map<String, Object>> commits) {
        Pattern pattern = Pattern.compile("\\[level (\\d+)\\]", Pattern.CASE_INSENSITIVE);
        Map<String, Integer> levelCount = new LinkedHashMap<>();
        for (int i = 0; i <= 5; i++) levelCount.put(String.valueOf(i), 0);

        for (Map<String, Object> commit : commits) {
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> commitObj = (Map<String, Object>) commit.get("commit");
                String message = (String) commitObj.get("message");
                Matcher matcher = pattern.matcher(message);
                if (matcher.find()) {
                    String key = matcher.group(1);
                    if (levelCount.containsKey(key)) {
                        levelCount.merge(key, 1, Integer::sum);
                    }
                }
            } catch (Exception e) {
                // skip
            }
        }
        try {
            return objectMapper.writeValueAsString(levelCount);
        } catch (Exception e) {
            return "{}";
        }
    }

    /** {"2026-01-15":2,"2026-01-16":1,...} */
    private String buildYearlyData(List<Map<String, Object>> commits) {
        Map<String, Integer> dateCount = new TreeMap<>();
        for (Map<String, Object> commit : commits) {
            LocalDate date = extractCommitDate(commit);
            if (date == null) continue;
            dateCount.merge(date.toString(), 1, Integer::sum);
        }
        try {
            return objectMapper.writeValueAsString(dateCount);
        } catch (Exception e) {
            return "{}";
        }
    }

    private int calculateMainLevel(List<Map<String, Object>> commits) {
        Pattern pattern = Pattern.compile("\\[level (\\d+)\\]", Pattern.CASE_INSENSITIVE);
        Map<Integer, Long> levelCount = new HashMap<>();

        for (Map<String, Object> commit : commits) {
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> commitObj = (Map<String, Object>) commit.get("commit");
                String message = (String) commitObj.get("message");
                Matcher matcher = pattern.matcher(message);
                if (matcher.find()) {
                    int level = Integer.parseInt(matcher.group(1));
                    levelCount.merge(level, 1L, Long::sum);
                }
            } catch (Exception e) {
                // skip
            }
        }

        return levelCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(0);
    }

    private void saveActivityLogs(User user, List<Map<String, Object>> commits, String source) {
        List<ActivityLog> existing = activityLogRepository.findByUserIdAndSourceOrderByDateDesc(user.getId(), source);
        activityLogRepository.deleteAll(existing);

        commits.stream()
                .filter(c -> extractCommitDate(c) != null)
                .sorted(Comparator.comparing(
                        (Map<String, Object> c) -> extractCommitDate(c),
                        Comparator.reverseOrder()
                ))
                .limit(5)
                .forEach(c -> {
                    ActivityLog log = new ActivityLog();
                    log.setUser(user);
                    log.setDate(extractCommitDate(c));
                    log.setMessage(extractCommitMessage(c));
                    log.setSource(source);
                    activityLogRepository.save(log);
                });
    }

    @SuppressWarnings("unchecked")
    private String extractCommitMessage(Map<String, Object> commit) {
        try {
            Map<String, Object> commitObj = (Map<String, Object>) commit.get("commit");
            return (String) commitObj.get("message");
        } catch (Exception e) {
            return "";
        }
    }

    @SuppressWarnings("unchecked")
    private LocalDate extractCommitDate(Map<String, Object> commit) {
        try {
            Map<String, Object> commitObj = (Map<String, Object>) commit.get("commit");
            Map<String, Object> authorObj = (Map<String, Object>) commitObj.get("author");
            String dateStr = (String) authorObj.get("date");
            return OffsetDateTime.parse(dateStr).toLocalDate();
        } catch (Exception e) {
            return null;
        }
    }
}
