package CarRental.utils.annotation;


import java.time.LocalDate;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ValidDateValidator implements ConstraintValidator<ValidDate, LocalDate> {

    private LocalDate minDate;
    private LocalDate maxDate;
    private String messageMin;
    private String messageMax;

    @Override
    public void initialize(ValidDate constraintAnnotation) {
        minDate = LocalDate.parse(constraintAnnotation.min());
        maxDate = LocalDate.parse(constraintAnnotation.max());
        messageMin = constraintAnnotation.messageMin();
        messageMax = constraintAnnotation.messageMax();
    }

    @Override
    public boolean isValid(LocalDate value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // Let @NotEmpty handle null values
        }
        
        if (value.isBefore(minDate)) {
            context.buildConstraintViolationWithTemplate(messageMin).addConstraintViolation();
            return false;
        }
        
        if (value.isAfter(maxDate)) {
            context.buildConstraintViolationWithTemplate(messageMax).addConstraintViolation();
            return false;
        }
        
        return true;
    }
}
