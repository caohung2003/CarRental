package CarRental.models.car;

import CarRental.models.car.enums.PriceMethod;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldNameConstants;

@FieldNameConstants
@Entity
@Table(name = "car_pricing", uniqueConstraints = @UniqueConstraint(columnNames = {"car_id"}))
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")

public class CarPricing {
    @Id
    @Column(name = "car_id")
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "car_id")
    private CarBasic car;

    @Column(name = "base_price")
    private BigDecimal basePrice;

    @Column(name = "required_deposit")
    private BigDecimal requiredDeposit;

    @Column(name = "price_method")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PriceMethod basePriceMethod = PriceMethod.NOT_BONUS_HALF_DAY;

}
