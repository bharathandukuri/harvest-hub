package csp.harvest_hub.service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import csp.harvest_hub.enums.ResponseCode;
import csp.harvest_hub.model.File;
import csp.harvest_hub.model.User;
import csp.harvest_hub.repository.FileRepository;
import csp.harvest_hub.repository.UserRepository;
import csp.harvest_hub.security.jwt.JwtUtils;
import csp.harvest_hub.util.ResponseFactory;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Value("${files-directory}")
    private String UPLOAD_DIR;

    @Value("${backend.url}")
    private String BACKEND_URL;

    public ResponseEntity<?> uploadFile(MultipartFile multipartFile, String token) {
        String email = jwtUtils.getEmailFromToken(token);
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseFactory.error(ResponseCode.USER_NOT_FOUND, "User not found.");
        }

        User user = userOpt.get();

        try {
            File file = new File();
            file.setName(multipartFile.getOriginalFilename());
            file.setFileType(multipartFile.getContentType());
            file.setSize(multipartFile.getSize());
            file.setUploadedDateTime(LocalDateTime.now());
            file.setUploadedBy(user);

            file = fileRepository.save(file);

            String extension = getExtension(multipartFile.getOriginalFilename());
            String storedFileName = file.getId() + extension;

            java.io.File outputFile = Paths.get(UPLOAD_DIR, storedFileName).toFile();
            outputFile.getParentFile().mkdirs();

            try (FileOutputStream fos = new FileOutputStream(outputFile)) {
                fos.write(multipartFile.getBytes());
            }

            String url = BACKEND_URL + "/file/" + file.getId();

            return ResponseFactory.success(ResponseCode.FILE_UPLOADED, "File uploaded successfully",
                    Map.of(
                            "fileId", file.getId(),
                            "storedName", storedFileName,
                            "url", url));

        } catch (IOException e) {
            return ResponseFactory.error(ResponseCode.FILE_UPLOAD_FAILED, "File upload failed: " + e.getMessage());
        }
    }

    private String getExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf("."));
        }
        return "";
    }

    public ResponseEntity<?> downloadFile(Long id) {
        Optional<File> fileOpt = fileRepository.findById(id);
        if (fileOpt.isEmpty()) {
            return ResponseFactory.error(ResponseCode.FILE_NOT_FOUND, "File not found.");
        }

        File file = fileOpt.get();
        String extension = getExtension(file.getName());
        java.io.File diskFile = Paths.get(UPLOAD_DIR, file.getId() + extension).toFile();

        if (!diskFile.exists()) {
            return ResponseFactory.error(ResponseCode.FILE_NOT_FOUND, "File not found on disk.");
        }

        try {
            byte[] bytes = Files.readAllBytes(diskFile.toPath());
            return ResponseEntity.ok()
                    .header("Content-Disposition", "inline; filename=\"" + file.getName() + "\"") // ✅ inline instead of
                                                                                                  // attachment
                    .contentType(MediaType.parseMediaType(file.getFileType()))
                    .body(bytes);
        } catch (IOException e) {
            return ResponseFactory.error(ResponseCode.FILE_DOWNLOAD_FAILED, "Error reading file.");
        }
    }
}
