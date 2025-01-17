package CarRental.config;

import java.util.concurrent.TimeUnit;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.github.benmanes.caffeine.cache.Caffeine;

@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public Caffeine<Object, Object> shortLivedCaffeineConfig() {
        return Caffeine.newBuilder()
                .initialCapacity(1000)
                .maximumSize(5000)
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .recordStats();
    }

    @Bean
    public Caffeine<Object, Object> longLivedCaffeineConfig() {
        return Caffeine.newBuilder()
                .initialCapacity(10)
                .maximumSize(50)
                .expireAfterWrite(60, TimeUnit.MINUTES)
                .recordStats();
    }

    @Bean
    @Primary
    public CacheManager shortTimeCacheManager(Caffeine<Object, Object> shortLivedCaffeineConfig) {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("searchCar", "districts", "wards");
        cacheManager.setCaffeine(shortLivedCaffeineConfig);
        return cacheManager;
    }

    @Bean
    public CacheManager longTimeCacheManager(Caffeine<Object, Object> longLivedCaffeineConfig) {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("countCarByCity", "cities", "featureCars");
        cacheManager.setCaffeine(longLivedCaffeineConfig);
        return cacheManager;
    }

}
