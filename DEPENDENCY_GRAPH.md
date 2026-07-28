# Ацикличный граф зависимостей (DAG)

## Backend — Полная архитектура

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        СЛОЙ 1: ENUMS (чистый)                          │
│                                                                         │
│   ┌──────────────────┐          ┌──────────────────┐                   │
│   │  ScooterStatus   │          │   RentalStatus   │                   │
│   │  (available,     │          │  (active,        │                   │
│   │   in_use,        │          │   completed)     │                   │
│   │   maintenance,   │          │                  │                   │
│   │   offline)       │          │                  │                   │
│   └──────────────────┘          └──────────────────┘                   │
└─────────────────────────────────────────────────────────────────────────┘
            │                              │
            ▼                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       СЛОЙ 2: DTO + EXCEPTIONS                         │
│                                                                         │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │
│   │   ScooterData    │  │   RentalData     │  │  DashboardData   │    │
│   │  → ScooterStatus │  │  → RentalStatus  │  │  (чистый)        │    │
│   └──────────────────┘  └──────────────────┘  └──────────────────┘    │
│                                                                         │
│   ┌──────────────────────────────┐  ┌──────────────────────────────┐   │
│   │ CannotCompleteRentalException│  │         Handler              │   │
│   │    → RuntimeException        │  │   → CannotCompleteRental...  │   │
│   └──────────────────────────────┘  └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
            │                              │
            ▼                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        СЛОЙ 3: MODELS                                   │
│                                                                         │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │
│   │      User        │  │     Scooter      │  │      Rental      │    │
│   │  → UserFactory   │  │  → ScooterStatus │  │  → RentalStatus  │    │
│   │  → Rental (HasMany)│ │  → ScooterFactory│  │  → RentalFactory │    │
│   │                  │  │  → Rental (HasMany)│ │  → User (BelongsTo)│   │
│   │                  │  │                  │  │  → Scooter (BelongsTo)│ │
│   └──────────────────┘  └──────────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
            │                              │
            ▼                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  СЛОЙ 4: REQUESTS + RESOURCES + POLICIES                │
│                                                                         │
│  ┌─────────────────────┐    ┌─────────────────────┐                    │
│  │    Requests         │    │    Resources         │                   │
│  │                     │    │                      │                   │
│  │ StoreScooterRequest │    │ ScooterResource      │                   │
│  │  → ScooterStatus    │    │  → Scooter           │                   │
│  │                     │    │                      │                   │
│  │ UpdateScooterRequest│    │ RentalResource       │                   │
│  │  → ScooterStatus    │    │  → Rental            │                   │
│  │                     │    │  → UserResource      │                   │
│  │ StoreRentalRequest  │    │  → ScooterResource   │                   │
│  │  → Scooter (Model)  │    │                      │                   │
│  │                     │    │ UserResource         │                   │
│  │ ScooterFilterRequest│    │  (чистый)            │                   │
│  │  → ScooterStatus    │    │                      │                   │
│  │                     │    │ DashboardResource    │                   │
│  │ RentalFilterRequest │    │  → DashboardData     │                   │
│  │  → RentalStatus     │    │                      │                   │
│  │                     │    │ PaginatedResource    │                   │
│  └─────────────────────┘    │  (чистый)            │                   │
│                              └─────────────────────┘                   │
│  ┌─────────────────────┐                                               │
│  │    Policies         │                                               │
│  │  ScooterPolicy      │                                               │
│  │   → User            │                                               │
│  │  RentalPolicy       │                                               │
│  │   → User            │                                               │
│  └─────────────────────┘                                               │
└─────────────────────────────────────────────────────────────────────────┘
            │                              │
            ▼                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         СЛОЙ 5: SERVICES                               │
│                                                                         │
│   ┌──────────────────────────────┐  ┌──────────────────────────────┐   │
│   │       ScooterService         │  │        RentalService          │   │
│   │  → DashboardData             │  │  → RentalData                │   │
│   │  → ScooterData               │  │  → RentalStatus              │   │
│   │  → ScooterStatus             │  │  → ScooterStatus             │   │
│   │  → ScooterFilterRequest      │  │  → CannotCompleteRental...   │   │
│   │  → Rental (Model)            │  │  → RentalFilterRequest       │   │
│   │  → Scooter (Model)           │  │  → Rental (Model)            │   │
│   │                              │  │  → Scooter (Model)           │   │
│   └──────────────────────────────┘  └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
            │                              │
            ▼                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       СЛОЙ 6: CONTROLLERS                              │
│                                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌───────────────┐  │
│  │  ScooterController  │  │   RentalController   │  │ Dashboard     │  │
│  │  → ScooterService   │  │   → RentalService    │  │ Controller    │  │
│  │  → ScooterData      │  │   → RentalData       │  │ → ScooterSvce │  │
│  │  → ScooterFilterReq │  │   → RentalFilterReq  │  │ → DashResource│  │
│  │  → StoreScooterReq  │  │   → StoreRentalReq   │  └───────────────┘  │
│  │  → UpdateScooterReq │  │   → PaginatedResource│                     │
│  │  → PaginatedResource│  │   → RentalResource   │                     │
│  │  → ScooterResource  │  │   → Rental (Model)   │                     │
│  │  → Scooter (Model)  │  │                      │                     │
│  └─────────────────────┘  └─────────────────────┘                     │
└─────────────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      СЛОЙ 7: PROVIDERS                                 │
│                                                                         │
│   ┌──────────────────────────────┐                                     │
│   │      AppServiceProvider      │                                     │
│   │  → Handler (Exception)       │                                     │
│   └──────────────────────────────┘                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

## Направления зависимостей (стрелки)

```
Enums ──────────► DTO
Enums ──────────► Models
Enums ──────────► Requests
DTO   ──────────► Resources
DTO   ──────────► Services
Models ─────────► Requests
Models ─────────► Resources
Models ─────────► Services
Models ─────────► Policies
Requests ───────► Controllers
Resources ──────► Controllers
Services ───────► Controllers
Exceptions ─────► Services
Exceptions ─────► Providers
```

## Проверка циклов

| Проверка | Результат |
|----------|-----------|
| Models → Models | ✅ Нет цикла (relationship = lazy loading, не import) |
| Services → Models | ✅ Нет обратной зависимости |
| Controllers → Services | ✅ Нет обратной зависимости |
| Resources → Models | ✅ Нет обратной зависимости |
| Requests → Models | ✅ Нет обратной зависимости |
| Exceptions → Services | ✅ Services → Exceptions, не наоборот |

## Вывод

**Граф ацикличный (DAG).** Все зависимости текут строго сверху вниз по архитектурным слоям:

```
Enums → DTO → Models → Requests/Resources/Services → Controllers → Providers
```

Нет ни одного случая, когда нижний слой зависит от верхнего. Это соответствует принципам:
- **Dependency Inversion Principle (DIP)**
- **Clean Architecture**
- **Layered Architecture**
