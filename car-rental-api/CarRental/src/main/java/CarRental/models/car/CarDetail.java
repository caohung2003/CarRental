package CarRental.models.car;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldNameConstants;

@FieldNameConstants
@Entity
@Table(name = "car_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class CarDetail {
    @Id
    @Column(name = "car_id")
    private long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "car_id")
    private CarBasic car;

    @Column(name = "mileage")
    private Integer mileage;

    @Column(name = "fuel_consumption")
    private Integer fuelConsumption;

    @Lob
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "front_image_key")
    private String frontImageKey;

    @Column(name = "back_image_key")
    private String backImageKey;

    @Column(name = "left_image_key")
    private String leftImageKey;

    @Column(name = "right_image_key")
    private String rightImageKey;
    


}
