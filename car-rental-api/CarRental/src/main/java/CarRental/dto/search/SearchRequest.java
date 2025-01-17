package CarRental.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchRequest {
    public Pagination pagination;
    public List<Filter> filters;
    public List<Sort> sort;
    public String type;
    //public String keyword;
}
