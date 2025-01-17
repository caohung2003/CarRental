package CarRental.services.image;

import java.io.File;

import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonServiceException;

public interface ImageService {

    public void uploadImage(MultipartFile file, String key) throws AmazonServiceException;

    public void uploadImage(String key, File file) throws AmazonServiceException;

    public void uploadImage(String key, InputStream inputStream, long contentLength, String contentType) throws AmazonServiceException;

    public InputStream downloadImage(String key) throws AmazonServiceException;

    public String getImgUrl(String key);

    public String getDirectImgUrl(String key);

    public void deleteImage(String key) throws AmazonServiceException;

}
