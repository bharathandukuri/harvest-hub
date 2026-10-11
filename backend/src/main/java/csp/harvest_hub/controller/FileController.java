package csp.harvest_hub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import csp.harvest_hub.service.FileService;
import lombok.AllArgsConstructor;

@CrossOrigin
@RestController
@RequestMapping("/file")
@AllArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        return fileService.uploadFile(file, token);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> downloadFile(@PathVariable Long id) {
        return fileService.downloadFile(id);
    }
}
