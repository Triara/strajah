#language: en

Feature: Registration for a new customer
  In order to access private endpoints
  As a potential customer
  I want to be able to register into the security system

  Scenario: Successful registration
    When a not registered user requests to register with data
      | user name | password |
      | Ironman   | Av3ng3Rs |
    Then the response code must be 201
    And the customer is able to log in with his credentials
      | user name | password |
      | Ironman   | Av3ng3Rs |
    