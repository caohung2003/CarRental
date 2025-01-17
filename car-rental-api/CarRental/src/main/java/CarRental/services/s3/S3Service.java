package CarRental.services.s3;

import java.io.File;
import java.io.InputStream;

import com.amazonaws.AmazonServiceException;


public interface S3Service {

    public void uploadFile(String bucketName, String key, File file) throws AmazonServiceException;

    public void uploadStream(String bucketName, String key, InputStream inputStream, long contentLength, String contentType) throws AmazonServiceException;

    public InputStream downloadFile(String bucketName, String key) throws AmazonServiceException;

    public String getFileUrl(String bucketName, String key);

    public void deleteFile(String bucketName, String key) throws AmazonServiceException;
}
