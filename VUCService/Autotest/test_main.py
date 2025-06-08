import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_header_present(browser):
    browser.get("http://localhost:3000")
    header = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "header"))
    )
    assert header is not None, "Header component is not present"

def test_footer_present(browser):
    browser.get("http://localhost:3000")
    footer = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "footer"))
    )
    assert footer is not None, "Footer component is not present"

def test_military_news_slider_present(browser):
    browser.get("http://localhost:3000")
    news_slider = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".MilitaryNewsSlider"))
    )
    assert news_slider is not None, "MilitaryNewsSlider component is not present"

def test_military_schedule_present(browser):
    browser.get("http://localhost:3000")
    schedule = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".MilitarySchedule"))
    )
    assert schedule is not None, "MilitarySchedule component is not present"

def test_military_duty_schedule_present(browser):
    browser.get("http://localhost:3000")
    duty_schedule = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".MilitaryDutySchedule"))
    )
    assert duty_schedule is not None, "MilitaryDutySchedule component is not present"

def test_military_center_user_card_present(browser):
    browser.get("http://localhost:3000")
    user_card = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".MilitaryCenterUserCard"))
    )
    assert user_card is not None, "MilitaryCenterUserCard component is not present"

def test_military_center_main_duty_officer_present(browser):
    browser.get("http://localhost:3000")
    duty_officer = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".MilitaryCenterMainDutyOfficer"))
    )
    assert duty_officer is not None, "MilitaryCenterMainDutyOfficer component is not present"