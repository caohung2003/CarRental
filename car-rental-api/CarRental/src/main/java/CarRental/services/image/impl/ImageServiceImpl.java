package CarRental.services.image.impl;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonServiceException;

import CarRental.services.image.ImageService;
import CarRental.services.s3.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class ImageServiceImpl implements ImageService {

    @Value("${application.aws.s3.buckets.dev}")
    private String bucketName;

    @Value("${application.url.base}")
    private String baseUrl;

    private final S3Service s3Service;

    @Override
    public void uploadImage(String key, File file) throws AmazonServiceException {
        s3Service.uploadFile(bucketName, key, file);
    }

    @Override
    public void uploadImage(String key, InputStream inputStream, long contentLength,
            String contentType) throws AmazonServiceException {
        s3Service.uploadStream(bucketName, key, inputStream, contentLength, contentType);
    }
    @Override
    public void uploadImage(MultipartFile file, String key) {
        try {
            // Convert MultipartFile to BufferedImage
            BufferedImage bufferedImage = ImageIO.read(file.getInputStream());

            BufferedImage convertedImage = removeAlpha(bufferedImage);

            // Write the BufferedImage to a ByteArrayOutputStream as PNG
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(convertedImage, "JPEG", outputStream);

            // Convert the ByteArrayOutputStream to an InputStream
            InputStream inputStream = new ByteArrayInputStream(outputStream.toByteArray());

            // Upload the JPEG image
            uploadImage((key + ".jpeg"), inputStream, outputStream.size(), "image/jpg");
        } catch (IOException e) {
            log.error("Error uploading image: {}", e.getMessage());
        }
    }

    private BufferedImage removeAlpha(BufferedImage image) {
        // Kiểm tra xem hình ảnh có kênh alpha không
        if (image.getColorModel().hasAlpha()) {
            // Tạo một BufferedImage mới không có kênh alpha
            BufferedImage opaqueImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);

            // Sao chép hình ảnh ban đầu vào hình ảnh mới không có kênh alpha
            Graphics2D g = opaqueImage.createGraphics();
            g.drawImage(image, 0, 0, null);
            g.dispose();

            return opaqueImage;
        } else {
            // Trả về hình ảnh ban đầu nếu không có kênh alpha
            return image;
        }
    }

    @Override
    public void deleteImage(String key) throws AmazonServiceException {
        s3Service.deleteFile(bucketName, key);
    }

    @Override
    public InputStream downloadImage(String key) throws AmazonServiceException {
        return s3Service.downloadFile(bucketName, key + ".jpeg");
    }

    @Override
    public String getImgUrl(String key) {
        /* var url = baseUrl + "/api/v1/image/" + key; */
        return key == null ? null : baseUrl + "/api/v1/image/" + key;
    }

    @Override
    public String getDirectImgUrl(String key) {
        return s3Service.getFileUrl(bucketName, key);
    }

}