package com.devlearninghub.backend.client;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class GithubApiClient {

    private static final String BASE_URL = "https://api.github.com";
    private final RestTemplate restTemplate;

    public GithubApiClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private HttpEntity<Void> buildRequest() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/vnd.github+json");
        return new HttpEntity<>(headers);
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> fetchRepoCommits(String username, String repo) {
        try {
            String url = BASE_URL + "/repos/" + username + "/" + repo + "/commits?per_page=100";
            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, buildRequest(), List.class);
            return response.getBody() != null ? response.getBody() : Collections.emptyList();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> fetchUserRepos(String username) {
        try {
            String url = BASE_URL + "/users/" + username + "/repos?per_page=100";
            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, buildRequest(), List.class);
            return response.getBody() != null ? response.getBody() : Collections.emptyList();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
