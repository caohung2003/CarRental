package CarRental.services.s3.impl;

import java.io.File;
import java.io.InputStream;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.amazonaws.AmazonServiceException;

import CarRental.services.s3.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3ServiceImpl implements S3Service {

    private final S3Client s3Client;

    @Override
    @Async("s3ServiceTaskExecutor")
    public void uploadStream(String bucketName,
            String key,
            InputStream inputStream,
            long contentLength,
            String contentType) throws AmazonServiceException {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(contentType)
                .contentLength(contentLength)
                .build();
        s3Client.putObject(request, RequestBody.fromInputStream(inputStream, contentLength));
        log.info("Uploaded stream to S3 bucket: {}, key: {}", bucketName, key);
    }

    @Override
    @Async("s3ServiceTaskExecutor")
    public void uploadFile(String bucketName, String key, File file) throws AmazonServiceException {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3Client.putObject(request, file.toPath());
        log.info("Uploaded file to S3 bucket: {}, key: {}", bucketName, key);
    }

    @Override
    public InputStream downloadFile(String bucketName, String key) throws AmazonServiceException {
        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        InputStream file = s3Client.getObject(request);
        log.info("Downloaded file from S3 bucket: {}, key: {}", bucketName, key);
        return file;
    }

    @Override
    public void deleteFile(String bucketName, String key) throws AmazonServiceException {
        DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3Client.deleteObject(request);
        log.info("Deleted file from S3 bucket: {}, key: {}", bucketName, key);
    }

    public String getFileUrl(String bucketName, String key) {
        GetUrlRequest request = GetUrlRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        return s3Client.utilities().getUrl(request).toExternalForm();
    }
}
