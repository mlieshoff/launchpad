# Testing Standards

## General Principles

- JUnit 5 is the required test framework unless an existing project explicitly requires a different framework.
- AssertJ is mandatory for assertions. Use existing project dependencies where available.
- Tests belong in `src/test/java` and mirror production package names.
- Follow Arrange / Act / Assert. Separate the phases with blank lines where useful.
- Assert observable behavior and outcomes, not implementation details.
- Cover relevant happy paths, boundary conditions, invalid inputs, and error scenarios defined by acceptance criteria.
- Add a regression test for each reproducible bug whenever practical.
- Keep unit tests deterministic and independent of network access, wall-clock time, environment-specific configuration, and external services.
- Prefer lightweight fakes or mocks at external boundaries; avoid overmocking internal logic.
- Do not introduce new testing libraries without approval.
- Never disable, delete, weaken, or silently change tests just to make a build pass.
- Run `./mvnw verify` if the Maven Wrapper exists; otherwise run `mvn verify`. Report exact failures.
- Do not invent coverage percentages or claim coverage without measurement.
- Do not rename or reformat unrelated existing tests solely to enforce these standards.

## Test Naming Convention

All newly created or modified Java test methods MUST follow:

`<methodName>_when<Condition>_then<ExpectedResult>`

### Rules

- `methodName` MUST match the name of the method under test, when there is a single identifiable method.
- `when` MUST describe the relevant input, condition, or scenario.
- `then` MUST describe the expected observable behavior or result.
- Use the production method's camelCase spelling and PascalCase for `Condition` and `ExpectedResult`.
- Names MUST be descriptive and unambiguous.
- Do not use generic names such as `test1`, `shouldWork`, or `testSuccess`.
- For integration scenarios spanning several methods, name the primary entry-point method; if no single method exists, ask for a project-specific naming convention rather than inventing one.

### Valid Examples

```java
@Test
void findById_whenUserExists_thenReturnUser() {
    // ...
}

@Test
void findById_whenUserDoesNotExist_thenReturnEmpty() {
    // ...
}

@Test
void save_whenInputIsInvalid_thenThrowException() {
    // ...
}

@Test
void delete_whenUserExists_thenRemoveUser() {
    // ...
}
```

### Invalid Examples

```java
@Test
void testFindById() {}

@Test
void shouldReturnUser() {}

@Test
void findById_success() {}

@Test
void test1() {}
```

## Assertion Rules

### AssertJ Is Mandatory

- Use AssertJ assertion entry points such as `assertThat`, `assertThatThrownBy`, and `assertThatCode` from `org.assertj.core.api.Assertions`.
- Do not use JUnit assertion methods or mix assertion libraries.
- Prefer fluent, readable AssertJ assertions.
- Use custom assertion helpers for complex, domain-specific verification.

### Exactly One Top-Level Assertion Call per Test

Each test method MUST contain exactly one top-level assertion call. A fluent AssertJ chain counts as one assertion call, even if it performs several checks. A custom assertion helper counts as one top-level assertion call and MAY perform multiple related AssertJ assertions internally.

Valid examples:

```java
assertThat(actual).isEqualTo(expected);
assertThat(actual).isTrue();
assertThat(actual).containsExactly(expected);
assertThatThrownBy(() -> operation()).isInstanceOf(IllegalArgumentException.class);
assertProduct(actual, expected);
```

Do not place multiple independent assertion calls directly inside a test method. Do not add meaningless assertions merely to satisfy the rule. Every test must actually verify the expected behavior.

### Custom Assertion Helpers

- Use descriptive names such as `assertProduct`, `assertUser`, or `assertOrder`.
- Helpers MAY contain multiple AssertJ assertions when they verify one logical result.
- Keep checks cohesive and focused on relevant expected behavior.
- Prefer reusable helpers over duplicated assertion logic, but do not create abstractions for trivial one-off assertions.
- Do not hide mutations, external calls, or unrelated checks inside assertion helpers.
- Assertion helpers must fail when a relevant expectation is not met.

#### Valid — Single AssertJ Assertion

```java
@Test
void calculatePrice_whenDiscountApplied_thenReturnReducedPrice() {
    var actual = service.calculatePrice(100, 10);

    assertThat(actual).isEqualTo(90);
}
```

#### Valid — Custom Assertion Helper

```java
@Test
void findProduct_whenProductExists_thenReturnProduct() {
    var actual = repository.findProduct(42L);
    var expected = new Product(42L, "Example", 19.99);

    assertProduct(actual, expected);
}

private void assertProduct(Product actual, Product expected) {
    assertThat(actual.getId()).isEqualTo(expected.getId());
    assertThat(actual.getName()).isEqualTo(expected.getName());
    assertThat(actual.getPrice()).isEqualTo(expected.getPrice());
}
```

#### Valid — Multiple Properties in One AssertJ Chain

```java
@Test
void findProduct_whenProductExists_thenReturnProduct() {
    var actual = repository.findProduct(42L);

    assertThat(actual)
        .extracting(Product::getId, Product::getName, Product::getPrice)
        .containsExactly(42L, "Example", 19.99);
}
```

#### Invalid — Multiple Top-Level Assertions

```java
@Test
void findProduct_whenProductExists_thenReturnProduct() {
    var actual = repository.findProduct(42L);

    assertThat(actual.getId()).isEqualTo(42L);
    assertThat(actual.getName()).isEqualTo("Example");
    assertThat(actual.getPrice()).isEqualTo(19.99);
}
```

## Recursive Comparison

AssertJ Recursive Comparison SHOULD be used for complex objects, DTOs, entities, and nested object structures when a property-by-property comparison expresses the intended behavior.

### Rules

- Prefer `usingRecursiveComparison()` when comparing several properties or nested structures.
- Compare the complete relevant object whenever possible.
- Do not write multiple individual assertions when recursive comparison provides equivalent verification.
- Use `ignoringFields()` only for explicitly justified exclusions, such as generated identifiers or timestamps not under test.
- NEVER ignore fields solely to make a failing test pass.
- Prefer explicit exclusions over broad exclusion patterns.
- Use `withComparatorForType()` or `withComparatorForFields()` when a specific comparison rule is justified.
- Do not use recursive comparison when reference identity or the behavior of a particular `equals()` implementation is under test.
- A recursive comparison fluent chain counts as one top-level assertion call.
- Be mindful that recursive comparison can differ from `equals()` semantics and that collection ordering may matter; configure comparisons deliberately.

### Valid — Recursive Object Comparison

```java
@Test
void findProduct_whenProductExists_thenReturnProduct() {
    var actual = repository.findProduct(42L);
    var expected = new Product(42L, "Example", 19.99);

    assertThat(actual)
        .usingRecursiveComparison()
        .isEqualTo(expected);
}
```

### Valid — Nested Object Comparison

```java
@Test
void findOrder_whenOrderExists_thenReturnCompleteOrder() {
    var actual = service.findOrder(42L);
    var expected = createExpectedOrder();

    assertThat(actual)
        .usingRecursiveComparison()
        .isEqualTo(expected);
}
```

### Valid — Justified Exclusion of Generated Fields

```java
@Test
void save_whenProductIsValid_thenReturnSavedProduct() {
    var actual = repository.save(product);
    var expected = createExpectedProduct();

    // Database-generated fields are outside this test's contract.
    assertThat(actual)
        .usingRecursiveComparison()
        .ignoringFields("id", "createdAt")
        .isEqualTo(expected);
}
```

If generated fields are part of the required behavior, test them rather than exclude them.

## Assertion Selection Guidelines

1. Use `assertThat(actual).isEqualTo(expected)` for simple values and objects with suitable equality semantics.
2. Prefer `usingRecursiveComparison()` for complex objects and nested structures when a full property comparison is intended.
3. Use domain-specific helpers such as `assertProduct(actual, expected)` when verification requires several related checks or custom semantics.
4. Use AssertJ collection assertions for ordering, filtering, and collection contents.
5. Use AssertJ exception assertions for failure behavior.

## Quality Assurance Checklist

The QA agent MUST verify that:

- All new or modified test methods follow `<methodName>_when<Condition>_then<ExpectedResult>`.
- AssertJ is used consistently, including for exception assertions.
- Each test has exactly one top-level assertion call.
- Custom assertion helpers perform only related, side-effect-free checks.
- Recursive comparison is used appropriately, with justified exclusions.
- Assertions validate meaningful observable behavior and are not weakened to pass.
- Tests cover acceptance criteria and relevant regressions.
- Tests are deterministic and isolated from external systems where appropriate.
- Maven verification has actually run and its result is reported accurately.

Violations in newly created or modified tests MUST be corrected before a Pull Request is marked ready for human review.
