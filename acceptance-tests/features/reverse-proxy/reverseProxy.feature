#language: en

Feature: Reverse proxy
  In order to be protected by strajah
  As a customer
  I want strajah to intercept all request for me

  @loadCustomConfig
  @protectedServer
  Scenario: A request to protected server is intercepted
    Given the protected server has the following paths
      | path    | method |
      | /api/me | POST   |
    And strajah is protecting the following path
      | protected path | allowed methods |
      | /api/me        | POST            |
    And a registered customer with data
      | user name | password |
      | Ironman   | Av3ng3Rs |
    And the customer is logged in
    When the customer does the following request to strajah
      | path    | method | body          |
      | /api/me | POST   | {"its": "me"} |
    Then the protected server receives the request from user "Ironman"


  @loadCustomConfig
  @protectedServer
  Scenario: Strajah protects paths using a regexp
    Given the protected server has the following paths
      | path    | method |
      | /api/me | POST   |
      | /api/me | GET    |
    And strajah is protecting the following path
      | protected path | allowed methods |
      | /(.*)/         | GET             |
    And a registered customer with data
      | user name | password |
      | Ironman   | Av3ng3Rs |
    And the customer is logged in
    When the customer does the following request to strajah
      | path    | method |
      | /api/me | GET    |
    Then the protected server receives the request from user "Ironman"


  @loadCustomConfig
  @protectedServer
  Scenario: Strajah does not let not logged users to access protects paths
    Given the protected server has the following paths
      | path    | method |
      | /api/me | POST   |
      | /api/me | GET    |
    And strajah is protecting the following path
      | protected path | allowed methods |
      | /(.*)/         | GET             |
    When a not logged in customer does the following request to strajah
      | path    | method |
      | /api/me | GET    |
    Then the response code must be 401
    And strajah does not forward it to the protected server
