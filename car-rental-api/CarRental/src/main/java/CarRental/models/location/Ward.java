package CarRental.models.location;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldNameConstants;

@FieldNameConstants
@Entity
@Getter
@Setter
@ToString
@Table(name = "ward", uniqueConstraints = @UniqueConstraint(columnNames = { "city_code", "district_code",
        "ward_code" }))
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "city_code", referencedColumnName = "city_code")
    @JoinColumn(name = "district_code", referencedColumnName = "district_code")
    private District district;

    @Column(name = "ward_name")
    private String wardName;

    @Column(name = "ward_code")
    private String wardCode;

}
