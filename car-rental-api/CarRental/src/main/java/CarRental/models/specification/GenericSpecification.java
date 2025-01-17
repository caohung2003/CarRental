package CarRental.models.specification;

import CarRental.dto.search.SearchRequest;
import CarRental.models.booking.Booking;
import CarRental.models.brand.BrandModel;
import CarRental.models.brand.Brand;
import CarRental.models.car.CarBasic;
import CarRental.models.car.CarBusyCalendar;
import CarRental.models.car.CarLocation;
import CarRental.models.car.CarPricing;
import CarRental.models.user.User;
import jakarta.persistence.criteria.*;
import lombok.extern.java.Log;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Log
public class GenericSpecification<T> implements Specification<T> {
    private SearchRequest searchRequest;

    public User user;

    private CarBasic carBasic;

    public GenericSpecification(SearchRequest searchRequest) {
        this.searchRequest = searchRequest;
    }

    public GenericSpecification(SearchRequest searchRequest, User user) {
        this.searchRequest = searchRequest;
        this.user = user;
    }

    public GenericSpecification(CarBasic carBasic) {
        this.carBasic = carBasic;
    }

    @SuppressWarnings({ "unchecked" })
    @Override
    public Predicate toPredicate(Root root, CriteriaQuery query, CriteriaBuilder criteriaBuilder) {
        // query.distinct(true);
        Predicate predicate = criteriaBuilder.conjunction();
        String pick = "", drop = "";
        double lat = 0, lng = 0;
        // searchcar
        if (searchRequest != null) {
            if ("car".equals(searchRequest.type)) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.join(CarLocation.Fields.car).get(CarBasic.Fields.status),
                                ("AVAILABLE")));
                for (var filter : searchRequest.getFilters()) {
                    log.info(filter.getField());
                    if (filter.getValue() != null) {
                        for (int i = 0; i < filter.getValue().size(); i++) {
                            log.info(filter.getValue().get(i));
                        }
                    } else {
                        log.info("NULL");
                    }
                    if (filter.getField().equals("lat")) {
                        if (filter.getValue() != null) {
                            if (!"0".equals(filter.getValue().get(0))) {
                                lat = Double.parseDouble(filter.getValue().get(0));
                            }
                        }
                    }
                    if (filter.getField().equals("lng")) {
                        if (filter.getValue() != null) {
                            if (!"0".equals(filter.getValue().get(0))) {
                                lng = Double.parseDouble(filter.getValue().get(0));
                                if (lat != 0 && lng != 0) {
                                    Expression<Double> a = criteriaBuilder.prod(
                                            criteriaBuilder.diff(root.get(CarLocation.Fields.lat), lat),
                                            criteriaBuilder.diff(root.get(CarLocation.Fields.lat), lat));
                                    Expression<Double> b = criteriaBuilder.prod(
                                            criteriaBuilder.diff(root.get(CarLocation.Fields.lng), lng),
                                            criteriaBuilder.diff(root.get(CarLocation.Fields.lng), lng));
                                    Expression<Double> c = criteriaBuilder.sum(a, b);
                                    Expression<Double> d = criteriaBuilder.prod(
                                            criteriaBuilder.sqrt(c),
                                            100.0);
                                    predicate = criteriaBuilder.and(
                                            predicate,
                                            criteriaBuilder.lessThanOrEqualTo(d, 10.0));
                                }
                            }
                        }
                    } else if (filter.getField().equals("price")) {
                        if (filter.getValue() != null) {
                            if (filter.getOperator().equals("greater")) {
                                predicate = criteriaBuilder.and(
                                        predicate,
                                        criteriaBuilder.greaterThanOrEqualTo(
                                                root
                                                        .join(CarLocation.Fields.car)
                                                        .join(CarBasic.Fields.carPricingEntity)
                                                        .get(CarPricing.Fields.basePrice),
                                                Integer.parseInt(filter.getValue().get(0))));
                            } else if (filter.getOperator().equals("less")) {
                                predicate = criteriaBuilder.and(
                                        predicate,
                                        criteriaBuilder.lessThanOrEqualTo(
                                                root
                                                        .join(CarLocation.Fields.car)
                                                        .join(CarBasic.Fields.carPricingEntity)
                                                        .get(CarPricing.Fields.basePrice),
                                                Integer.parseInt(filter.getValue().get(0))));
                            }
                        }
                    } else if (filter.getField().equals("brand")) {
                        if (filter.getValue() != null) {
                            predicate = criteriaBuilder.and(
                                    predicate,
                                    root
                                            .join(CarLocation.Fields.car)
                                            .join(CarBasic.Fields.brandModel)
                                            .join(BrandModel.Fields.brand)
                                            .get(Brand.Fields.id)
                                            .in(filter.getValue()));
                        }
                    } else if (filter.getField().equals("transmission")) {
                        if (filter.getValue() != null) {
                            predicate = criteriaBuilder.and(
                                    predicate,
                                    root
                                            .join(CarLocation.Fields.car)
                                            .get(CarBasic.Fields.transmission)
                                            .in(filter.getValue()));
                        }
                    } else if (filter.getField().equals("fuel")) {
                        if (filter.getValue() != null) {
                            predicate = criteriaBuilder.and(
                                    predicate,
                                    root
                                            .join(CarLocation.Fields.car)
                                            .get(CarBasic.Fields.fuel)
                                            .in(filter.getValue()));
                        }
                    } else if (filter.getField().equals("seat")) {
                        if (filter.getValue() != null) {
                            if (filter.getOperator().equals("")) {
                                predicate = criteriaBuilder.and(
                                        predicate,
                                        root
                                                .join(CarLocation.Fields.car)
                                                .get(CarBasic.Fields.noSeat)
                                                .in(filter.getValue()));
                            } else if (filter.getOperator().equals("greater")) {
                                predicate = criteriaBuilder.and(
                                        predicate,
                                        criteriaBuilder.greaterThanOrEqualTo(
                                                root
                                                        .join(CarLocation.Fields.car)
                                                        .get(CarBasic.Fields.noSeat),
                                                filter.getValue().get(0)));
                            }
                        }

                    } else if (filter.getField().equals("time")) {
                        if (filter.getValue() != null) {
                            if (filter.getOperator().equals("pick")) {
                                pick = filter.getValue().get(0);
                                log.info("pick " + pick);
                                LocalDateTime dateTime = LocalDateTime.parse(pick);
                                Path<LocalDateTime> start = root
                                        .join(CarLocation.Fields.car)
                                        .get(CarBasic.Fields.startRent);
                                predicate = criteriaBuilder.and(
                                        predicate,
                                        criteriaBuilder.lessThanOrEqualTo(start, dateTime));
                            } else if (filter.getOperator().equals("drop")) {
                                drop = filter.getValue().get(0);
                                log.info("drop " + drop);
                                LocalDateTime dateTime = LocalDateTime.parse(drop);
                                Path<LocalDateTime> end = root
                                        .join(CarLocation.Fields.car)
                                        .get(CarBasic.Fields.endRent);
                                predicate = criteriaBuilder.and(
                                        predicate,
                                        criteriaBuilder.greaterThanOrEqualTo(end, dateTime));
                            }
                        }
                    }
                    if (!pick.equals("") && !drop.equals("")) {
                        Subquery<Long> subquery = query.subquery(Long.class);
                        Root<CarBusyCalendar> subRoot = subquery.from(CarBusyCalendar.class);
                        Path<LocalDateTime> start = subRoot.get(CarBusyCalendar.Fields.start);
                        Path<LocalDateTime> end = subRoot.get(CarBusyCalendar.Fields.end);
                        LocalDateTime pickTime = LocalDateTime.parse(pick);
                        LocalDateTime dropTime = LocalDateTime.parse(drop);
                        subquery.select(subRoot.join(CarBusyCalendar.Fields.car).get(CarBasic.Fields.id));
                        // nguoi dung chon thoi gian don' nam` giua 1 khoang ban
                        Predicate betweenPick = criteriaBuilder.and(
                                criteriaBuilder.lessThanOrEqualTo(start, pickTime),
                                criteriaBuilder.greaterThanOrEqualTo(end, pickTime));
                        // nguoi dung chon thoi gian don co chua 1 khoang ban
                        Predicate betweenBusy = criteriaBuilder.and(
                                criteriaBuilder.greaterThanOrEqualTo(start, pickTime),
                                criteriaBuilder.and(criteriaBuilder.lessThanOrEqualTo(start, dropTime)));
                        subquery.where(
                                criteriaBuilder.or(
                                        criteriaBuilder.and(betweenBusy),
                                        criteriaBuilder.and(betweenPick)
                                // nguoi dung chon thoi gian don' nam` giua 1 khoang ban
                                // criteriaBuilder.and(criteriaBuilder.lessThan(start, pickTime),
                                // criteriaBuilder.greaterThanOrEqualTo(end, pickTime)),
                                // nguoi dung chon thoi gian don co chua 1 khoang ban
                                // criteriaBuilder.and(criteriaBuilder.greaterThanOrEqualTo(start, pickTime),
                                // criteriaBuilder.lessThanOrEqualTo(end, dropTime))
                                ));
                        predicate = criteriaBuilder.and(
                                predicate,
                                criteriaBuilder.not(
                                        root.join(CarLocation.Fields.car).get(CarBasic.Fields.id).in(subquery)));
                    }

                }

                if (searchRequest.getSort() != null) {
                    List<CarRental.dto.search.Sort> list = searchRequest.getSort();
                    List<Order> orders = new ArrayList<>();
                    for (int i = 0; i < list.size(); i++) {
                        if (list.get(i).getName().equals("ratings")) {
                            orders.add(list.get(i).getOrder().equals("asc")
                                    ? criteriaBuilder.asc(root.get(CarLocation.Fields.car).get(CarBasic.Fields.rating))
                                    : criteriaBuilder
                                            .desc(root.get(CarLocation.Fields.car).get(CarBasic.Fields.rating)));
                        } else if (list.get(i).getName().equals("rides")) {
                            orders.add(list.get(i).getOrder().equals("asc")
                                    ? criteriaBuilder.asc(root.get(CarLocation.Fields.car).get(CarBasic.Fields.noRides))
                                    : criteriaBuilder
                                            .desc(root.get(CarLocation.Fields.car).get(CarBasic.Fields.noRides)));
                        } else if (list.get(i).getName().equals("price")) {
                            orders.add(list.get(i).getOrder().equals("asc")
                                    ? criteriaBuilder.asc(root.get(CarLocation.Fields.car)
                                            .get(CarBasic.Fields.carPricingEntity).get(CarPricing.Fields.basePrice))
                                    : criteriaBuilder.desc(root.get(CarLocation.Fields.car)
                                            .get(CarBasic.Fields.carPricingEntity).get(CarPricing.Fields.basePrice)));
                        } else if (list.get(i).getName().equals("production")) {
                            orders.add(list.get(i).getOrder().equals("asc")
                                    ? criteriaBuilder
                                            .asc(root.get(CarLocation.Fields.car).get(CarBasic.Fields.yearProduction))
                                    : criteriaBuilder.desc(
                                            root.get(CarLocation.Fields.car).get(CarBasic.Fields.yearProduction)));
                        } else if (list.get(i).getName().equals("distance")) {
                            if (lat != 0 && lng != 0) {
                                Expression<Double> a = criteriaBuilder.prod(
                                        criteriaBuilder.diff(root.get(CarLocation.Fields.lat), lat),
                                        criteriaBuilder.diff(root.get(CarLocation.Fields.lat), lat));
                                Expression<Double> b = criteriaBuilder.prod(
                                        criteriaBuilder.diff(root.get(CarLocation.Fields.lng), lng),
                                        criteriaBuilder.diff(root.get(CarLocation.Fields.lng), lng));
                                Expression<Double> c = criteriaBuilder.sum(a, b);
                                Expression<Double> d = criteriaBuilder.prod(
                                        criteriaBuilder.sqrt(c),
                                        100.0);
                                orders.add(list.get(i).getOrder().equals("asc")
                                        ? criteriaBuilder.asc(d)
                                        : criteriaBuilder.desc(d));
                            }

                        }

                    }
                    query.orderBy(orders);
                }
            } else if ("booking".equals(searchRequest.type)) {
                List<String> status = new ArrayList<>();
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(
                                root.join(Booking.Fields.car).join(CarBasic.Fields.owner).get(User.Fields.id),
                                user.getId()));
                for (int i = 0; i < searchRequest.getFilters().size(); i++) {
                    var filter = searchRequest.getFilters().get(i);
                    if (filter.getField().equals("car")) {
                        if (filter.getValue().size() > 0) {
                            predicate = criteriaBuilder.and(
                                    predicate,
                                    criteriaBuilder.equal(root.join(Booking.Fields.car).get(CarBasic.Fields.id),
                                            filter.getValue().get(0)));
                        }
                    } else if (filter.getField().equals("status")) {
                        if (!filter.getValue().isEmpty()) {
                            log.info(filter.getValue().toString());
                            Predicate preStatus = criteriaBuilder.or(
                                    criteriaBuilder.equal(root.get(Booking.Fields.status), filter.getValue().get(0)));
                            for (int j = 1; j < filter.getValue().size(); j++) {
                                preStatus = criteriaBuilder.or(preStatus, criteriaBuilder
                                        .equal(root.get(Booking.Fields.status), filter.getValue().get(j)));
                            }
                            predicate = criteriaBuilder.and(predicate, preStatus);
                        }

                    } else if (filter.getField().equals("payment")) {
                        if (filter.getValue().size() > 0) {
                            predicate = criteriaBuilder.and(
                                    predicate,
                                    criteriaBuilder.equal(root.get(Booking.Fields.paymentType),
                                            filter.getValue().get(0)));
                        }
                    }
                }
                if (searchRequest.getSort() != null) {
                    if (searchRequest.getSort().isEmpty()) {
                        query.orderBy(criteriaBuilder.desc(root.get(Booking.Fields.createdAt)));
                    }
                    for (int i = 0; i < searchRequest.getSort().size(); i++) {
                        var sort = searchRequest.getSort().get(i).getName();
                        var order = searchRequest.getSort().get(i).getOrder();
                        log.info(sort + " " + order);
                        if (sort.equals("duration")) {
                            query.orderBy(
                                    order.equals("asc") ? criteriaBuilder.asc(root.get(Booking.Fields.numberOfDays))
                                            : criteriaBuilder.desc(root.get(Booking.Fields.numberOfDays)),
                                    criteriaBuilder.asc(root.get(Booking.Fields.id)));
                        } else if (sort.equals("price")) {
                            query.orderBy(
                                    order.equals("asc") ? criteriaBuilder.asc(root.get(Booking.Fields.total))
                                            : criteriaBuilder.desc(root.get(Booking.Fields.total)),
                                    criteriaBuilder.asc(root.get(Booking.Fields.id)));
                        } else if (sort.equals("time")) {
                            query.orderBy(
                                    order.equals("asc") ? criteriaBuilder.asc(root.get(Booking.Fields.pickUpAt))
                                            : criteriaBuilder.desc(root.get(Booking.Fields.pickUpAt)),
                                    criteriaBuilder.asc(root.get(Booking.Fields.id)));
                        } else if (sort.equals("rating")) {
                            query.orderBy(
                                    order.equals("asc") ? criteriaBuilder.asc(root.get(Booking.Fields.ratings))
                                            : criteriaBuilder.desc(root.get(Booking.Fields.ratings)),
                                    criteriaBuilder.asc(root.get(Booking.Fields.id)));
                        }
                    }
                } else {
                    query.orderBy(criteriaBuilder.desc(root.get(Booking.Fields.createdAt)),
                            criteriaBuilder.asc(root.get(Booking.Fields.id)));
                }
            }
        }
        return predicate;

    }

}
