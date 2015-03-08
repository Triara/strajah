#language: en

Feature: Reverse proxy
  In order to be protected by strajah
  As a server
  I want strajah to intercept all request for me

  @loadCustomConfig
  Scenario: A request to protected server is intercepted
    Given strajah is protecting the following path
      | protected path | allowed methods |
      | /api/me        | POST            |
    When a client app does the following request
      | path    | method | body          |
      | /api/me | POST   | {"its": "me"} |
    Then strajah forwards it to the protected server
