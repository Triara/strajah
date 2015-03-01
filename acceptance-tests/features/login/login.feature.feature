Feature: Login
  In order to access private endpoints
  As a customer
  I want to be able to log into the security system

  Scenario: Customer logs in successfully
    Given a registrated customer with data
      | user name | password |
      | Ironman   | Av3ng3Rs |
    When the customer "Ironman" logs in with password "Av3ng3Rs"
    Then the response code must be 200
    And the response body has "accessToken" property
