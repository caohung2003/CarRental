package CarRental.controllers.image;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import CarRental.services.image.ImageService;
import lombok.RequiredArgsConstructor;


@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/image")
public class ImageController {
    private final ImageService imageService;

    @PostMapping("/upload/{name}")
    public ResponseEntity<Void> uploadImage(@RequestParam("file") MultipartFile file, @PathVariable String name) throws IOException {
        imageService.uploadImage(file, name);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{key}")
    public ResponseEntity<byte[]> downloadImage(@PathVariable("key") String key) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "image/jpeg");
        return ResponseEntity.ok().headers(headers).body(imageService.downloadImage(key).readAllBytes());
    }

    @GetMapping("/url/{key}")
    public ResponseEntity<String> getImgUrl(@PathVariable("key") String key) {
        return ResponseEntity.ok(imageService.getDirectImgUrl(key));
    }
    
    
}
