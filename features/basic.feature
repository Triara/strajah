Feature: Simple public/private setup

  Scenario: Private Endpoint
    Given strajah has default options
    When a client makes a 'GET' request to '/private' endpoint
    Then the response status code is 403
    And the response body must be '{"err":"forbidden", "des":"you are not authorized to access this path"}'
    And the request can continue
