package CarRental.models.user;

public enum Role {
    ADMIN, USER;
    public String getRoleName() {
        return "ROLE_" + name();
    }
    
} 
