Feature: Sample Login

  @smoke
  Scenario: Validate login1
    Given user navigates to application
    # When user enters login info
    # Then user should see dashboard

  @smoke
  Scenario: Validate login2
    Given user navigates to application
    When user enters login info
    Then user should see dashboard
