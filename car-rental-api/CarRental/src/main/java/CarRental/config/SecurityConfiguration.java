package CarRental.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;

import CarRental.models.user.Role;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {
        // This is a list of public URLs that do not require authentication
        private final String[] publicUrls = {
                        "/api/v1/car-basic/feature-cars/**",
                        "/api/v1/car-basic/get/**",
                        "/api/v1/car-busy/check/time-rent/**",
                        "/api/v1/auth/**",
                        "/api/v1/image/**",
                        "/api/v1/register/**",
                        "/api/v1/location/**",
                        "/api/v1/brand/**",
                        "/api/v1/feature/**",
                        "/api/v1/car-location/search/**",
                        "/api/v1/car-location/get/all/**",
                        "/api/v1/car-location/car-count-by-city/**",
                        "/api/v1/car-location/get/related-car/**",
                        "/api/v1/car-location/get/owner-car/**",
                        "/api/v1/rating/get-renter/**",
                        "/api/v1/rating/get-owner/**",
                        "/api/v1/rating/get/all/by/**",
                        "/api/v1/car-owner-profile/profile/**",
                        "/swagger-resources",
                        "/swagger-resources/**",
                        "/configuration/ui",
                        "/configuration/security",
                        "/swagger-ui/**",
                        "/webjars/**",
                        "/actuator",
                        "/swagger-ui.html"
        };

        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final AuthenticationProvider authenticationProvider;
        private final LogoutHandler logoutHandler;
        private final JwtAccessDeniedHandler accessDeniedHandler;
        private final JwtAuthenticationEntryPoint authenticationEntryPoint;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable())
                                .headers(headers -> headers.xssProtection(
                                                xss -> xss.headerValue(
                                                                XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
                                                .contentSecurityPolicy(
                                                                cps -> cps.policyDirectives("script-src 'self'")))
                                .authorizeHttpRequests(req -> req
                                                .requestMatchers(publicUrls).permitAll()
                                                .requestMatchers("/api/v1/admin/**")
                                                .hasAnyAuthority(Role.ADMIN.getRoleName())
                                                .requestMatchers("/api/v1/user/**")
                                                .hasAnyAuthority(Role.USER.getRoleName(), Role.ADMIN.getRoleName())
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                                .exceptionHandling(exception -> exception
                                                .accessDeniedHandler(accessDeniedHandler)
                                                .authenticationEntryPoint(authenticationEntryPoint))
                                .logout(logout -> logout
                                                .logoutUrl("/api/v1/auth/logout")
                                                .addLogoutHandler(logoutHandler)
                                                .logoutSuccessHandler(
                                                                (request, response,
                                                                                authentication) -> SecurityContextHolder
                                                                                                .clearContext()));

                return http.build();
        }

}
