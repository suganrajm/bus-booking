package com.busbooking.backend;

import com.busbooking.model.User;
import com.busbooking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@ComponentScan(basePackages = "com.busbooking")
@EntityScan(basePackages = "com.busbooking.model")
@EnableJpaRepositories(basePackages = "com.busbooking.repository")
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner initAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (!userRepository.existsByEmail("admin@gmail.com")) {
				User admin = new User();
				admin.setName("Admin");
				admin.setEmail("admin@gmail.com");
				admin.setPassword(passwordEncoder.encode("admin@12345"));
				admin.setPhone("0000000000");
				admin.setRole("ROLE_ADMIN");
				userRepository.save(admin);
				System.out.println("Default Admin User created: admin@gmail.com / admin@12345");
			}
		};
	}
}
