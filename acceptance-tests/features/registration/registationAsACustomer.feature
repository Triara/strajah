Feature: Registration for a new customer
  In order to access private endpoints
  As a potential customer
  I want to be able to register into the security system

  Scenario: Successful registration
    When a not registrated user requests to register with data
    | user name | password |
    | Ironman   | Av3ng3Rs |
    Then strajah sends the user back a "201" status code
