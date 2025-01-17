package CarRental.models.payment;

import CarRental.models.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import lombok.experimental.FieldNameConstants;

import java.math.BigDecimal;
import java.util.List;

@FieldNameConstants
@Entity
@Table(name = "wallet")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Wallet {
    @Id
    @Column(name = "user_id")
    private Long id;

    @MapsId
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "pending_balance")
    @Min(0)
    private BigDecimal pendingBalance;

    @Column(name = "available_balance")
    @Min(0)
    private BigDecimal availableBalance;

    @OneToMany(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, mappedBy = "wallet")
    private List<Transaction> transactions; 
}
