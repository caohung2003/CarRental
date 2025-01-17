package CarRental.service.image;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ContextConfiguration;

import CarRental.services.image.impl.ImageServiceImpl;
import CarRental.services.s3.S3Service;

@SpringBootTest()
@ContextConfiguration()
class ImageServiceImplTest {

    @Mock
    private S3Service s3Service;

    @Value("${application.aws.s3.buckets.dev}")
    private String bucketName;

    @Value("${application.url.base}")
    private String baseUrl;

    private ImageServiceImpl imageService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        imageService = new ImageServiceImpl(s3Service); 
    }

    @Test
    void uploadImage_withFile_callsS3ServiceUploadFile() throws IOException {
        // Arrange
        String key = "image.jpg";
        File file = new File("path/to/image.jpg");

        // Act
        imageService.uploadImage(key, file);

        // Assert
        verify(s3Service).uploadFile(eq(bucketName), eq(key), eq(file));
    }

    @Test
    void uploadImage_withInputStream_callsS3ServiceUploadStream() throws IOException {
        // Arrange
        String key = "image.jpg";
        InputStream inputStream = mock(InputStream.class);
        long contentLength = 100;
        String contentType = "image/jpeg";

        // Act
        imageService.uploadImage(key, inputStream, contentLength, contentType);

        // Assert
        verify(s3Service).uploadStream(eq(bucketName), eq(key), eq(inputStream), eq(contentLength), eq(contentType));
    }

    @Test
    void uploadImage_withMultipartFile_callsS3ServiceUploadStream() throws IOException {
        // Arrange
        String key = "image.jpg";
        MockMultipartFile multipartFile = new MockMultipartFile("file", "image.jpg", "image/jpeg", new byte[100]);

        // Act
        imageService.uploadImage(multipartFile, key);

        // Assert
        verify(s3Service).uploadStream(eq(bucketName), eq(key), any(InputStream.class), eq(multipartFile.getSize()), eq(multipartFile.getContentType()));
    }

    @Test
    void deleteImage_callsS3ServiceDeleteFile() {
        // Arrange
        String key = "image.jpg";

        // Act
        imageService.deleteImage(key);

        // Assert
        verify(s3Service).deleteFile(eq(bucketName), eq(key));
    }

    @Test
    void downloadImage_callsS3ServiceDownloadFile() {
        // Arrange
        String key = "image.jpg";

        // Act
        imageService.downloadImage(key);

        // Assert
        verify(s3Service).downloadFile(eq(bucketName), eq(key));
    }

    @Test
    public void testGetImgUrl() {
        String key = "image123.jpg";
        String expectedUrl = "http://example.com/api/v1/image/image123.jpg";
        
        String imgUrl = imageService.getImgUrl(key);
        assertNotNull(baseUrl);
        Assertions.assertEquals(expectedUrl, imgUrl);
    }
}