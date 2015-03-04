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


    Scenario: Unsuccessful registration - already registered customer with the same name
      Given a registered customer with data
        | user name | password |
        | Ironman   | Av3ng3Rs |
      When a not registered user requests to register with data
        | user name | password     |
        | Ironman   | I'm a clon!  |
      Then the response code must be 401
      And the customer is not able to log in with his credentials
        | user name | password     |
        | Ironman   | I'm a clon!  |


  Scenario: Unsuccessful registration - missing user name
    When a not registered user requests to register with data
      | user name | password |
      |           | Av3ng3Rs |
    Then the response code must be 400


  Scenario: Unsuccessful registration - missing password
    When a not registered user requests to register with data
      | user name | password |
      | Ironman   |          |
    Then the response code must be 400
